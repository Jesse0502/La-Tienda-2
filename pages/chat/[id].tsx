import {
  AbsoluteCenter,
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { UserInterface } from "../../store/authSlice";
import { recieveMsg, sendMsg } from "../../store/chatSlice";
import { AppState } from "../../store/store";

export default function ChatWithUser() {
  const router = useRouter();
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();

  const socket: any = useSelector((app: AppState) => app.chat.websocket);
  const chatter = useSelector(
    (app: AppState) => app.chat.chats[router.query.id as string]
  );

  const user: UserInterface | null = useSelector(
    (app: AppState) => app.auth.user
  );

  const handleSendMsg = (e?: FormEvent) => {
    e?.preventDefault();
    dispatch(sendMsg({ msg, from: user?.id, to: router.query.id }));
    socket.emit("send_message", {
      id: user?.id,
      msg,
      to: router.query.id,
      time: new Date().toISOString(),
    });

    setMsg("");
  };

  useEffect(() => {
    console.log(chatter);
  }, [chatter]);

  return (
    <>
      <Navbar user={user} />
      <Flex
        mx="10"
        id="chatBar"
        flexDir={"column"}
        h="74vh"
        mt="3"
        overflow={"auto"}
      >
        {chatter?.chat?.map((chat: any, key: number) => (
          <Flex
            w="full"
            justify={chat.from !== router.query.id ? "end" : "start"}
            alignItems={"center"}
            key={key}
          >
            {chat.from !== router.query.id ? (
              <Box textAlign={"right"} mx="5" my="3">
                <Text fontSize={"larger"} fontWeight="bold">
                  You
                </Text>
                <Text>{chat.msg}</Text>
              </Box>
            ) : (
              <Box textAlign={"left"} mx="5" my="3">
                <Text fontSize={"larger"} fontWeight="bold">
                  {chatter.name}
                </Text>
                <Text>{chat.msg}</Text>
              </Box>
            )}
          </Flex>
        ))}
      </Flex>
      {/* <form onSubmit={handleSendMsg}> */}
      <Box w="full" h="full">
        <AbsoluteCenter top={"92vh"} w="90%" as={Flex}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Enter something"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <InputRightAddon
              as={Button}
              onClick={handleSendMsg}
              colorScheme={"blue"}
              bg="blue.600"
              type="submit"
              color="white"
            >
              Send
            </InputRightAddon>
          </InputGroup>
        </AbsoluteCenter>
      </Box>
      {/* </form> */}
    </>
  );
}
