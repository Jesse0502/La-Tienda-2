import { UserInterface } from "./../../../store/authSlice";
import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";
import { CartInterface } from "../../../store/productSlice";
import jwt from "jsonwebtoken";

const updateDb = (items: CartInterface[], user: UserInterface) => {
  try {
    items.forEach(async (item: CartInterface) => {
      const findItem = await db.cart.findFirst({
        where: {
          id: item.id,
        },
      });

      if (findItem) {
        await db.cart.updateMany({
          where: {
            id: item.id,
            buyerId: user.id,
          },
          data: {
            ...item,
          },
        });
      } else {
        await db.cart.create({
          data: {
            ...item,
            // @ts-ignore
            buyerId: user.id,
          },
        });
      }
    });
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const deleteItemFromCart = async (id: string, buyerId: string) => {
  try {
    await db.cart.deleteMany({
      where: {
        // @ts-ignore
        buyerId,
        id,
      },
    });
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const getCartItems = async (buyerId: string) => {
  try {
    const cart = await db.cart.findMany({
      where: {
        // @ts-ignore
        buyerId,
      },
    });
    return cart;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const db = new PrismaClient();
export default function handler(req: any, res: any) {
  let user: any = getCookie("token", { req, res });
  user = jwt.decode(user);

  if (!user) return res.status(401).json({ error: "Invalid token" });

  if (req.method === "POST") {
    try {
      const items = req.body.data;
      if (req.query.query === "update") updateDb(items, user);
      else deleteItemFromCart(req.query.id, user.id);
      res.status(200).json({ message: "Cart updated!" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === "GET") {
    return res.status(200).json(getCartItems(user.id));
  }
}
