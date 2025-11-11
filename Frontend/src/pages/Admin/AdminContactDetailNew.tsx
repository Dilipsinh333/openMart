import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  Trash2,
  MessageCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
} from "lucide-react";
// import { toast } from 'react-hot-toast'; // Uncomment if you have toast notifications installed
import {
  useGetContactInquiryQuery,
  useUpdateContactStatusMutation,
  useDeleteContactInquiryMutation,
} from "../../features/contact/contactApi";
import type { UpdateContactStatusRequest } from "../../features/contact/contactApi";

const AdminContactDetailNew: React.FC = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    data: contactResponse,
    isLoading,
    refetch,
  } = useGetContactInquiryQuery(contactId!);
  const [updateContact] = useUpdateContactStatusMutation();
  const [deleteContact] = useDeleteContactInquiryMutation();

  const contact = contactResponse?.data;

  const [form, setForm] = useState<UpdateContactStatusRequest>({
    status: "pending",
    priority: "medium",
    assignedTo: "",
    response: "",
  });

  useEffect(() => {
    if (contact) {
      setForm({
        status: contact.status,
        priority: contact.priority,
        assignedTo: contact.assignedTo || "",
        response: contact.response || "",
      });
    }
  }, [contact]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!contactId) return;

    try {
      await updateContact({
        contactId,
        data: form,
      }).unwrap();

      // toast.success('Contact updated successfully');
      console.log("Contact updated successfully");
      setIsEditMode(false);
      refetch();
    } catch (error) {
      // toast.error('Failed to update contact');
      console.error("Failed to update contact");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async () => {
    if (!contactId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this contact inquiry? This action cannot be undone."
    );

    if (confirmed) {
      try {
        await deleteContact(contactId).unwrap();
        // toast.success('Contact inquiry deleted successfully');
        console.log("Contact inquiry deleted successfully");
        navigate("/admin/contacts");
      } catch (error) {
        // toast.error('Failed to delete contact inquiry');
        console.error("Failed to delete contact inquiry");
        console.error("Delete error:", error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏳",
      },
      in_progress: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "🔄",
      },
      resolved: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✅",
      },
      closed: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "🔒",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      low: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "🟢",
      },
      medium: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "🟡",
      },
      high: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: "🟠",
      },
      urgent: { color: "bg-red-100 text-red-800 border-red-200", icon: "🔴" },
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading contact details...</div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Contact not found</div>
      </div>
    );
  }

  const statusConfig = getStatusBadge(contact.status);
  const priorityConfig = getPriorityBadge(contact.priority);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/admin/contacts")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </button>

          <div className="flex items-center space-x-2">
            {!isEditMode ? (
              <>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    // Reset form to original values
                    if (contact) {
                      setForm({
                        status: contact.status,
                        priority: contact.priority,
                        assignedTo: contact.assignedTo || "",
                        response: contact.response || "",
                      });
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Contact Inquiry
            </h1>
            <p className="text-gray-600">ID: {contact.contactId}</p>
          </div>

          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${statusConfig.color}`}
            >
              <span className="mr-1">{statusConfig.icon}</span>
              {contact.status.replace("_", " ")}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${priorityConfig.color}`}
            >
              <span className="mr-1">{priorityConfig.icon}</span>
              {contact.priority}
            </span>
            {!contact.isRead && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Unread
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-500" />
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900 font-medium">{contact.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-900 capitalize">
                    {contact.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject & Message */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-gray-500" />
              Subject & Message
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <p className="text-gray-900 font-medium text-lg">
                  {contact.subject}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {contact.message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Response */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Admin Response
            </h2>

            {isEditMode ? (
              <textarea
                name="response"
                value={form.response}
                onChange={handleInputChange}
                rows={6}
                placeholder="Type your response to the customer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border min-h-[100px]">
                {contact.response ? (
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {contact.response}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    No response provided yet
                  </p>
                )}
              </div>
            )}

            {contact.respondedAt && contact.respondedBy && (
              <div className="mt-3 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Responded on {new Date(contact.respondedAt).toLocaleString()}
                  {contact.respondedBy && ` by ${contact.respondedBy}`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Status & Priority
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                {isEditMode ? (
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${statusConfig.color}`}
                  >
                    <span className="mr-1">{statusConfig.icon}</span>
                    {contact.status.replace("_", " ")}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                {isEditMode ? (
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${priorityConfig.color}`}
                  >
                    <span className="mr-1">{priorityConfig.icon}</span>
                    {contact.priority}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleInputChange}
                    placeholder="Enter assignee name/ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {contact.assignedTo || "Unassigned"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Source:</span>
                <span className="text-gray-900 capitalize">
                  {contact.source}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Read Status:</span>
                <span
                  className={`font-medium ${
                    contact.isRead ? "text-green-600" : "text-blue-600"
                  }`}
                >
                  {contact.isRead ? "Read" : "Unread"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-900">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Updated:</span>
                <span className="text-gray-900">
                  {new Date(contact.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {contact.userAgent && (
                <div className="pt-2 border-t">
                  <span className="text-gray-500 text-xs">User Agent:</span>
                  <p className="text-gray-700 text-xs mt-1 break-all">
                    {contact.userAgent}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactDetailNew;
