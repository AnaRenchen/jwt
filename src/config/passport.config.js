import passport from "passport";
import local from "passport-local";
import passportJWT from "passport-jwt";
import { usersManagerMongo as UsersManager } from "../dao/usersmanager.js";
import { SECRET, generateHash } from "../utils.js";
import CartsManagerMongo from "../dao/cartsmanagerMongo.js";
import { validatePassword } from "../utils.js";
import github from "passport-github2";

const usersManager = new UsersManager();
const cartsMongo = new CartsManagerMongo();

const buscaToken = (req) => {
  let token = null;

  if (req.cookies["anarenchencookie"]) {
    token = req.cookies["anarenchencookie"];
  }

  return token;
};

export const initPassport = () => {
  passport.use(
    "register",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { name } = req.body;
          if (!name) {
            return done(null, false);
          }

          let exist = await usersManager.getByPopulate({ email: username });
          if (exist) {
            return done(null, false);
          }

          password = generateHash(password);

          let newCart = await cartsMongo.createCart();
          let newUser = await usersManager.create({
            name,
            email: username,
            password,
            rol: "user",
            cart: newCart._id,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          let user = await usersManager.getByPopulate({ email: username });

          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          if (!validatePassword(password, user.password)) {
            return done(null, false, { message: "Invalid password" });
          }

          delete user.password;

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "otro",
        clientSecret: "otro",
        callbackURL: "http://localhost:3000/api/sessions/callbackGithub",
      },
      async (tokenAcceso, tokenRefresh, profile, done) => {
        try {
          let email = profile._json.email;
          let name = profile._json.name;
          if (!name || !email) {
            return done(null, false);
          }

          let newCart = await cartsMongo.createCart();
          let user = await usersManager.getByPopulate({ email });
          if (!user) {
            user = await usersManager.create({
              name,
              email,
              profile,
              cart: newCart._id,
            });
            await usersManager.getByPopulate({ email });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new passportJWT.Strategy(
      {
        secretOrKey: SECRET,
        jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([buscaToken]),
      },
      async (contenidoToken, done) => {
        try {
          return done(null, contenidoToken);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
