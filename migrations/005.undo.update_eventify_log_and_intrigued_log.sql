ALTER TABLE "eventify_log"
  DROP COLUMN IF EXISTS "is_accept";

ALTER TABLE "intrigued_log"
  DROP COLUMN IF EXISTS "event_owner_id";  