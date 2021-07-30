require('dotenv').config();
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const session = require('express-session');
const compression = require('compression');

const sessionStore = session.Store;
const sequelizeStoreCreater = require('connect-session-sequelize');
const SequelizeStore = sequelizeStoreCreater(sessionStore);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(compression({ filter: shouldCompress }))

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

const mySession = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(mySession));

const handleBars = exphbs.create({ helpers });

app.engine('handlebars', handleBars.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/flatpickr', express.static(path.join(__dirname, '/node_modules/flatpickr/dist/')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening', PORT));
});