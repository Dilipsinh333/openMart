import {
  FETCH_ORDER_ERROR,
  FETCH_ORDERS,
  START_ORDER_FETCHING,
} from "@/features/ordersSlice";

export type OrderItem = {
  id: string;
  date: string;
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
  items: string[];
};

const dummyOrders: OrderItem[] = [
  {
    id: "ORD12345",
    date: "2025-06-18",
    total: 1898,
    status: "Delivered",
    items: ["Tricycle - Red", "Helmet - Small"],
  },
  {
    id: "ORD12346",
    date: "2025-06-20",
    total: 799,
    status: "Shipped",
    items: ["Kids Backpack"],
  },
];

const fetchOrders = () => async (dispatch: any) => {
  dispatch(START_ORDER_FETCHING());
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

    dispatch(FETCH_ORDERS(dummyOrders));
  } catch (error) {
    console.log(error);
    const message = error;
    dispatch(FETCH_ORDER_ERROR({ error, message }));
  }
};

export default fetchOrders;
