const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const videosInListRouter = require('./routes/videos-in-list');
const newVideoRouter = require('./routes/new-video');
const listsRouter = require('./routes/lists');
const { authMiddlewear } = require('./auth');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self'"],
        'script-src-elem': ["'self'", 'kit.fontawesome.com', 'www.youtube.com', 'apis.google.com'],
        'img-src': ["'self'", 'https://*.ytimg.com'],
        'frame-src': ["'self'", 'www.youtube-nocookie.com', 'strong-park-451920-r0.firebaseapp.com'],
        'connect-src': ["'self'", 'ka-f.fontawesome.com', 'identitytoolkit.googleapis.com', 'securetoken.googleapis.com'],
      },
    },
  })
);
app.use(cors());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/lists', authMiddlewear, listsRouter);
app.use('/videos-in-list', authMiddlewear, videosInListRouter);
app.use('/new-video', authMiddlewear, newVideoRouter);
app.use('*', (_, res) => res.sendFile(`${__dirname}/dummy/index.html`));

app.use(function (err, req, res, next) {
  if (err.code && err.code === 'ECONNREFUSED') {
    err.message = 'Failure connecting to database';
    err.httpStatusCode = 500;
  } else if (err.code && err.code === 'ER_DUP_ENTRY') {
    err.message = 'Video already exists in list';
    err.httpStatusCode = 418;
  } else {
    err.httpStatusCode = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.httpStatusCode).send({ message: err.message });
  console.log('🤬: \n ', err.httpStatusCode, err.message, ' \n ', err);
});

module.exports = app;
