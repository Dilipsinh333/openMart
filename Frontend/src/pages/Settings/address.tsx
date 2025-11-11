import { useNavigate } from "react-router-dom";
import {
  useGetAddressesQuery,
  useDeleteAddressMutation,
} from "@/features/address/addressApi";
import {
  MapPin,
  Phone,
  User,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";

const AddressList = () => {
  const navigate = useNavigate();
  const [deleteAddress] = useDeleteAddressMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: addresses = [], isLoading, isError } = useGetAddressesQuery();

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        setDeletingId(addressId);
        await deleteAddress(addressId).unwrap();
        toast.success("Address deleted successfully!");
      } catch (error: any) {
        toast.error("Failed to delete address. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEditAddress = (address: any) => {
    // Navigate to edit form with address data
    navigate(`/settings/edit-address/${address.addressId}`, {
      state: { address },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 relative">
          <button
            onClick={() => navigate("/settings")}
            className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Addresses
            </h1>
            <p className="text-gray-600">Manage your delivery addresses</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading addresses...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-8">
              <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4">
                Failed to load addresses. Please try again.
              </p>
            </div>
          )}

          {!isLoading && addresses.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No addresses found
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first address to get started with deliveries
              </p>
            </div>
          )}

          {!isLoading && addresses.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Saved Addresses ({addresses.length})
              </h3>

              {addresses.map((address, index) => (
                <div
                  key={address.addressId}
                  className="border border-gray-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-semibold text-gray-900">
                          {address.fullName || "Unnamed Address"}
                        </h4>
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                          Address {index + 1}
                        </span>
                      </div>

                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="leading-relaxed">
                              {address.addressLine1}
                              {address.addressLine2 && (
                                <>
                                  <br />
                                  {address.addressLine2}
                                </>
                              )}
                            </p>
                            <p className="font-medium">
                              {address.city}, {address.state} -{" "}
                              {address.pinCode}
                            </p>
                          </div>
                        </div>

                        {address.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{address.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditAddress(address)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium px-3 py-1 border border-emerald-200 rounded-md hover:bg-emerald-50 transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.addressId)}
                        disabled={deletingId === address.addressId}
                        className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === address.addressId ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600"></div>
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Address Button */}
          <div className="border-t border-gray-200 pt-6">
            <button
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={() => navigate("/settings/add-address")}
            >
              <Plus className="w-5 h-5" />
              Add New Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressList;
