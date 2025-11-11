import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { FETCH_CART_PRODUCTS } from "@/features/cartSlice";
import {
  Recycle,
  Menu,
  X,
  Search,
  Heart,
  ShoppingCart,
  Settings,
  UserPlus,
  Power,
} from "lucide-react";
import { useGetCartItemsQuery } from "@/features/cart/cartApi";
import { useLogoutMutation } from "@/features/auth/authApi";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  // Always get the latest isLoggedIn from Redux
  const authState = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!authState.userId;

  // Get wishlist count
  const wishlistCount = useSelector(
    (state: RootState) => state.wishlist.items.length
  );

  // Check if user is admin
  const isAdmin = authState.role === "Admin";
  const dispatch = useDispatch();
  const { data: cartItems = [] } = useGetCartItemsQuery();
  let cartCount = useSelector((state: RootState) => state.cart.products.length);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  useEffect(() => {
    if (cartItems.length > 0) {
      // Handle cart items if needed
      dispatch(FETCH_CART_PRODUCTS(cartItems));
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      setIsMenuOpen(false);
      setIsLogoutModalOpen(false);
      dispatch(logoutAction()); // clear user/auth state
      toast.success("Logged out successfully");
      // navigate("/login"); // or wherever you want to redirect
    } catch (error: any) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-emerald-600 text-white" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Recycle className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">KidsCycle</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 ml-8">
            {["/", "/how-it-works", "/sell", "/shop", "/about", "/contact"].map(
              (path, idx) => (
                <Link
                  key={path}
                  to={path}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
                >
                  {
                    [
                      "Home",
                      "How It Works",
                      "Sell Items",
                      "Shop",
                      "About Us",
                      "Contact",
                    ][idx]
                  }
                </Link>
              )
            )}
            {/* Admin Link - Only visible to admins */}
            {isLoggedIn && isAdmin && (
              <Link
                to="/admin/products"
                className="relative group ml-4 p-2 rounded-full hover:bg-emerald-700"
                aria-label="Admin Panel"
              >
                <span className="text-white font-semibold">Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Wishlist + Search + Cart */}
          <div className="hidden md:flex items-center">
            <Link
              to={isLoggedIn ? "/wishlist" : "/login"}
              className="relative group ml-4 p-2 rounded-full hover:bg-emerald-700"
              aria-label="Wishlist"
              onClick={(e) => {
                if (!isLoggedIn) {
                  // Let navigation happen
                  setIsMenuOpen(false);
                } else {
                  // Prevent navigation if already on wishlist
                  if (window.location.pathname === "/wishlist") {
                    e.preventDefault();
                  }
                  setIsMenuOpen(false);
                }
              }}
            >
              <Heart className="h-6 w-6" />
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50">
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to={isLoggedIn ? "/cart" : "/login"}
              className="relative group ml-4 p-2 rounded-full hover:bg-emerald-700"
              aria-label="Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to={isLoggedIn ? "/orders" : "/login"}
              className="relative group ml-4 p-2 rounded-full hover:bg-emerald-700"
              aria-label="Orders"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50">
                Orders
              </span>
            </Link>
            <Link
              to={isLoggedIn ? "/settings" : "/login"}
              className="relative group ml-4 p-2 rounded-full hover:bg-emerald-700"
              aria-label="Settings"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-6 w-6" />
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50">
                Settings
              </span>
            </Link>

            {/* Login/Logout Links */}
            {isLoggedIn ? (
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="relative group ml-4 p-2 rounded-full hover:bg-emerald-700"
                aria-label="Logout"
              >
                <Power className="h-5 w-5 mr-2" />
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50">
                  Logout
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="relative group ml-4 p-2 rounded-full hover:bg-emerald-700"
                aria-label="Login"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50">
                  Login
                </span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-emerald-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Section */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {["/", "/how-it-works", "/sell", "/shop", "/about", "/contact"].map(
              (path, idx) => (
                <Link
                  key={path}
                  to={path}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {
                    [
                      "Home",
                      "How It Works",
                      "Sell Items",
                      "Shop",
                      "About Us",
                      "Contact",
                    ][idx]
                  }
                </Link>
              )
            )}
            <div className="relative mt-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-300" />
              </div>
              <input
                className="bg-emerald-700 block w-full pl-10 pr-3 py-2 rounded-md text-sm placeholder-emerald-300"
                type="text"
                placeholder="Search products..."
              />
            </div>
            <Link
              to="/cart"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
            </Link>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)} // Close modal
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout} // Perform logout
                disabled={isLoggingOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
