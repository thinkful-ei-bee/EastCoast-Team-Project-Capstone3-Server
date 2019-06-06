CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "date_created" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);


