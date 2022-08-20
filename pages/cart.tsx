import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { UserInterface } from "../store/authSlice";
import { AppState } from "../store/store";
import jwt from "jsonwebtoken";
import {
  CartInterface,
  changeItemQty,
  deleteItem,
  setCart,
} from "../store/productSlice";
import { getCartItems } from "./api/cart";
import { useEffect } from "react";
interface PropTypes {
  user: UserInterface;
  cartItems: CartInterface[];
}

export default function Cart({ user, cartItems }: PropTypes) {
  const dispatch = useDispatch();
  let { cart, totalPrice } = useSelector((state: AppState) => state.products);
  useEffect(() => {
    if (!cart.length) {
      cart = cartItems;
    }
  }, []);
  const handleCheckout = () => {
    const data: any = [];
    cart.forEach((item) => {
      data.push({ price: item.price, quantity: item.qty });
    });

    const form = document.createElement("form") as any;
    document.body.appendChild(form);
    form.style.display = "none";
    form.method = "POST";
    form.action = "/api/checkout";
    const input = document.createElement("input");
    input.name = "data";
    input.defaultValue = JSON.stringify(data) as string;
    form.appendChild(input);
    form.submit();
  };

  function changeQty(item: CartInterface, qty: number) {
    dispatch(changeItemQty({ product: item, qty }));
  }

  function remove(item: CartInterface) {
    dispatch(deleteItem({ product: item }));
  }
  return (
    <>
      <Navbar user={user} />
      <Box p="5">
        <Text fontSize="4xl">Your Cart</Text>
        <Flex flexDir="column" mt="10">
          <Flex borderBottom="1px" py="3" w="full" borderColor="black">
            <Text fontWeight="bold" flex="1" textAlign="center">
              S.no
            </Text>
            <Text fontWeight="bold" flex="3" textAlign="center">
              Product
            </Text>
            <Text fontWeight="bold" flex="1">
              Qty
            </Text>
            <Text fontWeight="bold" flex="1" textAlign="center">
              Price
            </Text>
            <Text fontWeight="bold" flex="1" textAlign="center"></Text>
          </Flex>
          {cart &&
            cart.map((item: CartInterface, key: number) => (
              <Flex
                key={key}
                borderBottom="1px"
                py="5"
                alignItems="center"
                w="full"
                borderColor="black"
              >
                <Text flex="1" textAlign="center">
                  {key + 1}
                </Text>
                <Text
                  as={Flex}
                  alignItems="center"
                  justify="center"
                  flex="3"
                  textAlign="center"
                >
                  <Image alt="" src={item?.image} h="10" w="10" mr="3" />
                  {item?.name}
                </Text>
                <Flex flex="1">
                  <NumberInput
                    defaultValue={item?.qty}
                    min={1}
                    size="sm"
                    w={"20"}
                    onBlur={(e) => changeQty(item, +e.target.value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Flex>
                <Text flex="1" textAlign="center">
                  ${item?.cost}
                </Text>
                <Button
                  flex="1"
                  w="min"
                  variant={"link"}
                  colorScheme="red"
                  onClick={() => remove(item)}
                  textAlign="center"
                >
                  Delete
                </Button>
              </Flex>
            ))}
          {/* Checkout Button */}
          {totalPrice && (
            <Flex
              justify="end"
              mr="5"
              w="full"
              py="5"
              textAlign="center"
              borderColor="black"
            >
              <Button
                mr={["0", "8"]}
                colorScheme={"green"}
                onClick={handleCheckout}
              >
                Checkout ${totalPrice.toFixed(2)}
              </Button>
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  );
}

export async function getServerSideProps({ req, res }: any) {
  const token: any = getCookie("token", { req, res });
  if (!token) return { redirect: { destination: "/signup" } };
  const user = jwt.decode(token) as UserInterface;
  const cartItems = await getCartItems(user.id);
  return {
    props: {
      user,
      cartItems,
    },
  };
}
