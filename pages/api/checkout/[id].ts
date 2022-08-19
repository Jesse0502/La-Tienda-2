const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import jwt from "jsonwebtoken";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const user: any = jwt.decode(req.cookies.token);
      const session = await stripe.checkout.sessions.create({
        line_items: JSON.parse(req.body.data),
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${req.headers.origin}?payment=true`,
        cancel_url: `${req.headers.origin}?payment=false`,
        billing_address_collection: "auto",
        allow_promotion_codes: true,
      });
      res.redirect(303, session.url);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
