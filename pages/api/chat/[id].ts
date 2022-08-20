import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";

const db = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    let user: any = getCookie("token", { req, res });
    user = jwt.decode(user);
    const chatHistory = await db.chat.findMany({
      where: {
        OR: [
          { slug: `${user.id}-${req.query.id}` },
          { slug: `${req.query.id}-${user.id}` },
        ],
      },
    });
    res.status(200).json({ data: chatHistory });
  }
}
