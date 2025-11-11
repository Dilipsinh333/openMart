import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAdminOrderDetailQuery,
  useUpdateOrderStatusMutation,
} from "@/features/order/orderApi";
import { useGetAllUsersQuery } from "@/features/auth/authApi";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Tag,
  Truck,
  MapPin,
  User,
  Package,
  IndianRupee,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: orderData,
    isLoading,
    refetch,
  } = useGetAdminOrderDetailQuery(id!);
  const order = Array.isArray(orderData) ? orderData[0] : orderData;
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = React.useState("");
  // fetch delivery boys
  const { data: deliveryBoys = [] } = useGetAllUsersQuery(
    {
      userType: "DeliveryBoy",
    },
    {
      skip: !order || order.status !== "Pending", // skip until order is loaded & pending
      refetchOnMountOrArgChange: true,
    }
  );
  const deliveryBoysData = deliveryBoys.data;

  const handleStatusUpdate = async (
    newStatus: "Shipped" | "Delivered" | "Failed" | "Cancelled"
  ) => {
    try {
      if (newStatus === "Shipped" && !selectedDeliveryBoy) {
        toast.warning("Please select a delivery boy before shipping");
        return;
      }

      await updateOrderStatus({
        orderId: id!,
        status: newStatus,
        ...(newStatus === "Shipped" && { deliveryBoy: selectedDeliveryBoy }),
      }).unwrap();

      await refetch();

      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-300";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        Order not found.
        <button
          onClick={() => navigate("/admin/orders")}
          className="ml-4 text-blue-600 underline"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
      </div>

      {/* Order Info */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Placed: {order.orderPlacedDate}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Order ID:</strong> {order.orderId}
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" /> {order.username || order.userId}
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4" /> Payment: {order.paymentStatus}
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4" /> Amount: ₹{order.amount}
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4" /> Delivery Boy:{" "}
            {order.deliveryBoy || "Not assigned"}
          </div>
          <div className="flex items-start gap-1">
            <MapPin className="w-4 h-4 mt-0.5" />{" "}
            {order.address.city + ", " + order.address.state}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Products in Order</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {order.productsDetail?.map((product) => (
            <div
              key={product.productId}
              onClick={() => navigate(`/admin/products/${product.productId}`)}
              className="border rounded-lg p-4 flex gap-4 cursor-pointer hover:shadow"
            >
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-sm">Condition: {product.condition}</p>
                <p className="text-sm">₹{product.currentPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Management */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
        <div className="space-y-4">
          {order.status === "Pending" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Delivery Boy
                </label>
                <select
                  value={selectedDeliveryBoy}
                  onChange={(e) => setSelectedDeliveryBoy(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select a delivery boy</option>
                  {deliveryBoysData?.map((boy) => (
                    <option key={boy.userId} value={boy.userId}>
                      {boy.name}, {boy.email}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleStatusUpdate("Shipped")}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Tag className="w-4 h-4" /> Mark as Shipped
              </button>
            </div>
          )}

          {order.status === "Shipped" && (
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusUpdate("Delivered")}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" /> Mark as Delivered
              </button>
              <button
                onClick={() => handleStatusUpdate("Failed")}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Mark as Failed
              </button>
            </div>
          )}

          {["Pending", "Shipped"].includes(order.status) && (
            <button
              onClick={() => handleStatusUpdate("Cancelled")}
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              <X className="w-4 h-4" /> Cancel Order
            </button>
          )}

          {isUpdating && (
            <div className="text-sm text-gray-500">
              Updating order status...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
