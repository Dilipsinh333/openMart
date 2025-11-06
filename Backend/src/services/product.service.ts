import { ProductEntity } from '../models/product.model';
import { ApiError } from '../utils/apiError';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { UserEntity } from '../models/user.model';
import { AddressEntity } from '../models/address.model';
import { ProductStatus } from '../constants/productStatus';
import { Roles } from '../constants/roles';
import { v2 as cloudinary } from 'cloudinary';
import { upload } from '../utils/multer';
import https from 'https';

async function uploadImage(filePath: string, productId: string, imageName: string) {
  try {
    // Only disable SSL verification in development
    const isDevelopment = process.env.NODE_ENV !== 'production';

    let uploadOptions: any = {
      folder: productId, // folder will be "productId"
      public_id: imageName, // name of the file
      resource_type: 'image' as const,
      overwrite: true, // overwrite if exists
      timeout: 60000
    };

    // Only add SSL bypass in development
    if (isDevelopment) {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      uploadOptions.agent = agent;
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    console.log('Uploaded:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

const saveProduct = async (
  name: string,
  description: string,
  originalPrice: number,
  currentPrice: number,
  category: string,
  userId: string,
  ageGroup: string,
  condition: string,
  sellType: 'Sell with us' | 'Sell to us',
  itemUrl: string,
  pickupAddress: string,
  files: Express.Multer.File[]
) => {
  if (!files || files.length === 0) {
    throw new ApiError('At least one image is required', 400);
  }

  const productId = uuidv4();

  // verifying address for pickup
  const validateAddress = await AddressEntity.get({ addressId: pickupAddress }).go();
  if (!validateAddress || !validateAddress.data) {
    throw new ApiError('Invalid pickup address', 400);
  }

  const imageFolderPath = path.join(process.cwd(), 'uploads', productId);

  if (!fs.existsSync(imageFolderPath)) {
    fs.mkdirSync(imageFolderPath, { recursive: true });
  }
  const images = await Promise.all(
    files.map(async (file, index) => {
      const ext = path.extname(file.originalname);
      const filename = `image-${index + 1}${ext}`;
      const filePath = path.join(imageFolderPath, filename);

      fs.writeFileSync(filePath, file.buffer);

      const imageURL = await uploadImage(filePath, productId, filename);
      return {
        filename,
        url: imageURL
      };
    })
  );

  // const images = files.map(async (file, index) => {
  //   const ext = path.extname(file.originalname);
  //   const filename = `image-${index + 1}${ext}`;
  //   const filePath = path.join(imageFolderPath, filename); // local file path

  //   fs.writeFileSync(filePath, file.buffer);

  //   const imageURL = await uploadImage(filePath, productId, filename);
  //   return {
  //     filename,
  //     url: imageURL
  //   };

  //   // const ext = path.extname(file.originalname);
  //   // const filename = `image-${index + 1}${ext}`;
  //   // const filePath = path.join(imageFolderPath, filename);

  //   // return {
  //   //   filename,
  //   //   url: `/uploads/${productId}/${filename}`
  //   // };
  // });
  const product = {
    productId,
    name,
    description,
    userId,
    originalPrice,
    currentPrice,
    category,
    ageGroup,
    condition,
    sellType,
    itemUrl,
    pickupAddress,
    images,
    gsi1pk: 'product',
    gsi1sk: new Date().toISOString()
  };
  const result = await ProductEntity.put(product).go();

  return result;
};

const getProductDetails = async (productId: string) => {
  const product = await ProductEntity.get({ productId }).go();

  if (!product.data) {
    throw new ApiError(`No such product with id: ${productId}`, 400);
  }

  return product.data;
};

const getAllProducts = async (queryParams?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  condition?: string;
  ageGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  sellType?: 'Sell with us' | 'Sell to us';
  sortBy?: string;
  status?: string;
}) => {
  try {
    let query = ProductEntity.query.productById({ gsi1pk: 'product' });

    // Execute the query first
    let result = await query.go();
    let products = result.data || [];

    // Apply client-side filters for complex filtering
    if (products.length > 0) {
      // Status filter
      if (queryParams?.status) {
        products = products.filter((product) => product.status === queryParams.status);
      }

      // Search filter
      if (queryParams?.search) {
        const searchTerm = queryParams.search.toLowerCase();
        products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm)) ||
            product.category.toLowerCase().includes(searchTerm)
        );
      }

      // Category filter
      if (queryParams?.category) {
        products = products.filter(
          (product) => product.category.toLowerCase() === queryParams.category!.toLowerCase()
        );
      }

      // Condition filter
      if (queryParams?.condition) {
        products = products.filter(
          (product) => product.condition.toLowerCase() === queryParams.condition!.toLowerCase()
        );
      }

      // Age group filter
      if (queryParams?.ageGroup) {
        products = products.filter(
          (product) =>
            product.ageGroup &&
            product.ageGroup.toLowerCase() === queryParams.ageGroup!.toLowerCase()
        );
      }

      // Sell type filter
      if (queryParams?.sellType) {
        products = products.filter((product) => product.sellType === queryParams.sellType);
      }

      // Price range filter
      if (queryParams?.minPrice !== undefined || queryParams?.maxPrice !== undefined) {
        const minPrice = queryParams.minPrice || 0;
        const maxPrice = queryParams.maxPrice || Infinity;
        products = products.filter(
          (product) => product.currentPrice >= minPrice && product.currentPrice <= maxPrice
        );
      }

      // Sorting
      if (queryParams?.sortBy) {
        switch (queryParams.sortBy) {
          case 'price-low-to-high':
            products.sort((a, b) => a.currentPrice - b.currentPrice);
            break;
          case 'price-high-to-low':
            products.sort((a, b) => b.currentPrice - a.currentPrice);
            break;
          case 'name-a-to-z':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-z-to-a':
            products.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'oldest':
            products.sort((a, b) => {
              const aDate = a.gsi1sk ? new Date(a.gsi1sk).getTime() : 0;
              const bDate = b.gsi1sk ? new Date(b.gsi1sk).getTime() : 0;
              return aDate - bDate;
            });
            break;
          case 'newest':
          default:
            products.sort((a, b) => {
              const aDate = a.gsi1sk ? new Date(a.gsi1sk).getTime() : 0;
              const bDate = b.gsi1sk ? new Date(b.gsi1sk).getTime() : 0;
              return bDate - aDate;
            });
            break;
        }
      } else {
        // Default sort by newest
        products.sort((a, b) => {
          const aDate = a.gsi1sk ? new Date(a.gsi1sk).getTime() : 0;
          const bDate = b.gsi1sk ? new Date(b.gsi1sk).getTime() : 0;
          return bDate - aDate;
        });
      }

      // Pagination
      if (queryParams?.page && queryParams?.limit) {
        const startIndex = (queryParams.page - 1) * queryParams.limit;
        const endIndex = startIndex + queryParams.limit;
        products = products.slice(startIndex, endIndex);
      }
    }

    return products;
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw new ApiError('Some error occurred while getting products', 500);
  }
};

const getAllUnapprovedProducts = async () => {
  const products = await ProductEntity.query
    .productById({ gsi1pk: 'product' })
    .where(({ status }, { ne }) => ne(status, 'Completed'))
    .go();
  if (products && products.data) {
    return products.data;
  } else {
    throw new ApiError('Some error occurred while getting unapproved products', 500);
  }
};

const updateProductStatus = async (
  productId: string,
  role: string,
  status:
    | ProductStatus.READY_TO_PICK
    | ProductStatus.PICKED
    | ProductStatus.COMPLETED
    | ProductStatus.REJECTED,
  price?: number,
  pickupGuy?: string
) => {
  const product = await ProductEntity.get({ productId }).go();

  if (!product.data) {
    throw new ApiError(`No such product with id: ${productId}`, 400);
  }

  let updatedProduct;

  if (status === ProductStatus.READY_TO_PICK) {
    if (role !== Roles.ADMIN) {
      throw new ApiError('Only Admin can update product status to Ready to pick', 403);
    }
    if (pickupGuy) {
      // getting pickup guy by comparing role
      const validatePickupGuy = await UserEntity.find({})
        .where(({ userId }, { eq }) => eq(userId, pickupGuy))
        .where(({ userType }, { eq }) => eq(userType, 'DeliveryBoy'))
        .go();

      if (validatePickupGuy && validatePickupGuy.data.length > 0) {
        updatedProduct = await ProductEntity.update({ productId })
          .set({
            status,
            pickupGuy
          })
          .go();
      } else {
        throw new ApiError('Invalid pickup boy', 400);
      }
    } else {
      throw new ApiError('Price and Pickup guy are must for updating status to Ready to pick', 400);
    }
  } else if (status === ProductStatus.PICKED) {
    if (role !== Roles.ADMIN && role !== Roles.DELIVERY_BOY) {
      throw new ApiError('Only DeliveryBoy can update product status to Picked', 403);
    }
    updatedProduct = await ProductEntity.update({ productId }).set({ status }).go();
  } else if (status === ProductStatus.COMPLETED) {
    if (role !== Roles.ADMIN && role !== Roles.DELIVERY_BOY) {
      throw new ApiError('Only DeliveryBoy or Admin can update product status to Completed', 403);
    }
    updatedProduct = await ProductEntity.update({ productId }).set({ status }).go();
  } else if (status === ProductStatus.REJECTED) {
    if (role !== Roles.ADMIN) {
      throw new ApiError('Only Admin can update product status to Rejected', 403);
    }
    updatedProduct = await ProductEntity.update({ productId }).set({ status }).go();
  }

  return updatedProduct;
};

export {
  getProductDetails,
  saveProduct,
  getAllProducts,
  updateProductStatus,
  getAllUnapprovedProducts
};
