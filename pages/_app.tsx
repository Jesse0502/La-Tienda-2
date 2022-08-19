import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppState, wrapper } from "../store/store";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recieveMsg } from "../store/chatSlice";

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useDispatch();
  const socket = useSelector((app: AppState) => app.chat.websocket);
  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      dispatch(recieveMsg({ msg: data.msg, from: data.from, time: data.time }));
    });
  }, []);
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default wrapper.withRedux(MyApp);
