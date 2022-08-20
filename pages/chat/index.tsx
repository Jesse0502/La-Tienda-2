import {
  AbsoluteCenter,
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import { getCookie, setCookie } from "cookies-next";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import Navbar from "../../components/Navbar";
import { UserInterface } from "../../store/authSlice";
import { AppState } from "../../store/store";
import jwt from "jsonwebtoken";
import { getChatUsers } from "../api/auth";
import { useRouter } from "next/router";
import { setChats } from "../../store/chatSlice";

const Chat = (props: any) => {
  // @ts-ignore
  let user: UserInterface = useSelector((app: AppState) => app.auth.user);
  const dispatch = useDispatch();
  const socket = useSelector((app: AppState) => app.chat.websocket);

  useEffect(() => {
    const run = async () => {
      if (user?.id) {
        await socket.emit("join", { id: user?.id });
      }
    };
    dispatch(setChats(props.users));
    run();
  }, []);

  const router = useRouter();
  function handleChatWith(id: string) {
    router.push(`/chat/${id}`);
  }

  return (
    <>
      <Navbar user={user} />
      <Text mx="5" fontSize={"xx-large"} fontWeight="bold" py="4">
        Chat
      </Text>
      {props.users.map((chatter: any) => (
        <Flex
          p="4"
          _hover={{ backgroundColor: "blackAlpha.200", cursor: "pointer" }}
          mx="5"
          alignItems={"center"}
          onClick={() => handleChatWith(chatter.id)}
          key={chatter.id}
        >
          <Avatar src={chatter.profilePicture} name={chatter.name} size="sm" />
          <Text fontSize={"large"} ml="3">
            {chatter.name}
          </Text>
        </Flex>
      ))}
    </>
  );
};

export async function getServerSideProps({ req, res }: any) {
  const token: any = getCookie("token", { req, res });
  if (!token) return { redirect: { destination: "/signup" } };
  const user: UserInterface = jwt.decode(token) as UserInterface;
  const users = await getChatUsers(user);
  if (!user) {
    setCookie("token", null, { req, res });
    return { redirect: { destination: "/signup" } };
  }
  return {
    props: {
      user,
      users,
    },
  };
}

export default Chat;
