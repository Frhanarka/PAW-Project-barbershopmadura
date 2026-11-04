const path = require('path');
const express = require('express');
const config = require('./config');
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const routes = require('./routes');
const format = require('./utils/format');

const app = express();

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Fungsi format tersedia di semua view
app.locals.fmt = format;
app.locals.namaToko = config.namaToko;

// Middleware
app.use(logger);
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', routes);
app.use(notFound);

app.listen(config.port, () => {
  console.log(`${config.namaToko} berjalan di http://localhost:${config.port}`);
});

module.exports = app;
