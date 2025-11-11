import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Loader from "@/components/Loader";
import { type Cart } from "@/types/cart";
import {
  useGetCartItemsQuery,
  useRemoveFromCartMutation,
} from "@/features/cart/cartApi";
import { useDispatch } from "react-redux";
import { FETCH_CART_PRODUCTS } from "@/features/cartSlice";
import { useEffect } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [removeFromCart] = useRemoveFromCartMutation();

  // const { data: cartItems = [], isLoading } = useGetCartItemsQuery();
  const { data: cartItems = [], isLoading } = useGetCartItemsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    dispatch(FETCH_CART_PRODUCTS(cartItems));
  }, [cartItems]);

  const removeItem = async (id: string) => {
    await removeFromCart({ productId: id }).unwrap();
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.currentPrice,
    0
  );

  return (
    <div
      className={`relative ${isLoading ? "max-h-screen overflow-hidden" : ""}`}
    >
      {isLoading && <Loader />}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-emerald-700">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
                >
                  <img
                    src={item.images[0]?.url}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  />
                  <div className="p-4 space-y-2">
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-gray-600 text-sm">
                      ₹{item.currentPrice}
                    </p>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center mt-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <p className="text-lg font-medium">Total: ₹{totalPrice}</p>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
