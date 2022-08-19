import { PrismaClient } from "@prisma/client";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const db = new PrismaClient();
export default async function handler(req: any, res: any) {
  const { user } = req.query;
  await db.cart.deleteMany({
    where: {
      buyerId: user,
    },
  });
  res.redirect(303, "/?payment=true");
}
