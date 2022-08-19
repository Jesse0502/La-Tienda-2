import { UserInterface } from "./../../../store/authSlice";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { setCookie } from "cookies-next";
var bcrypt = require("bcryptjs");
const db = new PrismaClient();

export function addHours(numOfHours: number, date = new Date()) {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

  return date;
}

export async function getChatUsers(user: UserInterface) {
  let users = await db.user.findMany({
    where: {
      id: {
        not: user.id,
      },
    },
    select: {
      id: true,
      name: true,
      profilePicture: true,
    },
  });
  return users;
}

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      await db.user.deleteMany();

      const { name, email, password } = req.body.data;
      if (!name) return res.status(400).json({ error: "Missing Field 'Name'" });
      if (!email || !password)
        return res.status(400).json({ error: "Missing email or password" });

      let user = await db.user.findFirst({
        where: {
          email,
        },
      });
      if (user)
        return res
          .status(403)
          .json({ error: "User with this email already exist!" });

      let hashedPassword = await bcrypt.hash(password, 8);
      // bcrypt.compare(password, hashedPassword, function(err: any, res: any) {
      //     console.log(res)
      // });

      user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign(
        { email: email, id: user.id, name: user.name },
        `${process.env.JWT_SECRET}`,
        { expiresIn: "1d" }
      );
      setCookie("token", token, { req, res, expires: addHours(24) });
      res.status(200).json({ token });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(401).send({ error: "Method Not Allowed" });
  }
}
