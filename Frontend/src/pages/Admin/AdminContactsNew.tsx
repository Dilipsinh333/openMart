import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
} from "lucide-react";
// import { toast } from 'react-hot-toast'; // Uncomment if you have toast notifications installed
import {
  useGetContactInquiriesQuery,
  useDeleteContactInquiryMutation,
  useMarkContactAsReadMutation,
} from "../../features/contact/contactApi";
import type {
  ContactInquiry,
  ContactFilters,
} from "../../features/contact/contactApi";

const AdminContacts: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ContactFilters>({
    page: 1,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const { data, isLoading, error, refetch } =
    useGetContactInquiriesQuery(filters);
  const [deleteContact] = useDeleteContactInquiryMutation();
  const [markAsRead] = useMarkContactAsReadMutation();

  const handleView = (contactId: string) => {
    navigate(`/admin/contacts/${contactId}`);
  };

  const handleDelete = async (contactId: string) => {
    if (
      window.confirm("Are you sure you want to delete this contact inquiry?")
    ) {
      try {
        await deleteContact(contactId).unwrap();
        // toast.success('Contact inquiry deleted successfully');
        console.log("Contact inquiry deleted successfully");
        refetch();
      } catch (error) {
        // toast.error('Failed to delete contact inquiry');
        console.error("Failed to delete contact inquiry");
      }
    }
  };

  const handleMarkAsRead = async (contactId: string) => {
    try {
      await markAsRead(contactId).unwrap();
      // toast.success('Contact marked as read');
      console.log("Contact marked as read");
      refetch();
    } catch (error) {
      // toast.error('Failed to mark contact as read');
      console.error("Failed to mark contact as read");
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchQuery, page: 1 });
  };

  const handleFilterChange = (key: keyof ContactFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === data?.data.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(
        data?.data.map((contact: ContactInquiry) => contact.contactId) || []
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };
    return (
      colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading contacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading contacts</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Contact Inquiries
        </h1>
        <p className="text-gray-600">
          Manage customer contact inquiries and support requests
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, email, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filters.status || ""}
              onChange={(e) =>
                handleFilterChange("status", e.target.value || undefined)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filters.priority || ""}
              onChange={(e) =>
                handleFilterChange("priority", e.target.value || undefined)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={filters.category || ""}
              onChange={(e) =>
                handleFilterChange("category", e.target.value || undefined)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="support">Support</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
              <option value="business">Business</option>
            </select>

            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedContacts.length} contact(s) selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                Mark as Read
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedContacts.length === data?.data.length &&
                      data?.data.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data.map((contact: ContactInquiry) => (
                <tr key={contact.contactId} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.contactId)}
                      onChange={() => handleSelectContact(contact.contactId)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {!contact.isRead && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {contact.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        contact.status
                      )}`}
                    >
                      {contact.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                        contact.priority
                      )}`}
                    >
                      {contact.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                    {contact.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(contact.contactId)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {!contact.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(contact.contactId)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Mark as Read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(contact.contactId)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  disabled={!data.pagination.hasPrev}
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page! - 1 })
                  }
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={!data.pagination.hasNext}
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page! + 1 })
                  }
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(filters.page! - 1) * filters.limit! + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        filters.page! * filters.limit!,
                        data.pagination.totalItems
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {data.pagination.totalItems}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      disabled={!data.pagination.hasPrev}
                      onClick={() =>
                        setFilters({ ...filters, page: filters.page! - 1 })
                      }
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {data.pagination.current} of {data.pagination.total}
                    </span>
                    <button
                      disabled={!data.pagination.hasNext}
                      onClick={() =>
                        setFilters({ ...filters, page: filters.page! + 1 })
                      }
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {data?.data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            No contact inquiries found
          </div>
          <div className="text-gray-400">
            Try adjusting your search criteria
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
