// ======================================
// <<<<<<<<<DEPENDENCIES>>>>>>>>>>>>>>>>>
// ======================================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();


// ======================================
// <<<<<<<<<LOCAL OR ENV INFO>>>>>>>>>>>>>>
// ======================================
const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pokemon';

// ======================================
// <<<<<<<<<DEPENDENCIES >>>>>>>>>>>>>>>>>
// ======================================
app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));


// ======================================
// <<<<<<<<<<ALL ROUTES >>>>>>>>>>>>>>>>>
// ======================================




const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

const usersController = require('./controllers/users.js');
app.use('/users', usersController);

const collectionsController = require('./controllers/collections.js');
app.use('/collections', collectionsController);

app.get('/checkLogIn', (req,res) => {
      res.json(req.session);
});
// ======================================
// <<<<<<<<<LISTENING >>>>>>>>>>>>>>>>>
// ======================================
app.listen(PORT, () => {
  console.log('listening...');
})

mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
mongoose.connection.once('open', () => {
  console.log('connected to mongoose');
})
