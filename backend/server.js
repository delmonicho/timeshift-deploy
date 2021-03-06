const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const history = require('connect-history-api-fallback');
// //add for user auth
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
// create express app
const app = express();
//enable cors
app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// // use JWT auth to secure the api
app.use(jwt());

// api routes
const posts = require('./app/routes/entry.routes');
app.use('/routes/entry.routes', posts);
app.use('/users', require('./app/controllers/user.controller'));

app.use(errorHandler);

// Handle production
if(process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));
  //enable connect history-fallback-api
  app.use(history());
  //2nd call to handle redirected requests
  app.use(express.static(__dirname + '/public/'));
  // Handle SPA == BAD
  //app.get(/.*/, (req,res) => res.sendFile(__dirname + '/public/index.html'));

}
// define a simple route
app.get('/', (req, res) => {
      res.json({"message": "Welcome to TimeShift application. Write to-do list. Let TimeShift organize and keep track of all your tasks."});
  });

// listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`TimeShift server is listening on port ${ PORT } `);
});

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Shaka brah! Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// ........

// Require Entries routes
require('./app/routes/entry.routes.js')(app);
// ........
