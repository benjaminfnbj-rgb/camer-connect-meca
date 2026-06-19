# 🔧 Camer Connect Méca

**Filiale #13 — Cameroun Connect Service (CCS)**

Plateforme numérique de mise en relation entre professionnels de la mécanique et automobilistes au Cameroun.

## Stack Technique

- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Paiement**: CamPay (Orange Money · MTN MoMo)
- **Email**: Resend
- **Déploiement**: Vercel
- **Auth**: Supabase Auth (Email + Google OAuth)

## Forfaits

| Forfait | Mensuel | Annuel |
|---------|---------|--------|
| 🥉 Bronze | 5 000 XAF | 50 000 XAF |
| 🥈 Argent | 12 000 XAF | 120 000 XAF |
| 🥇 Or | 25 000 XAF | 250 000 XAF |

> 30 jours d'essai gratuit pour tout nouveau garage.

## Développement

```bash
npm install
cp .env.example .env.local
# Remplir les variables dans .env.local
npm run dev
```

## Variables d'environnement

Voir `.env.example` pour la liste complète.

## Base de données

Le schéma SQL complet est dans `supabase/migrations/001_initial_schema.sql`

---

© 2026 Cameroun Connect Service · RCCM RC/BJN/2026/A/15
