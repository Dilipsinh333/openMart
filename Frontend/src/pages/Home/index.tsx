import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-bold text-emerald-700 mb-4">
          Welcome to KidsCycle
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Buy and sell pre-loved kids' items with ease and trust.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/shop"
            className="px-6 py-3 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Shop Now
          </Link>
          <Link
            to="/sell"
            className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded hover:bg-emerald-50"
          >
            Sell Items
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
