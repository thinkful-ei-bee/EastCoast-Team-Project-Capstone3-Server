CREATE TABLE "user_profile" (
    "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    "profile_picture" TEXT NOT NULL,
    "music_like" TEXT,
    "movie_like" TEXT,
    "me_intro" TEXT NOT NULL,
    "user_id" INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    "date_created" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);



CREATE TABLE "private_Events" (
  "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "event_name" TEXT NOT NULL, 
  "event_date" DATE NOT NULL, 
  "event_time" TIME NOT NULL,
  "event_location" TEXT NOT NULL, 
  "event_details" TEXT,  
  "event_owner" INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    "date_created" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);