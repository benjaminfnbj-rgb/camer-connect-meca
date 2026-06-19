import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  initierPaiementCamPay,
  verifierStatutPaiement,
  PRIX_FORFAITS,
  type ForfaitType,
  type Periode,
} from '@/lib/campay'

// POST /api/campay/initier — Initier un paiement d'abonnement
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { garage_id, forfait, periode, telephone } = await req.json()

    // Validation
    if (!garage_id || !forfait || !periode || !telephone) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const forfaitKey = forfait as ForfaitType
    const periodeKey = periode as Periode

    if (!PRIX_FORFAITS[forfaitKey]) {
      return NextResponse.json({ error: 'Forfait invalide' }, { status: 400 })
    }

    const montant = PRIX_FORFAITS[forfaitKey][periodeKey]

    // Vérifier que le garage appartient à l'utilisateur
    const { data: profil } = await supabase
      .from('profils')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const { data: garage } = await supabase
      .from('garages')
      .select('id, nom')
      .eq('id', garage_id)
      .eq('proprietaire_id', profil?.id)
      .single()

    if (!garage) {
      return NextResponse.json({ error: 'Garage non trouvé' }, { status: 404 })
    }

    // Créer l'enregistrement abonnement en attente
    const dateDebut = new Date()
    const dateFin = new Date(dateDebut)
    if (periodeKey === 'mensuel') {
      dateFin.setMonth(dateFin.getMonth() + 1)
    } else {
      dateFin.setFullYear(dateFin.getFullYear() + 1)
    }

    const { data: abonnement } = await supabase
      .from('abonnements')
      .insert({
        garage_id,
        forfait: forfaitKey,
        statut: 'essai',
        periode: periodeKey,
        montant,
        date_debut: dateDebut.toISOString(),
        date_fin: dateFin.toISOString(),
      })
      .select()
      .single()

    // Initier le paiement CamPay
    const paiementResponse = await initierPaiementCamPay(
      telephone,
      montant,
      `Abonnement ${forfait} ${periodeKey} — ${garage.nom} — Camer Connect Méca`,
      abonnement?.id
    )

    // Enregistrer le paiement
    await supabase.from('paiements').insert({
      abonnement_id: abonnement?.id,
      garage_id,
      montant,
      devise: 'XAF',
      methode: 'campay',
      statut: 'en_attente',
      reference_campay: paiementResponse.reference,
      telephone_paiement: telephone,
    })

    return NextResponse.json({
      success: true,
      reference: paiementResponse.reference,
      ussd_code: paiementResponse.ussd_code,
      message: 'Paiement initié. Veuillez confirmer sur votre téléphone.',
    })
  } catch (error) {
    console.error('[CamPay] Erreur initiation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'initiation du paiement' },
      { status: 500 }
    )
  }
}

// GET /api/campay/statut?reference=xxx — Vérifier le statut
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const reference = req.nextUrl.searchParams.get('reference')
    if (!reference) {
      return NextResponse.json({ error: 'Référence manquante' }, { status: 400 })
    }

    const statut = await verifierStatutPaiement(reference)

    // Si paiement réussi, activer l'abonnement
    if (statut.status === 'SUCCESSFUL') {
      const { data: paiement } = await supabase
        .from('paiements')
        .select('abonnement_id, garage_id')
        .eq('reference_campay', reference)
        .single()

      if (paiement) {
        // Activer l'abonnement
        await supabase
          .from('abonnements')
          .update({ statut: 'actif' })
          .eq('id', paiement.abonnement_id)

        // Récupérer le forfait de l'abonnement
        const { data: abo } = await supabase
          .from('abonnements')
          .select('forfait')
          .eq('id', paiement.abonnement_id)
          .single()

        // Mettre à jour le forfait du garage
        if (abo) {
          await supabase
            .from('garages')
            .update({ forfait_actuel: abo.forfait })
            .eq('id', paiement.garage_id)
        }

        // Mettre à jour le paiement
        await supabase
          .from('paiements')
          .update({
            statut: 'succes',
            reference_operateur: statut.operator_reference,
          })
          .eq('reference_campay', reference)
      }
    }

    return NextResponse.json({
      reference,
      statut: statut.status,
      operateur: statut.operator,
    })
  } catch (error) {
    console.error('[CamPay] Erreur vérification:', error)
    return NextResponse.json({ error: 'Erreur vérification paiement' }, { status: 500 })
  }
}
