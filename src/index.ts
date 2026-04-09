import path from 'path';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import * as db from '@/models/db-queries';
import signupRouter from './routes/signupRoute';
import loginRouter from './routes/loginRoute';
import groupsRouter from './routes/groupsRoute';
import usersRouter from './routes/usersRoute';
import homeRouter from './routes/homeRoute';

const app = express();

// set view engine
app.set('views', path.join(import.meta.dirname, 'views'));
app.set('view engine', 'ejs');

// static file path
app.use(express.static(path.join(process.cwd(), 'public')));

// parse data and set request body
app.use(express.json()); // will be remove when view are ready
app.use(express.urlencoded({ extended: true }));

// register authentication middlewares
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());

// authentication verifier
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
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
    },
  ),
);

// serialize and deserialize authenticated user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.users.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// routes
app.use('/signup', signupRouter);

app.use('/login', loginRouter);

app.use('/groups', groupsRouter);

app.use('/users', usersRouter);

app.get('/', homeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Server started at port ${PORT}`);
});
