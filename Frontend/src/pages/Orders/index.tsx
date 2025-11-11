import Loader from "@/components/Loader";
import { useGetOrdersQuery } from "@/features/order/orderApi";

const Orders = () => {
  const { data, isLoading } = useGetOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const orders = data || [];

  return (
    <div
      className={`relative ${isLoading ? "max-h-screen overflow-hidden" : ""}`}
    >
      {isLoading && <Loader />}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-emerald-700">
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">You haven’t placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold">Order ID: {order.orderId}</p>
                    <p className="text-sm text-gray-500">
                      Placed on {order.orderPlacedDate.toString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-2">
                  {order.productName.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="font-medium text-gray-800">
                  Total: ₹{order.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
