INSERT INTO "users" ( "user_name","email", "full_name", "password","gender")
VALUES
  (
    
    'admin',
    'dunder_mifflin@gmail.com',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'male'
  ),
   (
  
    'admin-date',
    'dunder_mifflin_date@gmail.com',
    'Tender Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'female'
  );

INSERT INTO "user_profile" ("profile_picture","music_like","movie_like","me_intro","user_id")
VALUES
  (
    
    'https://reason.org/wp-content/uploads/2018/01/guybentley.jpg',
    'rock',
    'frozen',
    'I am passionate',
    1
  ),
  (
    
    'https://assets.capitalfm.com/2018/23/lilliya-scarlett-instagram-1528814125-custom-0.png',
    'country',
    'frozen',
    'I am passionate',
    2
  );

INSERT INTO "events" ("event_name","event_date","event_time","event_location","event_details","event_owner_id","is_private")
VALUES
  (
  'movie',
  '2019-07-30',
  '02:03:04',
  'nyc',
  'movie night',
  1,
  'false'),
  (
  'concert',
  '2019-07-30',
  '02:03:04',
  'philadelphia',
  'music concert',
  1,
  'true'),
  (
  'private jet',
  '2019-07-23',
  '05:03:05',
  'california',
  'touring the city',
  1,
  'true');
