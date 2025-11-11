import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProductQuery,
  useUpdateProductStatusMutation,
} from "@/features/product/productApi";
import { toast } from "react-toastify";
// Add to imports
import { useGetAllUsersQuery } from "@/features/auth/authApi";

import {
  ArrowLeft,
  Save,
  CheckCircle,
  Edit,
  Calendar,
  User,
  MapPin,
  Tag,
  DollarSign,
} from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";

const AdminProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProductQuery(id!);
  const [updateProductStatus, { isLoading: isUpdating }] =
    useUpdateProductStatusMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<any>(null);

  React.useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  // 2. Get delivery boys (only when product is loaded & pending)
  const { data: deliveryBoys } = useGetAllUsersQuery(
    { userType: "DeliveryBoy" },
    {
      skip: !product || product.status !== "Pending",
      refetchOnMountOrArgChange: true, // ensures it runs when skip flips to false
    }
  );

  const deliveryBoysData = deliveryBoys?.data || [];

  // Inside the component, add new state
  const [pickupGuy, setPickupGuy] = useState("");
  const [pickupPrice, setPickupPrice] = useState(0);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      let updateData: any = {
        id: id!,
        status: newStatus,
      };

      // Add price and pickup guy for Ready to pick status
      if (newStatus === "Ready to pick") {
        if (!pickupGuy) {
          toast.error("Please select a pickup guy");
          return;
        }
        if (pickupPrice) {
          updateData.price = pickupPrice;
        }
        updateData.pickupGuy = pickupGuy;
      }
      await updateProductStatus(updateData).unwrap();
      toast.success(`Product status updated to ${newStatus}`);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to update product status";
      toast.error(errorMessage);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await updateProductStatus({
        id: id!,
        ...editedProduct,
      }).unwrap();
      toast.success("Product updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to update product";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/admin/products")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "Ready to pick":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Picked":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              isEditing
                ? "bg-gray-100 text-gray-700 border-gray-300"
                : "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
            }`}
          >
            <Edit className="w-4 h-4" />
            {isEditing ? "Cancel Edit" : "Edit Product"}
          </button>
          {isEditing && (
            <button
              onClick={handleSaveChanges}
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Image and Gallery */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Images
            </h3>
            <div className="space-y-4">
              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={getImageUrl(image.url)}
                  alt={`${product.name} - ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                  product.status
                )}`}
              >
                {product.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProduct?.name || ""}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{product.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <p className="text-gray-900 capitalize">{product.category}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Current Price
                </label>
                <p className="text-gray-900 font-medium text-lg">
                  ₹{product.currentPrice}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <p className="text-gray-900">₹{product.originalPrice}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <p className="text-gray-900">{product.condition}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group
                </label>
                <p className="text-gray-900">
                  {product.ageGroup || "Not specified"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sell Type
                </label>
                <p className="text-gray-900">{product.sellType}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date Added
                </label>
                <p className="text-gray-900">
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              {isEditing ? (
                <textarea
                  value={editedProduct?.description || ""}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">
                  {product.description || "No description provided"}
                </p>
              )}
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <User className="w-5 h-5 inline mr-2" />
              Seller Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <p className="text-gray-900 font-mono text-sm">
                  {product.userId}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Pickup Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editedProduct?.pickupAddress || ""}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        pickupAddress: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {product.pickupAddress || "No pickup address provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status Management */}
          {!isEditing && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Status Management
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.status === "Pending" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pickup Price (₹)
                        </label>
                        <input
                          type="number"
                          value={pickupPrice}
                          onChange={(e) =>
                            setPickupPrice(Number(e.target.value))
                          }
                          className="w-full"
                          placeholder="Enter pickup price"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assign Pickup Guy
                        </label>
                        <select
                          value={pickupGuy}
                          onChange={(e) => setPickupGuy(e.target.value)}
                        >
                          <option value="">Select a pickup boy</option>
                          {deliveryBoysData?.map((deliveryBoy) => {
                            const displayText =
                              deliveryBoy.name + ", " + deliveryBoy.email;
                            return (
                              <option
                                key={deliveryBoy.userId}
                                value={deliveryBoy.userId}
                              >
                                {displayText}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStatusUpdate("Ready to pick")}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Tag className="w-4 h-4" />
                      Mark Ready for Pickup
                    </button>
                  </>
                )}
                {product.status === "Ready to pick" && (
                  <button
                    onClick={() => handleStatusUpdate("Picked")}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Picked
                  </button>
                )}
                {product.status === "Picked" && (
                  <button
                    onClick={() => handleStatusUpdate("Completed")}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
