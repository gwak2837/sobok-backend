import { Express } from 'express-serve-static-core'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import querystring from 'querystring'
import { poolQuery } from '../database/postgres'
import { importSQL } from '../utils/commons'
import { generateJWT } from '../utils/jwt'

const registerOrLogin = importSQL(__dirname, 'sql/socialLogin.sql')

export function setPassportStrategies(app: Express) {
  app.use(passport.initialize())

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        if (profile.emails && (profile.emails[0] as any).verified) {
          const { rows } = await poolQuery(await registerOrLogin, [
            profile.emails[0].value,
            profile.displayName,
            null,
            null,
            null,
            profile.photos?.map((photo) => photo.value),
            null,
            null,
            profile.emails[0].value,
            null,
            null,
          ])

          done(null, { id: rows[0].user_id })
        } else {
          // email not verified or no email

          done(null)
        }
      }
    )
  )

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID ?? '',
        clientSecret: process.env.FACEBOOK_APP_SECRET ?? '',
        callbackURL: `${process.env.BACKEND_URL}/auth/facebook/callback`,
      },
      (accessToken, refreshToken, profile, cb) => {
        console.log(profile)
      }
    )
  )

  passport.serializeUser((user, done) => {
    console.log('user', user)
    done(null, user)
  })

  passport.deserializeUser((obj, done) => {
    console.log('obj', obj)
    done(null, obj as any)
  })

  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
  )

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/aa',
    }),
    async (req, res) => {
      if (req.user) {
        const query = querystring.stringify({
          token: await generateJWT({ userId: (req.user as any).id, lastLoginDate: new Date() }),
        })
        res.redirect(`${process.env.FRONTEND_URL}/auth?${query}`)
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/signin`)
      }
    }
  )

  app.get('/auth/facebook', passport.authenticate('facebook'))

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
      console.log(req.user)
      // Successful authentication, redirect home.
      res.redirect('/')
    }
  )
}
