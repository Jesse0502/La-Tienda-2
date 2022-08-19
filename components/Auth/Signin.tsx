import {
  Button,
  Flex,
  Heading,
  Input,
  InputAddon,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleSignup } from "../../store/authSlice";
const Signin = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const router = useRouter();
  const submit = async () => {
    if (!email) return toast({
        description: "Please enter your email address.",
        title: "Email is required",
        position: "bottom-left",
        variant: "solid",
        status: "error"
        
      });

      if (!password) return toast({
        title: "Password is required!",
        position: "bottom-left",
        variant: "solid",
        status: "error",
        description: "Please enter your password"

      });
    setLoading(true)
    const res = await dispatch(handleSignup({ email, password, name }));
    setLoading(false)
    if(res.payload?.status){
      toast({
        description: "You have signed up successfully",
        title: "Signup Successful",
        position: "bottom-left",
        variant: "solid",
        status: "success"
      })
      router.push("/")
      return
    }
    if(res.payload.response?.status) toast({
      description: res.payload?.response?.data?.error,
      title: "Signup Failed",
      position: "bottom-left",
      variant: "solid",
      status: "error"
    })
  };
  return (
    <>
      <Flex flexDir="column" text-align="left" w="90%">
        <Heading>Welcome</Heading>
        <Text mb="3" fontWeight={"hairline"}>
          Welcome please enter your details
        </Text>

        <Text mt="3" fontWeight={"semibold"}>
          Name
        </Text>
        <Input
          placeholder="Enter your email"
          value={name}
          onChange={(e) => setName(e.target.value)}
          mt="1"
          mb="3"
          w={["100%", "70%"]}
          type="text"
        />

        <Text fontWeight={"semibold"}>
          Email
        </Text>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mt="1"
          mb="3"
          w={["100%", "70%"]}
          type="text"
        />


        <Text fontWeight={"semibold"}>Password</Text>
        <InputGroup mb="3" mt="1" w={["100%", "70%"]}>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            type={show ? "text" : "password"}
          />
          <InputRightAddon onClick={() => setShow(() => !show)}>
            {!show ? (
              <Icon icon="akar-icons:eye-closed" style={{ fontSize: "20px" }} />
            ) : (
              <Icon icon="akar-icons:eye" style={{ fontSize: "20px" }} />
            )}
          </InputRightAddon>
        </InputGroup>

        <Button
          mt="2"
          _active={{}}
          _hover={{}}
          w={["100%", "70%"]}
          h="12"
          isLoading={loading}
          bg="black"
          onClick={submit}
          color="white"
        >
          Signup
        </Button>
      </Flex>
    </>
  );
};

export default Signin;
