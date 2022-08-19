import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Text,
  Heading,
  VStack,
  Divider,
  Link,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useState } from "react";
import Login from "../components/Auth/Login";
import Signin from "../components/Auth/Signin";
import Head from "next/head";

const Signup = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>
      <Flex w="full">
        <Center
          alignItems={"center"}
          textAlign="left"
          flexDir="column"
          minH="100vh"
          flex="1"
        >
          {isLogin ? <Login /> : <Signin />}

          <Box w="90%">
            <Flex as={Link}
            href="/api/auth/google"
              mt="4"
              w={["100%", "70%"]}
              border={"1px"}
              borderColor="blackAlpha.200"
              _active={{ bg: "blackAlpha.50" }}
              cursor="pointer"
              bg="white"
              shadow="md"
              p="3"
              rounded="lg"
              justify="center"
              alignItems={"center"}
            >
              <Image
                alt=""
                height="30"
                width={"30"}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
              ></Image>
              <Text ml="3">Google</Text>
            </Flex>

            <Flex as={Link}
            href="/api/auth/discord"

              mt="4"
              w={["100%", "70%"]}
              border={"1px"}
              borderColor="blackAlpha.200"
              _active={{ bg: "blackAlpha.50" }}
              cursor="pointer"
              bg="white"
              shadow="md"
              p="3"
              rounded="lg"
              justify="center"
              alignItems={"center"}
            >
              <Image
                alt=""
                height="30"
                width={"50"}
                src="https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png"
              ></Image>
              <Text ml="1">Discord</Text>
            </Flex>

            {isLogin ? (
              <Text mt="4">
                Don&apos;t have an account?{" "}
                <Link color="blue.500" onClick={() => setIsLogin(false)}>
                  Signup
                </Link>
              </Text>
            ) : (
              <Text mt="4">
                Have an account already?{" "}
                <Link color="blue.500" onClick={() => setIsLogin(true)}>
                  Login
                </Link>{" "}
              </Text>
            )}
          </Box>
        </Center>
        <Center
          display={["none", "flex"]}
          alignItems={"center"}
          minH="100vh"
          backgroundRepeat={"no-repeat"}
          backgroundSize="110vh 100vw"
          backgroundPosition={"right"}
          backgroundImage={
            "https://images.unsplash.com/photo-1581683705068-ca8f49fc7f45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHNob3B8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60"
          }
          flex="1"
        >
          <Text className="logo-font" fontSize="6xl" color="white">
            La Tienda
          </Text>
        </Center>
      </Flex>
    </>
  );
};

export function getServerSideProps({ req, res }: any) {
  const token = getCookie("token", { req, res });
  if (token) return { redirect: { destination: "/" } };
  return {
    props: {},
  };
}

export default Signup;
