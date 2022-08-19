import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Highlight,
  Code,
  Input,
  FormControl,
} from "@chakra-ui/react";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch } from "react-redux";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

import { addToCart, ProductInterface } from "../../store/productSlice";

interface PropTypes {
  product: ProductInterface;
}

export default function Product({ product }: PropTypes) {
  const dispatch = useDispatch();
  const AddToCart = () => {
    dispatch(addToCart({ product }));
  };

  const buyProduct = () => {
    const data: any = [{ price: product.default_price, quantity: 1 }];

    const form = document.createElement("form") as any;
    document.body.appendChild(form);
    form.style.display = "none";
    form.method = "POST";
    form.action = "/api/checkout/1";
    const input = document.createElement("input");
    input.name = "data";
    input.defaultValue = JSON.stringify(data) as string;
    form.appendChild(input);
    form.submit();
  };
  return (
    <Flex
      overflow="clip"
      flexDir="column"
      justify="end"
      rounded="lg"
      bg="white"
      shadow="md"
      w="80"
      h="450px"
    >
      <Image
        alt=""
        h="52"
        w="full"
        src={product.images[0]}
        objectFit={"cover"}
      />
      <Text px="5" pt="3" fontWeight="bold" fontSize={"4xl"}>
        {product.name}
      </Text>
      <Text px="5" pb="3" fontWeight="bold" fontSize={"xl"}>
        ${product.cost}
      </Text>
      <Text px="5" pb="5" fontSize="sm">
        Use code <Code> COUPON25 </Code> to get 25% OFF
      </Text>
      <Flex alignItems={"center"} px="5" pb="7">
        <Button onClick={buyProduct} colorScheme="green" flex="1">
          Buy Now
        </Button>
        <Button
          colorScheme="linkedin"
          ml="1"
          flex="1"
          variant="outline"
          onClick={AddToCart}
        >
          Add to cart
        </Button>
      </Flex>
    </Flex>
  );
}
