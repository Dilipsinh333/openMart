import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllOrdersAdminQuery,
  useUpdateOrderStatusMutation,
} from "@/features/order/orderApi";
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Truck,
  Package,
  XCircle,
} from "lucide-react";
import { endpoints } from "@/services/endPoints";

const statusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];

const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get URL parameters
  const statusFilter = searchParams.get("status") || "";
  const searchQuery = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // API calls
  // const {
  //   data: orders = [],
  //   isLoading,
  //   refetch,
  //   isFetching,
  // } = useGetAllOrdersQuery({
  //   search: searchQuery || undefined,
  //   status: statusFilter || undefined,
  //   page,
  //   limit: 20,
  // });
  // const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Replace the mock data and API calls section with:
  const {
    data: ordersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllOrdersAdminQuery(
    {
      page,
      limit: 20,
      search: searchQuery || undefined,
      status: statusFilter || undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Replace the orders constant with:
  const orders = ordersData?.data || [];

  const itemsPerPage = 20;
  const totalPages = Math.ceil(
    (ordersData?.pagination?.total || 0) / itemsPerPage
  );

  // Filter and pagination logic
  // const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Update the filteredOrders useMemo:
  const filteredOrders = useMemo(() => {
    return orders;
  }, [orders]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, page]);

  // Update URL parameters
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    if (Object.keys(updates).some((key) => key !== "page")) {
      newParams.set("page", "1");
    }
    setSearchParams(newParams);
  };

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ search: localSearch || null });
  };

  const handleStatusFilter = (status: string) => {
    updateSearchParams({ status: status === statusFilter ? null : status });
  };

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleBulkAction = async (
    action: "Shipped" | "Failed" | "Delivered" | "Cancelled"
  ) => {
    if (selectedOrders.length === 0) {
      toast.warning("Please select orders first");
      return;
    }
    try {
      await Promise.all(
        selectedOrders.map((orderId) =>
          updateOrderStatus({ id: orderId, status: action }).unwrap()
        )
      );
      toast.success(`${selectedOrders.length} orders updated to ${action}`);
      setSelectedOrders([]);
      refetch();
    } catch (error) {
      toast.error(`Failed to update orders`);
    }
  };

  const handleOrderAction = async (orderId: string, action: string) => {
    try {
      // await updateOrderStatus({ id: orderId, status: action }).unwrap();
      toast.success(`Order ${orderId} updated to ${action}`);
      refetch();
    } catch (error) {
      toast.error(`Failed to update order`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-indigo-100 text-indigo-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
      case "Faied":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">
            Manage all orders and update their status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search by Order ID or Customer Name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      statusFilter === status
                        ? "bg-blue-100 border-blue-300 text-blue-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedOrders.length} order(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("Shipped")}
                className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => handleBulkAction("Delivered")}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Mark as Delivered
              </button>
              <button
                onClick={() => handleBulkAction("Cancelled")}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel All
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedOrders.length === paginatedOrders.length &&
                      paginatedOrders.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(paginatedOrders.map((o) => o.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.orderId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders([
                              ...selectedOrders,
                              order.orderId,
                            ]);
                          } else {
                            setSelectedOrders(
                              selectedOrders.filter(
                                (id) => id !== order.orderId
                              )
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 font-mono">
                        {order.orderId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.username}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {/* If multiple products, show first one with +X more */}
                        <div>
                          <span>{order.productName[0]}</span>
                          {order.productName.length > 1 && (
                            <span className="ml-1 text-xs text-gray-500">
                              +{order.productName - 1} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        ₹{order.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.orderPlacedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/orders/${order.orderId}`)
                          }
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === "Pending" && (
                          <button
                            onClick={() =>
                              handleOrderAction(order.id, "Shipped")
                            }
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Mark as Shipped"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === "Shipped" && (
                          <button
                            onClick={() =>
                              handleOrderAction(order.id, "Delivered")
                            }
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Mark as Delivered"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === "Pending" && (
                          <button
                            onClick={() =>
                              handleOrderAction(order.id, "cancelled")
                            }
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(page - 1) * itemsPerPage + 1} to{" "}
                {Math.min(page * itemsPerPage, filteredOrders.length)} of{" "}
                {filteredOrders.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSearchParams({ page: String(page - 1) })}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() =>
                        updateSearchParams({ page: String(pageNum) })
                      }
                      className={`px-3 py-1 text-sm border rounded ${
                        page === pageNum
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => updateSearchParams({ page: String(page + 1) })}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
