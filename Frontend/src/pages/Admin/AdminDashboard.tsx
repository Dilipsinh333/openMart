import React from "react";
import {
  Package,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalProducts: 156,
    pendingProducts: 12,
    totalOrders: 89,
    pendingOrders: 5,
    totalInquiries: 23,
    unreadInquiries: 3,
    totalUsers: 245,
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    changeType,
    link,
  }: {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    change?: string;
    changeType?: "increase" | "decrease";
    link?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}
            >
              {changeType === "increase" ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      {link && (
        <Link
          to={link}
          className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Link>
      )}
    </div>
  );

  const recentActivities = [
    {
      id: 1,
      type: "product",
      message: "New product 'Red Bicycle' submitted for approval",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      type: "order",
      message: "Order #ORD-001 completed successfully",
      time: "4 hours ago",
      status: "completed",
    },
    {
      id: 3,
      type: "inquiry",
      message: "New contact inquiry from John Doe",
      time: "6 hours ago",
      status: "new",
    },
    {
      id: 4,
      type: "product",
      message: "Product 'Blue Tricycle' approved and listed",
      time: "8 hours ago",
      status: "approved",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          change="+12 this month"
          changeType="increase"
          link="/admin/products"
        />
        <StatCard
          title="Pending Products"
          value={stats.pendingProducts}
          icon={Package}
          change="3 need review"
          changeType="decrease"
          link="/admin/products?status=pending"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          change="+8 this week"
          changeType="increase"
          link="/admin/orders"
        />
        <StatCard
          title="Contact Inquiries"
          value={stats.totalInquiries}
          icon={MessageSquare}
          change={`${stats.unreadInquiries} unread`}
          changeType="increase"
          link="/admin/contacts"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activities
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${
                        activity.status === "pending"
                          ? "bg-yellow-400"
                          : activity.status === "completed"
                          ? "bg-green-400"
                          : activity.status === "new"
                          ? "bg-blue-400"
                          : "bg-gray-400"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : activity.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : activity.status === "new"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/admin/products?status=pending"
                className="block w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg transition-colors"
              >
                Review Pending Products ({stats.pendingProducts})
              </Link>
              <Link
                to="/admin/orders?status=pending"
                className="block w-full bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-lg transition-colors"
              >
                Process Orders ({stats.pendingOrders})
              </Link>
              <Link
                to="/admin/contacts?status=unread"
                className="block w-full bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg transition-colors"
              >
                Respond to Inquiries ({stats.unreadInquiries})
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              System Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
