import { Box,Flex,HStack } from "@chakra-ui/react";
import axios from "axios";
import handler from "../../pages/api/products";
import { ProductInterface } from "../../store/productSlice";
import Product from "./Product";

interface PropTypes {
    products: ProductInterface[]
}

export default function LatestPicks({products}: PropTypes){
    return (
        <HStack mt="4" maxW="100vw" p="3" gap={3} overflow={"auto"}>
        {products && products.map((i, key) => (
            <Product key={key} product={i} />
        ))}
        </HStack>
    )
}
