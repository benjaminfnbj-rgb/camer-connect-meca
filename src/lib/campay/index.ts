// ============================================================
// CamPay — Intégration paiement mobile Cameroun
// Orange Money · MTN MoMo via CamPay API
// ============================================================

const CAMPAY_BASE_URL =
  process.env.NEXT_PUBLIC_CAMPAY_ENV === 'PROD'
    ? 'https://demo.campay.net/api'  // Changer en prod: https://campay.net/api
    : 'https://demo.campay.net/api'

interface CamPayTokenResponse {
  token: string
}

interface CamPayCollectRequest {
  amount: string
  currency: 'XAF'
  from: string          // Numéro de téléphone (237XXXXXXXXX)
  description: string
  external_reference?: string
}

interface CamPayCollectResponse {
  reference: string
  ussd_code?: string
  operator: string
  status: string
}

interface CamPayStatusResponse {
  reference: string
  status: 'SUCCESSFUL' | 'FAILED' | 'PENDING'
  amount: string
  currency: string
  operator: string
  code: string
  operator_reference?: string
  description?: string
}

// ============================================================
// Obtenir le token CamPay
// ============================================================

async function getCamPayToken(): Promise<string> {
  const res = await fetch(`${CAMPAY_BASE_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: process.env.CAMPAY_APP_USERNAME,
      password: process.env.CAMPAY_APP_PASSWORD,
    }),
  })

  if (!res.ok) {
    throw new Error(`CamPay auth failed: ${res.status}`)
  }

  const data: CamPayTokenResponse = await res.json()
  return data.token
}

// ============================================================
// Initier un paiement (collecte)
// ============================================================

export async function initierPaiementCamPay(
  telephone: string,
  montant: number,
  description: string,
  referenceExterne?: string
): Promise<CamPayCollectResponse> {
  const token = await getCamPayToken()

  // Normaliser le numéro de téléphone camerounais
  const tel = telephone.replace(/\s+/g, '').replace(/^\+/, '')
  const telNormalise = tel.startsWith('237') ? tel : `237${tel}`

  const body: CamPayCollectRequest = {
    amount: montant.toString(),
    currency: 'XAF',
    from: telNormalise,
    description,
    external_reference: referenceExterne,
  }

  const res = await fetch(`${CAMPAY_BASE_URL}/collect/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`CamPay collect failed: ${JSON.stringify(err)}`)
  }

  return res.json()
}

// ============================================================
// Vérifier le statut d'un paiement
// ============================================================

export async function verifierStatutPaiement(
  reference: string
): Promise<CamPayStatusResponse> {
  const token = await getCamPayToken()

  const res = await fetch(`${CAMPAY_BASE_URL}/transaction/${reference}/`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`CamPay status check failed: ${res.status}`)
  }

  return res.json()
}

// ============================================================
// Polling: attendre confirmation (max 3 minutes)
// ============================================================

export async function attendreConfirmationPaiement(
  reference: string,
  onStatusUpdate?: (statut: string) => void,
  maxAttenteMs = 180_000
): Promise<CamPayStatusResponse> {
  const debut = Date.now()
  const intervalle = 5000 // Poll toutes les 5 secondes

  while (Date.now() - debut < maxAttenteMs) {
    const statut = await verifierStatutPaiement(reference)

    if (onStatusUpdate) onStatusUpdate(statut.status)

    if (statut.status === 'SUCCESSFUL' || statut.status === 'FAILED') {
      return statut
    }

    await new Promise((r) => setTimeout(r, intervalle))
  }

  throw new Error('Timeout: paiement non confirmé après 3 minutes')
}

// ============================================================
// Montants des forfaits en XAF
// ============================================================

export const PRIX_FORFAITS = {
  bronze: { mensuel: 5000, annuel: 50000 },
  argent: { mensuel: 12000, annuel: 120000 },
  or:     { mensuel: 25000, annuel: 250000 },
} as const

export type ForfaitType = keyof typeof PRIX_FORFAITS
export type Periode = 'mensuel' | 'annuel'
