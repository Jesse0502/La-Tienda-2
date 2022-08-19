import { Button, Flex, Heading, Input, InputGroup, InputRightAddon, position, Text, useToast } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import {useState} from 'react'
import { useDispatch } from "react-redux";
import { handleLogin } from "../../store/authSlice";
const Login = () => {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const dispatch = useDispatch()
  const submit = async () => {
    if(!email || !password) return toast({
      description: "Either the email or password is empty",
      title: "Invalid Input",
      position: "bottom-left",
      status: "error"
    }) 
    setLoading(true)
    const res = await dispatch(handleLogin({email, password}))
    setLoading(false)
    if(res.payload?.status){
      toast({ 
        description: "You have signed up successfully",
        title: "Signup Successful",
        position: "bottom-left",
        variant: "solid",
        status: "success"
      })
      router.push("/");
      return
    }
    if(res.payload?.response?.status) toast({
      description: res.payload?.response?.data?.error,
      title: "Signup Failed",
      position: "bottom-left",
      variant: "solid",
      status: "error"
    })
  }
  return (
    <>
      <Flex
        flexDir="column"
        text-align="left"
        w="90%"
      >
        <Heading>Welcome back</Heading>
        <Text mb="3" fontWeight={"hairline"}>
          Welcome back please enter your details
        </Text>
        <Text mt="3" fontWeight={"semibold"}>
          Email
        </Text>
        <Input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter your email" mb="3" mt="1" w={["100%", "70%"]} type="text" />
        <Text fontWeight={"semibold"}>Password</Text>
        <InputGroup mb="3" mt="1" w={["100%", "70%"]}>
        <Input placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} value={password} type={show ? "text" : "password"} />
        <InputRightAddon onClick={() => setShow(() => !show)}>
            {!show ? (<Icon icon="akar-icons:eye-closed" style={{ fontSize: "20px"}}/>) : (<Icon icon="akar-icons:eye" style={{ fontSize: "20px"}} />)}
        </InputRightAddon>
        </InputGroup>
        <Button
          mt="2"
          onClick={submit}
          _active={{}}
          _hover={{}}
          w={["100%", "70%"]}
          bg="black"
          isLoading={loading}
          h="12"
          color="white"
        >
          Login
        </Button>
      </Flex>
    </>
  );
};

export default Login;
