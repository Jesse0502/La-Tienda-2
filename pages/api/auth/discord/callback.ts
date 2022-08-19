import passport from "passport";
import { setCookie } from "cookies-next";
import { addHours } from "..";

export default async function handler(req: any, res: any, next: any) {
  try {
    passport.authenticate("discord", (err, user, info) => {
      if (err || !user)
        return res.redirect("http://localhost:3000/signup?a=auth_fail");

      setCookie("token", info.token, {
        req,
        res,
        expires: addHours(24),
      });
      res.redirect("http://localhost:3000?a=auth_pass");
    })(req, res, next);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).redirect("http://localhost:3000/signup?a=auth_fail");
  }
}
