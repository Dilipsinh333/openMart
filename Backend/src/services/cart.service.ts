import { v4 as uuidv4 } from 'uuid';
import { CartEntity } from '../models/cart.model';
import { ProductEntity } from '../models/product.model';
import { ApiError } from '../utils/apiError';

const addProduct = async (userId: string, productId: string) => {
  const productExists = await ProductEntity.get({ productId }).go();
  if (!productExists.data) {
    throw new ApiError('Product not found with id: ' + productId, 400);
  }

  const idOfProduct = productId;
  const existingCartItem = await CartEntity.query
    .cartById({ gsi1pk: userId })
    .where(({ productId }, { eq }) => eq(productId, idOfProduct))
    .go();
  if (existingCartItem.data.length > 0) {
    throw new ApiError('Product already exists in cart', 400);
  }

  const addedCartItem = await CartEntity.put({
    userId,
    productId,
    cartId: uuidv4(),
    gsi1pk: userId,
    gsi1sk: new Date().toISOString()
  }).go();
  if (!addedCartItem || !addedCartItem.data) {
    throw new ApiError('Error adding product to cart', 500);
  }
  return addedCartItem.data;
};

const getCartItemsByUserId = async (userId: string) => {
  const cartItems = await CartEntity.query.cartById({ gsi1pk: userId }).go();
  if (!cartItems || !cartItems.data) {
    throw new ApiError('No cart items found for user with id: ' + userId, 404);
  }
  const productIds = cartItems.data.map((item) => item.productId);
  const products = await Promise.all(
    productIds.map(
      async (item) =>
        (
          await ProductEntity.find({})
            .where(({ productId }, { eq }) => eq(productId, item))
            .go()
        ).data[0]
    )
  );

  return products;
};

const removeFromCart = async (userId: string, productId: string) => {
  const productExists = await ProductEntity.get({ productId }).go();
  if (!productExists.data) {
    throw new ApiError('Product not found with id: ' + productId, 400);
  }

  const product = productId;

  const record = await CartEntity.query
    .cartById({ gsi1pk: userId })
    .where(({ productId }, { eq }) => eq(productId, product))
    .go();

  const removedItem = await CartEntity.remove({
    // userId: record.data[0].userId,
    // productId: record.data[0].productId,
    cartId: record.data[0].cartId
  }).go();
  return removedItem.data;
};

export { addProduct, getCartItemsByUserId, removeFromCart };
