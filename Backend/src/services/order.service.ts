import { log } from 'console';
import { Roles } from '../constants/roles';
import { CartEntity } from '../models/cart.model';
import { OrderEntity } from '../models/order.model';
import { ProductEntity } from '../models/product.model';
import { UserEntity } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { v4 as uuidv4 } from 'uuid';
import { AddressEntity } from '../models/address.model';

const saveOrder = async (
  userid: string,
  products: string[],
  shippingAddress: string,
  paymentStatus: string,
  paymentId: string
) => {
  const results = await Promise.all(
    products.map(async (productId) => {
      const product = await ProductEntity.get({ productId }).go();
      if (!product.data) {
        throw new ApiError('Order failed due to invalid product id: ' + productId, 404);
      }
      return product.data;
    })
  );

  let image = '';
  let amount = 0;

  for (const data of results) {
    if (!image) {
      image =
        (data.images as { filename?: string; url?: string }[] | undefined)?.[0]?.url ??
        'defaultImage.png';
    }
    amount += data.currentPrice;
  }

  const orderId = uuidv4();

  // getting date after 5 days from current date
  const expectedDeliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }
  );

  const orderPlacedDate = new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).format(new Date());

  const order = {
    orderId,
    userId: userid,
    products,
    amount,
    shippingAddress,
    paymentStatus,
    paymentId,
    expectedDeliveryDate,
    orderPlacedDate,
    image,
    gsi1pk: userid,
    gsi1sk: new Date().toISOString()
  };

  const result = await OrderEntity.put(order).go();

  // Updating product status as sold out
  for (const id of products) {
    await ProductEntity.update({ productId: id }).set({ status: 'Sold out' }).go();

    // Find cart item by userId & productId
    const { data: cartItems } = await CartEntity.find({})
      .where(({ productId }, { eq }) => eq(productId, id))
      .where(({ userId }, { eq }) => eq(userId, userid))
      .go();

    if (cartItems.length === 0) {
      throw new Error('Cart item not found');
    }

    // Delete using the cartId from the found item
    await CartEntity.remove({ cartId: cartItems[0].cartId }).go();
  }

  return result;
};

const getOrders = async (userId: string, role: string) => {
  let orders;

  if (role === Roles.ADMIN) {
    orders = await OrderEntity.find({}).go();
  } else if (role === Roles.CUSTOMER) {
    orders = await OrderEntity.query.orderById({ gsi1pk: userId }).go();
  }

  let order = orders?.data;

  orders = await Promise.all(
    order.map(async (order) => {
      // getting products with it's product name
      // Get product names
      const productsData = await Promise.all(
        order.products.map(async (productId) => {
          const product = await ProductEntity.get({ productId }).go();
          return product.data?.name || null;
        })
      );
      order.productName = productsData;
      return order;
    })
  );
  if (orders) {
    return orders;
  } else {
    throw new ApiError('No orders found for the user: ' + userId, 404);
  }
};

const updateDeliveryStatus = async (
  orderId: string,
  status: 'Shipped' | 'Delivered' | 'Failed',
  userType: string,
  deliveryBoy?: string
) => {
  const order = await OrderEntity.get({ orderId }).go();
  if (!order.data) {
    throw new ApiError('Order not found with id: ' + orderId, 400);
  }

  if (order.data.status === 'Delivered') {
    throw new ApiError('Order already delivered', 400);
  }

  if (status === 'Shipped') {
    if (userType !== Roles.ADMIN)
      throw new ApiError('Login as a admin to update order status as shipped', 403);

    if (order.data.status !== 'Pending') {
      throw new ApiError('Order must be pending before it can be shipped', 400);
    }

    if (!deliveryBoy) {
      throw new ApiError('Delivery boy is required to update order status as shipped', 400);
    }

    // validate delivery partner
    const deliveryPartner = await UserEntity.get({ userId: deliveryBoy }).go();
    if (!deliveryPartner.data || deliveryPartner.data.userType !== Roles.DELIVERY_BOY) {
      throw new ApiError('Invalid delivery partner', 400);
    }
  }

  if (status === 'Delivered' || status === 'Failed') {
    if (userType !== Roles.ADMIN && userType !== Roles.DELIVERY_BOY)
      throw new ApiError('Login as a delivery boy to update order status as delivered', 403);

    if (order.data.status !== 'Shipped')
      throw new ApiError('Order must be shipped before it can be delivered', 400);
  }

  const updatedOrder = await OrderEntity.update({ orderId })
    .set({ status: status, deliveryBoy: deliveryBoy })
    .go();

  return updatedOrder.data;
};

interface AdminOrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
}

const getAllOrdersForAdmin = async (filters: AdminOrderFilters = {}) => {
  try {
    const { page = 1, limit = 20, search, status, startDate, endDate, sortBy = 'newest' } = filters;

    // Get all orders from database
    const allOrdersResult = await OrderEntity.scan.go();
    let orders = allOrdersResult.data || [];

    orders = await Promise.all(
      orders.map(async (order) => {
        const user = await UserEntity.get({ userId: order.userId }).go();

        // getting products with it's product name
        // Get product names
        const productsData = await Promise.all(
          order.products.map(async (productId) => {
            const product = await ProductEntity.get({ productId }).go();
            return product.data?.name || null;
          })
        );
        order.productName = productsData.filter(Boolean); // Remove nulls

        order.username = user.data?.email;
        return order;
      })
    );

    // Apply filters
    if (status) {
      orders = orders.filter((order) => order.status === status);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      orders = orders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm) ||
          order.userId.toLowerCase().includes(searchTerm) ||
          order.paymentId?.toLowerCase().includes(searchTerm)
      );
    }

    // Date range filter
    if (startDate || endDate) {
      orders = orders.filter((order) => {
        const orderDate = new Date(order.gsi1sk || order.orderPlacedDate);
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        return orderDate >= start && orderDate <= end;
      });
    }

    // Sorting
    orders.sort((a, b) => {
      const aDate = new Date(a.gsi1sk || a.orderPlacedDate).getTime();
      const bDate = new Date(b.gsi1sk || b.orderPlacedDate).getTime();

      switch (sortBy) {
        case 'oldest':
          return aDate - bDate;
        case 'amount-high-to-low':
          return b.amount - a.amount;
        case 'amount-low-to-high':
          return a.amount - b.amount;
        case 'newest':
        default:
          return bDate - aDate;
      }
    });

    // Calculate total amount for filtered orders
    const totalAmount = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

    // Pagination
    const total = orders.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      pagination: {
        current: page,
        total: totalPages,
        count: paginatedOrders.length,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      totalAmount
    };
  } catch (error) {
    console.error('Error in getAllOrdersForAdmin:', error);
    throw new ApiError('Failed to retrieve orders for admin', 500);
  }
};

const getOrderById = async (orderId: string) => {
  const order = await OrderEntity.find({ orderId }).go();
  return order.data;
};

const getAdminOrderDetails = async (orderId: string) => {
  const order = await OrderEntity.find({ orderId }).go();

  const products = await Promise.all(
    order.data[0].products.map(async (productId) => {
      const product = await ProductEntity.get({ productId }).go();
      return product.data;
    })
  );
  const user = await UserEntity.get({ userId: order.data[0].userId }).go();
  const address = await AddressEntity.get({ addressId: order.data[0].shippingAddress || '' }).go();

  order.data[0].username = user.data?.email;
  order.data[0].address = address.data;
  order.data[0].productsDetail = products;
  return order.data;
};

export {
  saveOrder,
  getOrderById,
  getOrders,
  updateDeliveryStatus,
  getAllOrdersForAdmin,
  getAdminOrderDetails
};
