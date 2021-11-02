/**
 * This file creates an express app object, and 
 * 
 *   - adds the proper middlewares to it
 *   - adds the user defined endpoints 
 *   - exports the app object
 *
 * (almost all this code is auto generated)
 */

import createError from 'http-errors';
import express from 'express';
import path from 'path';
const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));
import cookieParser from 'cookie-parser';
import logger from 'morgan';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));

// routes 
import home from './routes/home.js'
import signin from './routes/signin.js'
import signout from './routes/signout.js'

app.use(home);
app.use(signin);
app.use(signout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
