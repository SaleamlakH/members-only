import path from 'path';
import express from 'express';
import session from 'express-session';
import passport from 'passport';

const app = express();

// set view engine
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

// parse data and set request body
app.use(express.urlencoded({ extended: true }));

// register authentication middlewares
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Server started at port ${PORT}`);
});
