// services/endpoints.ts
export const endpoints = {
  login: "/api/users/login",
  logout: "/api/users/logout",
  getMe: "/api/users/me",
  register: "/api/users/register",
  getUsers: "/api/users/admin",

  // Product endpoints
  getProducts: "/api/products",
  getProduct: "/api/products/",
  addProduct: "/api/products/add-product",
  searchProducts: "/api/products/search",
  getFeaturedProducts: "/api/products/featured",
  getProductsByCategory: (category: string) =>
    `/api/products/category/${category}`,
  getUnapprovedProducts: "/api/products/admin/unapproved",
  approveProduct: (productId: string) =>
    `/api/products/admin/approve/${productId}`,

  // Cart & Orders
  cart: "/api/cart",
  placeOrder: "/api/order/place-order",
  getOrders: "/api/order/",
  updateOrderStatus: "/api/order/",
  getOrdersAdmin: "/api/order/admin",
  checkout: "/orders/checkout",

  // Wishlist
  getWishlist: "/api/wishlist",
  addWishlistItem: "/api/wishlist",
  removeWishlistItem: (productId: string) => `/api/wishlist/${productId}`,

  // Address
  address: "/api/address",
  getAllAddresses: "/api/address",
  updateAddress: "/api/address/",

  // Contact endpoints
  contact: "/api/contact",
  myInquiries: (email: string) => `/api/contact/my-inquiries/${email}`,
  contactAdmin: "/api/contact/admin",
  contactStats: "/api/contact/admin/stats",
  contactBulk: "/api/contact/admin/bulk",
  getContactInquiry: (contactId: string) => `/api/contact/admin/${contactId}`,
  updateContactStatus: (contactId: string) =>
    `/api/contact/admin/${contactId}/status`,
  respondToContact: (contactId: string) =>
    `/api/contact/admin/${contactId}/respond`,
  markContactAsRead: (contactId: string) =>
    `/api/contact/admin/${contactId}/read`,
  deleteContact: (contactId: string) => `/api/contact/admin/${contactId}`,
};
