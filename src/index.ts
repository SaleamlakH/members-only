import path from 'path';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import * as db from '@/models/db-queries';

const app = express();

// set view engine
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

// parse data and set request body
app.use(express.urlencoded({ extended: true }));

// register authentication middlewares
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());

// authentication verifier
passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await db.users.getUserByEmail(email);

      // check if user exists
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      // compare password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Server started at port ${PORT}`);
});
