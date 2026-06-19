-- ============================================================
-- CAMER CONNECT MÉCA — Migration v1 — Base de données complète
-- Supabase PostgreSQL
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Pour la géolocalisation

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('client', 'professionnel', 'admin');
CREATE TYPE forfait_type AS ENUM ('bronze', 'argent', 'or');
CREATE TYPE statut_abonnement AS ENUM ('essai', 'actif', 'expire', 'suspendu');
CREATE TYPE statut_rdv AS ENUM ('en_attente', 'confirme', 'en_cours', 'termine', 'annule');
CREATE TYPE statut_paiement AS ENUM ('en_attente', 'succes', 'echec', 'rembourse');
CREATE TYPE methode_paiement AS ENUM ('orange_money', 'mtn_momo', 'wave', 'campay');
CREATE TYPE type_vehicule AS ENUM ('moto', 'voiture', 'camion', 'poids_lourd', 'autre');
CREATE TYPE expediteur_msg AS ENUM ('client', 'garage');

-- ============================================================
-- TABLE: profils
-- ============================================================

CREATE TABLE profils (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nom           TEXT NOT NULL,
  prenom        TEXT,
  telephone     TEXT UNIQUE,
  email         TEXT,
  role          user_role NOT NULL DEFAULT 'client',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TABLE: garages
-- ============================================================

CREATE TABLE garages (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  proprietaire_id     UUID REFERENCES profils(id) ON DELETE CASCADE NOT NULL,
  nom                 TEXT NOT NULL,
  description         TEXT,
  telephone           TEXT NOT NULL,
  whatsapp            TEXT,
  email               TEXT,
  adresse             TEXT NOT NULL,
  ville               TEXT NOT NULL,
  region              TEXT NOT NULL,
  latitude            DOUBLE PRECISION,
  longitude           DOUBLE PRECISION,
  localisation        GEOMETRY(POINT, 4326),
  horaires            JSONB DEFAULT '{}',
  specialites         TEXT[] DEFAULT '{}',
  types_vehicules     type_vehicule[] DEFAULT '{}',
  photos              TEXT[] DEFAULT '{}',
  photo_principale    TEXT,
  est_verifie         BOOLEAN DEFAULT FALSE NOT NULL,
  est_actif           BOOLEAN DEFAULT TRUE NOT NULL,
  note_moyenne        NUMERIC(3,2) DEFAULT 0 NOT NULL,
  total_avis          INTEGER DEFAULT 0 NOT NULL,
  forfait_actuel      forfait_type,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index spatial pour géolocalisation
CREATE INDEX idx_garages_localisation ON garages USING GIST(localisation);
CREATE INDEX idx_garages_ville ON garages(ville);
CREATE INDEX idx_garages_region ON garages(region);
CREATE INDEX idx_garages_forfait ON garages(forfait_actuel);
CREATE INDEX idx_garages_actif ON garages(est_actif);

-- Trigger pour mettre à jour la géométrie quand lat/lng changent
CREATE OR REPLACE FUNCTION update_garage_localisation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.localisation = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_garage_localisation
  BEFORE INSERT OR UPDATE OF latitude, longitude ON garages
  FOR EACH ROW EXECUTE FUNCTION update_garage_localisation();

-- ============================================================
-- TABLE: abonnements
-- ============================================================

CREATE TABLE abonnements (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  garage_id       UUID REFERENCES garages(id) ON DELETE CASCADE NOT NULL,
  forfait         forfait_type NOT NULL,
  statut          statut_abonnement DEFAULT 'essai' NOT NULL,
  periode         TEXT CHECK (periode IN ('mensuel', 'annuel')) NOT NULL DEFAULT 'mensuel',
  montant         INTEGER NOT NULL, -- En XAF
  date_debut      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  date_fin        TIMESTAMPTZ NOT NULL,
  auto_renouvellement BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_abonnements_garage ON abonnements(garage_id);
CREATE INDEX idx_abonnements_statut ON abonnements(statut);
CREATE INDEX idx_abonnements_date_fin ON abonnements(date_fin);

-- ============================================================
-- TABLE: paiements
-- ============================================================

CREATE TABLE paiements (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  abonnement_id         UUID REFERENCES abonnements(id) ON DELETE SET NULL,
  garage_id             UUID REFERENCES garages(id) ON DELETE CASCADE NOT NULL,
  montant               INTEGER NOT NULL, -- En XAF
  devise                TEXT DEFAULT 'XAF' NOT NULL,
  methode               methode_paiement NOT NULL,
  statut                statut_paiement DEFAULT 'en_attente' NOT NULL,
  reference_campay      TEXT UNIQUE,
  reference_operateur   TEXT,
  telephone_paiement    TEXT,
  metadata              JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_paiements_garage ON paiements(garage_id);
CREATE INDEX idx_paiements_statut ON paiements(statut);
CREATE INDEX idx_paiements_reference ON paiements(reference_campay);

-- ============================================================
-- TABLE: rendez_vous
-- ============================================================

CREATE TABLE rendez_vous (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  garage_id             UUID REFERENCES garages(id) ON DELETE CASCADE NOT NULL,
  client_id             UUID REFERENCES profils(id) ON DELETE CASCADE NOT NULL,
  type_vehicule         type_vehicule NOT NULL,
  immatriculation       TEXT,
  marque_vehicule       TEXT,
  description_probleme  TEXT NOT NULL,
  statut                statut_rdv DEFAULT 'en_attente' NOT NULL,
  date_rdv              DATE NOT NULL,
  heure_rdv             TIME NOT NULL,
  notes_garage          TEXT,
  montant_estime        INTEGER, -- En XAF
  created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_rdv_garage ON rendez_vous(garage_id);
CREATE INDEX idx_rdv_client ON rendez_vous(client_id);
CREATE INDEX idx_rdv_date ON rendez_vous(date_rdv);
CREATE INDEX idx_rdv_statut ON rendez_vous(statut);

-- ============================================================
-- TABLE: avis
-- ============================================================

CREATE TABLE avis (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  garage_id     UUID REFERENCES garages(id) ON DELETE CASCADE NOT NULL,
  client_id     UUID REFERENCES profils(id) ON DELETE CASCADE NOT NULL,
  rdv_id        UUID REFERENCES rendez_vous(id) ON DELETE SET NULL,
  note          INTEGER CHECK (note >= 1 AND note <= 5) NOT NULL,
  commentaire   TEXT,
  est_verifie   BOOLEAN DEFAULT FALSE NOT NULL, -- TRUE si lié à un RDV terminé
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(garage_id, client_id, rdv_id) -- Un avis par RDV
);

CREATE INDEX idx_avis_garage ON avis(garage_id);
CREATE INDEX idx_avis_client ON avis(client_id);

-- Trigger pour recalculer la note moyenne du garage
CREATE OR REPLACE FUNCTION update_garage_note()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE garages
  SET
    note_moyenne = (
      SELECT ROUND(AVG(note)::NUMERIC, 2)
      FROM avis
      WHERE garage_id = COALESCE(NEW.garage_id, OLD.garage_id)
    ),
    total_avis = (
      SELECT COUNT(*) FROM avis
      WHERE garage_id = COALESCE(NEW.garage_id, OLD.garage_id)
    )
  WHERE id = COALESCE(NEW.garage_id, OLD.garage_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_garage_note
  AFTER INSERT OR UPDATE OR DELETE ON avis
  FOR EACH ROW EXECUTE FUNCTION update_garage_note();

-- ============================================================
-- TABLE: messages
-- ============================================================

CREATE TABLE messages (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  garage_id     UUID REFERENCES garages(id) ON DELETE CASCADE NOT NULL,
  client_id     UUID REFERENCES profils(id) ON DELETE CASCADE NOT NULL,
  expediteur    expediteur_msg NOT NULL,
  contenu       TEXT NOT NULL,
  lu            BOOLEAN DEFAULT FALSE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_messages_garage ON messages(garage_id);
CREATE INDEX idx_messages_client ON messages(client_id);
CREATE INDEX idx_messages_lu ON messages(lu);

-- ============================================================
-- FUNCTION: recherche garages par distance
-- ============================================================

CREATE OR REPLACE FUNCTION rechercher_garages_proximite(
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_rayon_km INTEGER DEFAULT 10,
  p_type_vehicule type_vehicule DEFAULT NULL,
  p_specialite TEXT DEFAULT NULL,
  p_forfait forfait_type DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  nom TEXT,
  adresse TEXT,
  ville TEXT,
  note_moyenne NUMERIC,
  total_avis INTEGER,
  forfait_actuel forfait_type,
  est_verifie BOOLEAN,
  photo_principale TEXT,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.nom,
    g.adresse,
    g.ville,
    g.note_moyenne,
    g.total_avis,
    g.forfait_actuel,
    g.est_verifie,
    g.photo_principale,
    ROUND(
      ST_Distance(
        ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
        g.localisation::geography
      ) / 1000
    )::DOUBLE PRECISION AS distance_km
  FROM garages g
  WHERE
    g.est_actif = TRUE
    AND g.localisation IS NOT NULL
    AND ST_DWithin(
      ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
      g.localisation::geography,
      p_rayon_km * 1000
    )
    AND (p_type_vehicule IS NULL OR p_type_vehicule = ANY(g.types_vehicules))
    AND (p_specialite IS NULL OR p_specialite = ANY(g.specialites))
    AND (p_forfait IS NULL OR g.forfait_actuel = p_forfait)
  ORDER BY
    CASE g.forfait_actuel
      WHEN 'or' THEN 1
      WHEN 'argent' THEN 2
      WHEN 'bronze' THEN 3
      ELSE 4
    END,
    distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profils ENABLE ROW LEVEL SECURITY;
ALTER TABLE garages ENABLE ROW LEVEL SECURITY;
ALTER TABLE abonnements ENABLE ROW LEVEL SECURITY;
ALTER TABLE paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rendez_vous ENABLE ROW LEVEL SECURITY;
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profils
CREATE POLICY "profils_select_own" ON profils FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "profils_update_own" ON profils FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profils_insert_own" ON profils FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Garages — Lecture publique pour les garages actifs
CREATE POLICY "garages_select_public" ON garages
  FOR SELECT USING (est_actif = TRUE);

CREATE POLICY "garages_insert_owner" ON garages
  FOR INSERT WITH CHECK (
    proprietaire_id = (SELECT id FROM profils WHERE user_id = auth.uid())
  );

CREATE POLICY "garages_update_owner" ON garages
  FOR UPDATE USING (
    proprietaire_id = (SELECT id FROM profils WHERE user_id = auth.uid())
  );

-- Abonnements — Accès propriétaire seulement
CREATE POLICY "abonnements_select_owner" ON abonnements
  FOR SELECT USING (
    garage_id IN (
      SELECT id FROM garages
      WHERE proprietaire_id = (SELECT id FROM profils WHERE user_id = auth.uid())
    )
  );

-- Paiements
CREATE POLICY "paiements_select_owner" ON paiements
  FOR SELECT USING (
    garage_id IN (
      SELECT id FROM garages
      WHERE proprietaire_id = (SELECT id FROM profils WHERE user_id = auth.uid())
    )
  );

-- RDV
CREATE POLICY "rdv_select_parties" ON rendez_vous
  FOR SELECT USING (
    client_id = (SELECT id FROM profils WHERE user_id = auth.uid())
    OR garage_id IN (
      SELECT id FROM garages
      WHERE proprietaire_id = (SELECT id FROM profils WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "rdv_insert_client" ON rendez_vous
  FOR INSERT WITH CHECK (
    client_id = (SELECT id FROM profils WHERE user_id = auth.uid())
  );

-- Avis — Lecture publique
CREATE POLICY "avis_select_public" ON avis FOR SELECT USING (TRUE);
CREATE POLICY "avis_insert_client" ON avis
  FOR INSERT WITH CHECK (
    client_id = (SELECT id FROM profils WHERE user_id = auth.uid())
  );

-- Messages
CREATE POLICY "messages_select_parties" ON messages
  FOR SELECT USING (
    client_id = (SELECT id FROM profils WHERE user_id = auth.uid())
    OR garage_id IN (
      SELECT id FROM garages
      WHERE proprietaire_id = (SELECT id FROM profils WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "messages_insert_parties" ON messages
  FOR INSERT WITH CHECK (
    client_id = (SELECT id FROM profils WHERE user_id = auth.uid())
    OR garage_id IN (
      SELECT id FROM garages
      WHERE proprietaire_id = (SELECT id FROM profils WHERE user_id = auth.uid())
    )
  );

-- ============================================================
-- TRIGGER: Créer profil automatiquement à l'inscription
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profils (user_id, nom, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'),
    NEW.email,
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('garage-photos', 'garage-photos', TRUE),
  ('avatars', 'avatars', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONNÉES DE TEST (villes camerounaises)
-- ============================================================
-- À décommenter pour le développement :
/*
INSERT INTO profils (user_id, nom, prenom, telephone, email, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Kamga', 'Pierre', '+237690000001', 'pierre@test.cm', 'professionnel'),
  ('00000000-0000-0000-0000-000000000002', 'Mbarga', 'Marie', '+237690000002', 'marie@test.cm', 'client');
*/
