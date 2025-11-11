import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePlaceOrderMutation } from "@/features/order/orderApi";
import { useGetAddressesQuery } from "@/features/address/addressApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_CART_PRODUCTS } from "@/features/cartSlice";
import type { Cart } from "@/types/cart";
import { useGetCartItemsQuery } from "@/features/cart/cartApi";
import type { RootState } from "@/store";

// ------------------ ZOD SCHEMA ------------------
const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  address: z.string().min(1, "Shipping address is required"),
  paymentMethod: z.enum(["cod", "card"]).optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ------------------ COMPONENT ------------------
const Checkout = () => {
  const navigate = useNavigate();
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();
  const dispatch = useDispatch();

  // Fetch cart items from API
  const { data: cartItemsData = [] } = useGetCartItemsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Save them to Redux store when they arrive
  useEffect(() => {
    if (cartItemsData.length) {
      dispatch(FETCH_CART_PRODUCTS(cartItemsData));
    }
  }, [cartItemsData, dispatch]);

  // Read cart items from Redux store
  const cartItems = useSelector(
    (state: RootState) => state.cart.products
  ) as Cart[];

  // Fetch addresses similar to shop component
  const {
    data: addresses = [],
    error: addressError,
    isLoading: isLoadingAddresses,
  } = useGetAddressesQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Format addresses for dropdown display
  // const formattedAddresses = useMemo(() => {
  //   return addresses.map((addr) => ({
  //     value: addr.addressId,
  //     label: `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`,
  //     fullAddress: `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.pincode}`,
  //   }));
  // }, [addresses]);

  const onSubmit = async (data: CheckoutFormData) => {
    console.log("Checkout Submitted:", data);

    let products = cartItems.map((item) => {
      return item.productId;
    });

    try {
      const formData = {
        shippingAddress: data.address,
        products: products,
        paymentStatus: data.paymentMethod === "cod" ? "pending" : "completed",
        paymentId: "payment_" + Date.now(),
      };
      const result = await placeOrder(formData).unwrap();
      console.log(result);

      toast.success("Order placed successfully!");
      reset();
      navigate("/orders"); // Navigate to orders page or success page
    } catch (error: any) {
      console.error("Order placement failed:", error);
      toast.error(
        error?.data?.message || "Failed to place order. Please try again."
      );
    }
  };

  // Error handling for addresses
  if (addressError) {
    toast.error("Failed to load addresses. Please try again.");
  }

  return (
    <div
      className={`relative max-w-2xl mx-auto p-6 ${
        isLoadingAddresses ? "overflow-hidden" : ""
      }`}
    >
      {/* Loading Overlay */}
      {isLoadingAddresses && <Loader />}

      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
               transition-colors"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
               transition-colors"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
               transition-colors"
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Address Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Address
          </label>
          {isLoadingAddresses ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
              Loading addresses...
            </div>
          ) : addresses.length > 0 ? (
            <select
              {...register("address")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                 transition-colors"
            >
              <option value="">Select a shipping address</option>
              {addresses.map((address: any) => {
                const displayText = `${address.addressLine1 || ""}, ${
                  address.city || ""
                }, ${address.state || ""} ${address.pinCode || ""}`
                  .replace(/^,\s*/, "")
                  .replace(/,\s*,/g, ",");
                return (
                  <option key={address.addressId} value={address.addressId}>
                    {displayText}
                  </option>
                );
              })}
            </select>
          ) : (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
              No addresses found. Please add an address first.
            </div>
          )}
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Method
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input type="radio" value="cod" {...register("paymentMethod")} />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" value="card" {...register("paymentMethod")} />
              <span>Credit/Debit Card</span>
            </label>
          </div>
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm mt-1">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading || addresses.length === 0}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting || isLoading ? "Processing..." : "Place Order"}
        </button>

        {addresses.length === 0 && !isLoadingAddresses && (
          <p className="text-red-500 text-sm">
            Please add at least one address before placing an order.
          </p>
        )}
      </form>
    </div>
  );
};

export default Checkout;
