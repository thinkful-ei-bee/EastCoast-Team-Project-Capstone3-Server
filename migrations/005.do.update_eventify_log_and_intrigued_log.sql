ALTER TABLE "eventify_log"
  ADD COLUMN "is_accept" BOOLEAN DEFAULT 'false';


ALTER TABLE "intrigued_log"
  ADD COLUMN "event_owner_id" INTEGER REFERENCES "users"(id)
    ON DELETE SET NULL;