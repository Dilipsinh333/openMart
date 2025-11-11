import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import registerReducer from "../features/register/registerSlice";
import productReducer from "../features/productSlice";
import cartReducer from "../features/cartSlice";
import sellItemsReducer from "../features/sellItemSlice";
import orderReducer from "../features/ordersSlice";
import checkoutReducer from "../features/checkoutSlice";
import offerReducer from "../features/offerSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import { baseApi } from "@/services/baseApi";

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  offer: offerReducer,
  order: orderReducer,
  product: productReducer,
  register: registerReducer,
  sellItems: sellItemsReducer,
  wishlist: wishlistReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
