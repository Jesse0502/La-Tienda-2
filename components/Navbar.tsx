import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserInterface } from "../store/authSlice";
import { AppState } from "../store/store";
import { useSelector } from "react-redux";

interface PropTypes {
  user: UserInterface | null;
}

const Navbar = ({ user }: PropTypes) => {
  const cart = useSelector((state: AppState) => state.products.cart);
  const notification = useMemo(() => {
    let notis: number = 0;
    cart.forEach((item) => {
      if (item) {
        notis += item.qty;
      }
    });
    return notis;
  }, [cart]);
  const router = useRouter();
  const [shadow, setShadow] = useState("sm");
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onscroll = () => {
        if (window.pageYOffset === 0) setShadow("sm");
        else shadow === "sm" && setShadow("md");
      };
    }
  });

  const handleSignOut = () => {
    document.cookie = "token=null";
    window.location.href = "/";
  };

  return (
    <>
      <Head>
        <title>La Tienda</title>
      </Head>
      <Box zIndex={99999} w="max" h={16}>
        <HStack
          shadow={shadow}
          bg="white"
          pos="fixed"
          alignItems={"center"}
          px="5"
          w="full"
          h="16"
          justify={"space-between"}
        >
          <HStack alignItems={"center"} gap="4">
            <Text className="logo-font" fontSize="2xl">
              La Tienda
            </Text>
            {[
              { name: "Home", path: "/" },
              { name: "Chat", path: "/chat" },
            ].map((item, key) => (
              <Text
                onClick={() => {
                  router.push(item.path);
                }}
                px="3"
                py="2"
                cursor={"pointer"}
                _hover={{
                  bg: "gray.100",
                }}
                rounded="lg"
                key={key}
              >
                {item.name}
              </Text>
            ))}
          </HStack>
          <HStack gap="5">
            <Box
              pos="relative"
              onClick={() => router.push("/cart")}
              cursor="pointer"
            >
              {notification !== 0 && (
                <Box
                  pos="absolute"
                  top="-3"
                  right="-2"
                  bg="red"
                  h="5"
                  w="5"
                  textAlign={"center"}
                  color="white"
                  rounded="full"
                  fontSize={"xs"}
                >
                  {notification}
                </Box>
              )}
              <Icon
                icon="mdi:cart-outline"
                style={{ fontSize: "25px", color: "gray" }}
              />
            </Box>
            <Menu>
              <MenuButton>
                <Avatar
                  h="10"
                  w="10"
                  name={user?.name}
                  src={user?.profilePicture}
                  objectFit={"cover"}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </Box>
    </>
  );
};

export function getStaticProps({ req, res }: any) {}

export default Navbar;
