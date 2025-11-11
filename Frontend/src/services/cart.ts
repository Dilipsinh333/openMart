import {
  FETCH_CART_PRODUCT_ERROR,
  FETCH_CART_PRODUCTS,
  START_CART_PRODUCT_FETCHING,
} from "@/features/cartSlice";

// Dummy product type
export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

const dummyCartItems: CartItem[] = [
  {
    id: "1",
    title: "Tricycle - Red",
    price: 1499,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Kids Helmet",
    price: 499,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "Tricycle - Blue",
    price: 1499,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    title: "Kids Pant",
    price: 499,
    quantity: 1,
    image: "/images/helmet.jpg",
  },
];

const fetchCartProducts = () => async (dispatch: any) => {
  dispatch(START_CART_PRODUCT_FETCHING());

  try {
    // api call for fetching products
    // const response = await axios.post(
    //   process.env.REACT_APP_BASE_URL + route.getProducts,
    //   {
    //     filters: {},
    //     sort: {
    //       price: "DESC",
    //       id: "ASC",
    //     },
    //     page: 1,
    //     rowsPerPage: 3,
    //   }
    // );
    // dispatch(FETCH_PRODUCTS({ products: response.data.data }));

    dispatch(FETCH_CART_PRODUCTS(dummyCartItems));
  } catch (error) {
    console.log(error);
    const message = error;
    dispatch(FETCH_CART_PRODUCT_ERROR({ error, message }));
  }
};

export { fetchCartProducts };
