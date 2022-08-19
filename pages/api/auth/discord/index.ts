import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import connect from "../../../../lib/database";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient()
passport.use(
  "discord",
  new DiscordStrategy(
    {
        // @ts-ignore
        clientID: process.env.discordId,
        // @ts-ignore
      clientSecret: process.env.discordSecret,
      callbackURL: "http://localhost:3000/api/auth/discord/callback",
      scope: ["identify", "email"],
    },
    async (_:any, __: any, profile: any, done: any) => {
      try {
        const { id, email, username } = profile;
        let user = await db.user.findFirst({ 
            where: {
                OR: [
                    {discordId: id},
                    {email}
                ]
            }
        });
        if (!user) {
          // add new user
          const newUser = await db.user.create({
            data: {
                discordId: id,
                email,
                name: username,
            }
          });
          const token = jwt.sign(
            {
              id: newUser.id,
              email,
              name: newUser.name,
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
              // @ts-ignore
              profilePicture: user?.profilePicture ?? ""
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
    passport.authenticate("discord", {
      session: false,
    })(req, res, next);
  } catch (err: any) {
    console.log(err.message);
    res.status(400).redirect("/");
  }
}