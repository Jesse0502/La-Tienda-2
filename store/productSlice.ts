import jwt from "jsonwebtoken";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { AppState } from "./store";
import axios from "axios";

export interface ProductInterface {
  id: string;
  description: string;
  images: string[];
  name: string;
  default_price: string;
  cost: number;
}

export interface CartInterface {
  id: string;
  name: string;
  price: string;
  qty: number;
  cost: number;
  image: string;
}

export interface ProductStateType {
  products: ProductInterface[] | [];
  cart: CartInterface[] | [];
  totalPrice: number;
}

const initialState: ProductStateType = {
  products: [],
  cart: [],
  totalPrice: 0,
};

export const getAllProducts: any = createAsyncThunk(
  "allProducts",
  async (payload) => {
    try {
      const res = await axios.get(`/api/products`);
      return res;
    } catch (err) {
      return err;
    }
  }
);

const updateCart = async (cart: CartInterface[], query: string) => {
  axios.post(
    `/api/cart?query=${query}`,
    { data: cart },
    { withCredentials: true }
  );
};

export const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
      let total = 0;
      action.payload.forEach((item: CartInterface) => {
        total += +(item.cost * item.qty).toFixed();
      });
      state.totalPrice = total;
    },
    addToCart: (state, action) => {
      const product: any = action.payload.product;
      const productExist = state.cart.findIndex(
        (item) => item.id === product.id
      );
      if (productExist === -1) {
        state.cart = [
          ...state.cart,
          {
            id: product.id,
            name: product.name,
            cost: product.cost,
            qty: 1,
            image: product.images[0],
            price: product.default_price,
          },
        ];
        state.totalPrice =
          +state.totalPrice.toFixed(2) + +product.cost.toFixed(2);
      } else {
        state.cart[productExist].qty += 1;
        state.totalPrice =
          +state.totalPrice.toFixed(2) + +product.cost.toFixed(2);
      }
      updateCart(state.cart, "update");
    },

    changeItemQty: (state, action) => {
      const product: any = action.payload.product;
      const productExist = state.cart.findIndex(
        (item) => item.id === product.id
      );
      if (productExist !== -1) {
        state.cart[productExist].qty = action.payload.qty;
        state.totalPrice =
          +state.totalPrice.toFixed(2) -
          +(product.cost * product.qty).toFixed(2);
        state.totalPrice =
          +state.totalPrice.toFixed(2) +
          +(product.cost * action.payload.qty).toFixed(2);
      }
      updateCart(current(state.cart), "update");
    },

    deleteItem: (state, action) => {
      const product: any = action.payload.product;
      const productExist = state.cart.findIndex(
        (item) => item.id === product.id
      );
      if (productExist !== -1) {
        state.totalPrice =
          +state.totalPrice.toFixed(2) -
          +(product.cost * product.qty).toFixed(2);
        state.cart = state.cart.filter((item) => item.id !== product.id);
      }
      updateCart(state.cart, `delete&id=${product.id}`);
    },
  },
});

export const { addToCart, changeItemQty, deleteItem, setCart } =
  productSlice.actions;

export default productSlice.reducer;
