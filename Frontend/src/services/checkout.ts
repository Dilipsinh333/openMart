import {
  CHECKOUT_ERROR,
  CHECKOUT_SUCCESS,
  START_CHECKOUT,
} from "@/features/checkoutSlice";

export type checkoutData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: string;
  paymentMethod: "CashOnDelivery" | "Card";
};
const checkout = (payload: checkoutData) => async (dispatch: any) => {
  dispatch(START_CHECKOUT());
  try {
    console.log(payload);
    dispatch(CHECKOUT_SUCCESS(payload));
  } catch (error) {
    console.log(error);
    dispatch(CHECKOUT_ERROR({ error, message: "Order not placed" }));
  }
};

export default checkout;
