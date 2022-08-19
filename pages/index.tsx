import type { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Heading, Text, useToast } from "@chakra-ui/react";
import { AppState } from "../store/store";
import Navbar from "../components/Navbar";
import { getCookie, setCookie } from "cookies-next";
import LatestPicks from "../components/Home/LatestPicks";
import { setUser, UserInterface } from "../store/authSlice";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { useEffect } from "react";
import axios from "axios";
import { getAllProducts } from "./api/products";
import { setCart } from "../store/productSlice";
import { getCartItems } from "./api/cart";

const Home = ({ user, products, cartItems }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    dispatch(setCart(cartItems));
    dispatch(setUser(user));
    if (router.query?.a === "auth_pass") {
      toast({
        description: "You are now logged in!",
        title: "Login Successful!",
        position: "bottom-right",
        status: "success",
      });
    }

    if (router.query?.payment === "true") {
      toast({
        description: "Your payment was successful!",
        title: "Payment Successful!",
        position: "bottom-right",
        status: "success",
      });
    } else if (router.query?.payment === "false") {
      toast({
        description: "Your payment was not successful!",
        title: "Payment not successful!",
        position: "bottom-right",
        status: "error",
      });
    }
  }, []);

  return (
    <>
      <Navbar user={user} />

      <Box p="4">
        <Box px="2">
          <Heading>Hi, {user?.name}</Heading>
          <Text mt="1" fontSize={"lg"}>
            Here are the latest picks...
          </Text>
        </Box>
        <LatestPicks products={products} />
      </Box>
    </>
  );
};

export async function getServerSideProps({ req, res }: any) {
  const token: any = getCookie("token", { req, res });
  if (!token) return { redirect: { destination: "/signup" } };
  const products = await getAllProducts();
  const user: UserInterface = jwt.decode(token) as UserInterface;
  if (!user) {
    setCookie("token", null, { req, res });
    return { redirect: { destination: "/signup" } };
  }
  const cart = await getCartItems(user.id);
  return {
    props: {
      user,
      products,
      cartItems: cart,
    },
  };
}

export default Home;
