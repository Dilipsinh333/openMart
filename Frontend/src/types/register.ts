export type registerRequest = {
  name: string;
  email: string;
  password: string;
  userType: "Customer" | "Seller";
};

export interface RegisterResponse {
  status: string;
  user: {
    userId: string;
    name: string;
    email: string;
    userType: string;
  };
}
