# Rendezvous

## Authors:
* Farah Gustafson
* Jizong Liang
* Laurel Butler

### Link to Live App:
[Rendezvous](https://rendezvous-app.now.sh/)

### API used:
[Client Repo](https://github.com/thinkful-ei-bee/EastCoast-Team-Project-Client)

### App Summary:
Welcome to Rendezvous, where singles meet their perfect mate by eventifying their dating experience!
Here in Rendezvous, we cut out the awkwardness of finding mutual interests for first dates, second dates, or even third dates! When matched you can see the events your eventifyee created. When you see something you like, you can click the intrigue button and they will be notified of the event you are interested in attending with them and vice versa.

### Setup:
Clone or fork this repository and [the server repository](https://github.com/thinkful-ei-bee/EastCoast-Team-Project-Capstone3-Server). Run `npm install` on the client side and for the server you want to also run `npm install` in addition to creating the databases named **rendezvous** and **rendezvous-test**.
You then want to create a .env file with the following information:
```NODE_ENV=development
PORT=8000
TZ='UTC'
MIGRATION_DB_HOST=127.0.0.1
MIGRATION_DB_PORT=5432
MIGRATION_DB_NAME=rendezvous
MIGRATION_DB_USER=(the username for your new database)
MIGRATION_DB_PASS=(password for your new database)
DB_URL="postgresql://(user):(password)@localhost/rendezvous"
TEST_DB_URL="postgresql://(user):(password)@localhost/rendezvous-test"
JWT_SECRET="(whatever you want here)"
```
Now you will run `npm run migrate` to configure the database and `npm run migrate --NODE_ENV=test` to set up the test database.
In the config.js file on the client side, you'll change the API_ENDPOINT to point to your local server. It by default is `http://localhost:3000`.
You are good to go at this point and simply need to run `npm start` for the client and to start the nodemon, it's `npm run dev`.


### Scripts:
1. Install the packages for the application `npm install`
2. Start the application `npm start`
3. Start the nodemon for the application `npm run dev`
4. Run the migrations up `npm run migrate`
5. Seed the database
6. Run the migrations down `npm run migrate --0`

### Authorization:
You can create your own account or you can use these credentials to test the app:<br>
#### Male Account:
Username: demoMale1<br>
Password: demoPass2019!
#### Female Account:
Username: demoFemale1<br>
Password: demoPass2019!

### Technical Stack:
* React
* Node.JS
* PostgreSQL
* Express
* CSS
* Jest
