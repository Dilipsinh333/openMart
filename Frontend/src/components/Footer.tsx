import React from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Socials */}
          <div>
            <Link
              to="/"
              className="flex items-center"
              aria-label="KidsCycle Home"
            >
              <Recycle className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">KidsCycle</span>
            </Link>
            <p className="mt-4 text-gray-300">
              Giving children's clothes and toys a second life while making a
              positive impact on our planet.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-300 hover:text-white"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-300 hover:text-white"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-gray-300 hover:text-white"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/how-it-works", label: "How It Works" },
                { to: "/sell", label: "Sell Items" },
                { to: "/shop", label: "Shop" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-300 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {[
                ["clothing", "Clothing"],
                ["toys", "Toys"],
                ["books", "Books"],
                ["accessories", "Accessories"],
                ["shoes", "Shoes"],
              ].map(([category, label]) => (
                <li key={category}>
                  <Link
                    to={`/shop?category=${category}`}
                    className="text-gray-300 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {[
                ["baby", "Baby (0–2)"],
                ["toddler", "Toddler (2–4)"],
                ["kids", "Kids (4–12)"],
              ].map(([age, label]) => (
                <li key={age}>
                  <Link
                    to={`/shop?age=${age}`}
                    className="text-gray-300 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 text-emerald-400" />
                123 Green Street, Eco City, EC 12345
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-emerald-400" />
                <a href="tel:1234567890" className="hover:text-white">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-emerald-400" />
                <a
                  href="mailto:hello@kidscycle.com"
                  className="hover:text-white"
                >
                  hello@kidscycle.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300">
              © {new Date().getFullYear()} KidsCycle. All rights reserved.
            </p>
            <ul className="flex space-x-6 mt-4 md:mt-0">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
