import { v4 as uuidv4 } from 'uuid';
import { WishlistEntity } from '../models/wishlist.model';
import { ProductEntity } from '../models/product.model';
import { ApiError } from '../utils/apiError';

export const addProductToWishlist = async (userId: string, productId: string) => {
  const product = await ProductEntity.get({ productId }).go();
  if (!product.data) {
    throw new ApiError('Product not found', 404);
  }

  const existing = await WishlistEntity.query
    .wishlistByUser({ gsi1pk: userId })
    .where((attr, { eq }) => eq(attr.productId, productId))
    .go();

  if (existing.data.length > 0) {
    throw new ApiError('Product already in wishlist', 400);
  }

  const wishlistItem = await WishlistEntity.put({
    wishlistId: uuidv4(),
    userId,
    productId,
    gsi1pk: userId,
    gsi1sk: new Date().toISOString()
  }).go();

  return wishlistItem.data;
};

export const getWishlistItemsByUserId = async (userId: string) => {
  const items = await WishlistEntity.query.wishlistByUser({ gsi1pk: userId }).go();
  const productIds = items.data.map((item) => item.productId);

  const products = await Promise.all(
    productIds.map(async (id) => {
      const result = await ProductEntity.get({ productId: id }).go();
      return result.data;
    })
  );

  return products.filter(Boolean); // remove null/undefined
};

export const removeProductFromWishlist = async (userId: string, productId: string) => {
  const existing = await WishlistEntity.query
    .wishlistByUser({ gsi1pk: userId })
    .where((attr, { eq }) => eq(attr.productId, productId))
    .go();

  if (!existing.data.length) {
    throw new ApiError('Product not found in wishlist', 404);
  }

  await WishlistEntity.delete({ wishlistId: existing.data[0].wishlistId }).go();
};
