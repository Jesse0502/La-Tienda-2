import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppState, wrapper } from "../store/store";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recieveMsg } from "../store/chatSlice";
import { setUser, UserInterface } from "../store/authSlice";
import jwt from "jsonwebtoken";

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useDispatch();
  const socket = useSelector((app: AppState) => app.chat.websocket);
  const user = useSelector((app: AppState) => app.auth.user);

  useEffect(() => {
    let token: any = document.cookie.split("token=")[1];
    token = jwt.decode(token) as UserInterface;
    if (token) dispatch(setUser(token));
    socket.on("receive_message", (data: any, s: any) => {
      dispatch(
        recieveMsg({
          msg: data.msg,
          from: data.from,
          to: user?.id,
          time: data.time,
        })
      );
    });
  }, []);
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

// export async function getServerSideProps({ req, res }: any) {
//   const token: any = getCookie("token", { req, res });
//   if (!token) return {  };
//   const user: UserInterface = jwt.decode(token) as UserInterface;
//   if (!user) {
//     setCookie("token", null, { req, res });
//     return { };
//   }
//   return {
//     props: {
//       user,
//     },
//   };
// }

export default wrapper.withRedux(MyApp);
