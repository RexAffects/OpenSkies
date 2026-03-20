-- Flag Submissions + Anomaly Detection
-- Individual flag reports with hashed reporter identity for dedup/anti-abuse

-- ============================================================
-- FLAG SUBMISSIONS (individual reports, service-role only)
-- ============================================================

CREATE TABLE flag_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tail_number TEXT NOT NULL,
  icao_hex TEXT,
  reporter_hash TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (char_length(reason) <= 300),
  reporter_notes TEXT CHECK (char_length(reporter_notes) <= 500),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  altitude_ft INT,
  suspicion_score NUMERIC(4,1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_tail ON flag_submissions (tail_number);
CREATE INDEX idx_submissions_reporter ON flag_submissions (reporter_hash, tail_number);
CREATE INDEX idx_submissions_created ON flag_submissions (created_at DESC);

-- RLS: NO anon policies. Only service role can insert/read.
ALTER TABLE flag_submissions ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- FLAG ANOMALIES (admin-only gaming alerts)
-- ============================================================

CREATE TABLE flag_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anomaly_type TEXT NOT NULL CHECK (anomaly_type IN ('burst', 'scatter_bomb', 'low_score_target', 'ip_cluster')),
  details JSONB NOT NULL DEFAULT '{}',
  tail_number TEXT,
  reporter_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_anomalies_type ON flag_anomalies (anomaly_type);
CREATE INDEX idx_anomalies_created ON flag_anomalies (created_at DESC);

-- RLS: NO anon policies. Only service role can insert/read.
ALTER TABLE flag_anomalies ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- ALTER flight_flags: add aggregate columns
-- ============================================================

ALTER TABLE flight_flags ADD COLUMN IF NOT EXISTS unique_reporters INT DEFAULT 0;
ALTER TABLE flight_flags ADD COLUMN IF NOT EXISTS threat_level TEXT DEFAULT 'none'
  CHECK (threat_level IN ('none', 'low', 'medium', 'high'));
ALTER TABLE flight_flags ADD COLUMN IF NOT EXISTS lifetime_flag_count INT DEFAULT 0;
