import passport from "passport";
import { Strategy } from "passport-google-oauth2";
import jwt from "jsonwebtoken";
import {PrismaClient} from '@prisma/client'
import { addHours } from "..";

const db = new PrismaClient()

passport.use(
    "google",
    // @ts-ignore
    new Strategy(
      {
        clientID: process.env.googleId,
        clientSecret: process.env.googleSecret,
        callbackURL: "http://localhost:3000/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (_: any, __: any, profile: any, done: any) => {
        try {
          const { id } = profile;
          const { email, name, picture } = profile._json;
          let user = await db.user.findFirst({ 
            where: {
                OR: [
                    {googleId: id},
                    {email}
                ]
            }
           });
          if (!user) {
            // add new user
            let newUser = await db.user.create({
                data: {
                    googleId: id,
                    email,
                    name,
                    // @ts-ignore
                    profilePicture: picture
                  
                  }
            })
            const token = jwt.sign(
              {
                id: newUser.id,
                email,
                name: newUser.name,
                profilePicture: picture
              },
              `${process.env.JWT_SECRET}`,
              {expiresIn: "1d"}
            );
            done(null, newUser, { message: "Auth Successful", token });
          } else {
            
            const token = jwt.sign(
              {
                id: user.id,
                email: user.email,
                name: user.name,
                profilePicture: picture
              },
              `${process.env.JWT_SECRET}`,
              {expiresIn: "1d"}
            );
            done(null, user, { message: "Auth Successful", token });
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  export default async function handler(req: any, res: any, next: any) {
    try {
      passport.authenticate("google", {
        session: false,
      })(req, res, next);
    } catch (err: any) {
      console.log(err.message);
      res.status(400).redirect("/");
    }
  }