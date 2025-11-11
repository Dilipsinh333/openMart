import axios from "axios";
import {
  registerError,
  registerSuccess,
  startRegister,
} from "../features/register/registerSlice";
import { endpoints } from "./endPoints";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: string; // 👈 Added
};

const register = (payload: RegisterPayload) => async (dispatch: any) => {
  dispatch(startRegister());

  try {
    // const response = await axios.post(
    //   import.meta.env.VITE_BASE_URL + endpoints.register,
    //   {
    //     name: payload.name,
    //     username: payload.email,
    //     password: payload.password,
    //     role: payload.role, // 👈 include role in actual request
    //   }
    // );

    const response = {
      data: payload, // 👈 mocked response still includes role
    };

    dispatch(registerSuccess(response.data));
  } catch (error: any) {
    const message = error.response?.data?.error || "Something went wrong";
    dispatch(registerError({ error, message }));
  }
};

export default register;
