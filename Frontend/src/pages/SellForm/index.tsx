import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { sellItemSchema } from "@/validators/sellItemSchema";
import Loader from "@/components/Loader";
import { useAddProductMutation } from "@/features/product/productApi";
import { toast } from "react-toastify";
import { useState } from "react";
import { useGetAddressesQuery } from "@/features/address/addressApi";
import {
  ArrowLeft,
  X,
  Upload,
  ImageIcon,
  DollarSign,
  Package,
} from "lucide-react";

export type SellItemData = z.infer<typeof sellItemSchema>;

export default function SellItem() {
  const navigate = useNavigate();
  const [sellType, setSellType] = useState<"Sell with us" | "Sell to us">(
    "Sell with us"
  );
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [showImageError, setShowImageError] = useState(false);
  const { data: addresses = [] } = useGetAddressesQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SellItemData>({
    resolver: zodResolver(sellItemSchema),
  });

  const [addProduct, { isLoading }] = useAddProductMutation();

  // Handle image selection with 4 image limit
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const totalImages = selectedImages.length + fileArray.length;

      if (totalImages > 4) {
        toast.error("Maximum 4 images allowed");
        return;
      }

      setSelectedImages((prev) => [...prev, ...fileArray]);
      setShowImageError(false); // Reset error when images are added
      // Update form value for validation
      setValue("images", [...selectedImages, ...fileArray] as any);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setValue("images", newImages as any);
    // Show error if no images left
    if (newImages.length === 0) {
      setShowImageError(true);
    }
  };

  // (RTK Query handles address fetching)

  const onSubmit = async (data: SellItemData) => {
    console.log("Form submitted with data:", data);

    try {
      // Validate images manually since we're not using register for images
      if (selectedImages.length === 0) {
        setShowImageError(true);
        toast.error("Please upload at least one image");
        return;
      }

      if (selectedImages.length > 4) {
        toast.error("Maximum 4 images allowed");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("currentPrice", String(data.currentPrice));
      formData.append("originalPrice", String(data.originalPrice));
      formData.append("category", data.category);
      formData.append("itemUrl", data.itemUrl ?? "");
      formData.append("ageGroup", data.ageGroup);
      formData.append("condition", data.condition);
      formData.append("sellType", sellType);
      formData.append("pickupAddress", data.pickupAddress);

      // Use selectedImages instead of data.images
      selectedImages.forEach((file: File) => {
        formData.append("images", file);
      });

      await addProduct(formData).unwrap();
      toast.success("Product added successfully!");
      navigate("/");
    } catch (err: any) {
      console.error("Submission error:", err);
      // Show backend error message if available
      const msg = err?.data?.message || err?.message || "Product update failed";
      toast.error(msg);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8 px-4">
      {isLoading && <Loader />}

      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sell Your Item
            </h1>
            <p className="text-gray-600">
              Fill out the details below to list your item for sale
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6">
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.log("Form validation errors:", errors);
              toast.error("Please fill in all required fields");
            })}
            className="space-y-8"
          >
            {/* Sell Type Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                Selling Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="relative flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="Sell with us"
                    checked={sellType === "Sell with us"}
                    onChange={() => setSellType("Sell with us")}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 ${
                      sellType === "Sell with us"
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {sellType === "Sell with us" && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Sell with us
                    </span>
                    <p className="text-sm text-gray-500">
                      We'll help you sell your item
                    </p>
                  </div>
                </label>

                <label className="relative flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="Sell to us"
                    checked={sellType === "Sell to us"}
                    onChange={() => setSellType("Sell to us")}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 ${
                      sellType === "Sell to us"
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {sellType === "Sell to us" && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Sell to us
                    </span>
                    <p className="text-sm text-gray-500">
                      We'll buy your item directly
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-emerald-600" />
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Product Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Category Field */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    {...register("category")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a category</option>
                    <option value="cloths">Cloths</option>
                    <option value="toys">Toys</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Original Price Field */}
                <div>
                  <label
                    htmlFor="originalPrice"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Original Price (₹)
                  </label>
                  <input
                    id="originalPrice"
                    type="number"
                    {...register("originalPrice", { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="Enter original price"
                  />
                  {errors.originalPrice && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.originalPrice.message}
                    </p>
                  )}
                </div>

                {/* Current Price Field */}
                <div>
                  <label
                    htmlFor="currentPrice"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Selling Price (₹)
                  </label>
                  <input
                    id="currentPrice"
                    type="number"
                    {...register("currentPrice", { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="Enter selling price"
                  />
                  {errors.currentPrice && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.currentPrice.message}
                    </p>
                  )}
                </div>

                {/* Age Group Field */}
                <div>
                  <label
                    htmlFor="ageGroup"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Age Group
                  </label>
                  <input
                    id="ageGroup"
                    type="text"
                    {...register("ageGroup")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="Enter age group (e.g., 2-5 years)"
                  />
                  {errors.ageGroup && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ageGroup.message}
                    </p>
                  )}
                </div>

                {/* Condition Field */}
                <div>
                  <label
                    htmlFor="condition"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Condition
                  </label>
                  <select
                    id="condition"
                    {...register("condition")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.condition.message}
                    </p>
                  )}
                </div>

                {/* Dimensions Field */}
                <div>
                  <label
                    htmlFor="dimensions"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Dimensions (Optional)
                  </label>
                  <input
                    id="dimensions"
                    type="text"
                    {...register("dimensions")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="Enter dimensions (e.g., 24 inches)"
                  />
                  {errors.dimensions && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dimensions.message}
                    </p>
                  )}
                </div>

                {/* Item URL Field */}
                <div>
                  <label
                    htmlFor="itemUrl"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Product URL (Optional)
                  </label>
                  <input
                    id="itemUrl"
                    type="url"
                    {...register("itemUrl")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="Enter product URL"
                  />
                  {errors.itemUrl && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.itemUrl.message}
                    </p>
                  )}
                </div>

                {/* Description Field (Full Width) */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register("description")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="Describe your product..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Pickup Address Field (Full Width) */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="pickupAddress"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pickup Address
                  </label>
                  <select
                    id="pickupAddress"
                    {...register("pickupAddress")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select pickup address</option>
                    {addresses.map((address: any) => {
                      const displayText = `${address.addressLine1 || ""}, ${
                        address.city || ""
                      }, ${address.state || ""} ${address.pinCode || ""}`
                        .replace(/^,\s*/, "")
                        .replace(/,\s*,/g, ",");
                      return (
                        <option
                          key={address.addressId}
                          value={address.addressId}
                        >
                          {displayText}
                        </option>
                      );
                    })}
                  </select>
                  {errors.pickupAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pickupAddress.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-emerald-600" />
                Product Images ({selectedImages.length}/4)
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="images"
                      className={`relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 ${
                        selectedImages.length >= 4
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <span>Upload files</span>
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={selectedImages.length >= 4}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB each (Maximum 4 images)
                  </p>
                  {selectedImages.length >= 4 && (
                    <p className="text-xs text-red-500 mt-1">
                      Maximum 4 images reached. Remove an image to add more.
                    </p>
                  )}
                </div>
              </div>

              {/* Image Preview */}
              {selectedImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Selected Images:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          {/* Image Preview */}
                          <div className="flex-shrink-0">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                          </div>

                          {/* Image Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {image.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(image.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show validation error if no images selected and form was submitted */}
              {showImageError && selectedImages.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  Please upload at least one image
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                onClick={() => console.log("Submit button clicked")}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  "Submit Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
