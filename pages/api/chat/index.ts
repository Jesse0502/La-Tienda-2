import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface ReqBody {
  msg: string;
  time: Date;
  senderId: string;
  slug: string;
  recieverId: string;
}

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const data = { ...req.body } as ReqBody;
    await db.chat.create({
      data,
    });
    res.status(200).send("Added Chat");
  }
}
