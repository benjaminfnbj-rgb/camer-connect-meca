// ============================================
// CAMER CONNECT MÉCA — Types TypeScript
// ============================================

export type UserRole = 'client' | 'professionnel' | 'admin'
export type FormatAbonnement = 'bronze' | 'argent' | 'or'
export type StatutAbonnement = 'actif' | 'expire' | 'suspendu' | 'essai'
export type StatutRDV = 'en_attente' | 'confirme' | 'en_cours' | 'termine' | 'annule'
export type StatutPaiement = 'en_attente' | 'succes' | 'echec' | 'rembourse'
export type MethodePaiement = 'orange_money' | 'mtn_momo' | 'wave' | 'campay'
export type TypeVehicule = 'moto' | 'voiture' | 'camion' | 'poids_lourd' | 'autre'

export interface Profil {
  id: string
  user_id: string
  nom: string
  prenom: string
  telephone: string
  email: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Garage {
  id: string
  proprietaire_id: string
  nom: string
  description?: string
  telephone: string
  whatsapp?: string
  email?: string
  adresse: string
  ville: string
  region: string
  latitude?: number
  longitude?: number
  horaires?: Horaires
  specialites: SpecialiteGarage[]
  types_vehicules: TypeVehicule[]
  photos: string[]
  photo_principale?: string
  est_verifie: boolean
  est_actif: boolean
  note_moyenne: number
  total_avis: number
  forfait_actuel: FormatAbonnement | null
  created_at: string
  updated_at: string
}

export interface Horaires {
  lundi?: JourHoraire
  mardi?: JourHoraire
  mercredi?: JourHoraire
  jeudi?: JourHoraire
  vendredi?: JourHoraire
  samedi?: JourHoraire
  dimanche?: JourHoraire
}

export interface JourHoraire {
  ouvert: boolean
  ouverture?: string
  fermeture?: string
}

export type SpecialiteGarage =
  | 'vidange'
  | 'freinage'
  | 'electricite'
  | 'carrosserie'
  | 'pneus'
  | 'climatisation'
  | 'moteur'
  | 'transmission'
  | 'suspension'
  | 'diagnostic'
  | 'soudure'
  | 'vitrage'
  | 'revision_complete'
  | 'pieces_detachees'

export interface Abonnement {
  id: string
  garage_id: string
  forfait: FormatAbonnement
  statut: StatutAbonnement
  date_debut: string
  date_fin: string
  montant_mensuel: number
  montant_annuel: number
  periode: 'mensuel' | 'annuel'
  created_at: string
}

export interface Paiement {
  id: string
  abonnement_id: string
  garage_id: string
  montant: number
  devise: 'XAF'
  methode: MethodePaiement
  statut: StatutPaiement
  reference_campay?: string
  reference_operateur?: string
  telephone_paiement?: string
  created_at: string
}

export interface RendezVous {
  id: string
  garage_id: string
  client_id: string
  type_vehicule: TypeVehicule
  immatriculation?: string
  marque_vehicule?: string
  description_probleme: string
  statut: StatutRDV
  date_rdv: string
  heure_rdv: string
  notes_garage?: string
  montant_estime?: number
  created_at: string
  updated_at: string
  garage?: Garage
  client?: Profil
}

export interface Avis {
  id: string
  garage_id: string
  client_id: string
  rdv_id?: string
  note: number // 1-5
  commentaire?: string
  est_verifie: boolean
  created_at: string
  client?: Profil
}

export interface Message {
  id: string
  garage_id: string
  client_id: string
  expediteur: 'client' | 'garage'
  contenu: string
  lu: boolean
  created_at: string
}

// Forfaits pricing
export const FORFAITS = {
  bronze: {
    nom: 'Bronze',
    couleur: '#CD7F32',
    mensuel: 5000,
    annuel: 50000,
    emoji: '🥉',
    description: 'Visibilité de base pour démarrer',
    avantages: [
      'Profil garage complet',
      'Apparition dans les recherches',
      '3 photos du garage',
      'Réception des avis clients',
    ],
    limitations: [
      'Pas de badge vérifié',
      'Pas de statistiques',
      'Pas de gestion RDV',
      'Pas de mise en avant carte',
    ],
  },
  argent: {
    nom: 'Argent',
    couleur: '#C0C0C0',
    mensuel: 12000,
    annuel: 120000,
    emoji: '🥈',
    description: 'Pour les professionnels actifs',
    avantages: [
      'Tout Bronze inclus',
      'Badge "Vérifié" sur la carte',
      '10 photos + vidéo',
      'Prise de RDV en ligne',
      'Statistiques basiques',
      'Chat avec les clients',
      'Priorité dans les résultats',
    ],
    limitations: [
      'Pas de boost carte premium',
      'Pas de promotions push',
    ],
  },
  or: {
    nom: 'Or',
    couleur: '#FFD700',
    mensuel: 25000,
    annuel: 250000,
    emoji: '🥇',
    description: 'Leader du marché',
    avantages: [
      'Tout Argent inclus',
      'Position TOP sur la carte',
      'Icône dorée distinctive',
      'Bandeau "Partenaire Premium"',
      'Statistiques avancées',
      'Notification push mensuelle (rayon 10km)',
      'Catalogue pièces détachées',
      'Support prioritaire CCS',
      'Publicité dans l\'app',
    ],
    limitations: [],
  },
} as const

export const REGIONS_CAMEROUN = [
  'Adamaoua', 'Centre', 'Est', 'Extrême-Nord',
  'Littoral', 'Nord', 'Nord-Ouest', 'Ouest',
  'Sud', 'Sud-Ouest'
] as const

export const VILLES_PRINCIPALES = [
  'Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Maroua',
  'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Buea', 'Garoua',
  'Kribi', 'Limbe', 'Kumba', 'Dschang', 'Foumban'
] as const
