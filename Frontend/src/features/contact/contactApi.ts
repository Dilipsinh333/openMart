import { baseApi } from "../../services/baseApi";

// Contact form interface for public submissions
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category?: "general" | "support" | "complaint" | "suggestion" | "business";
  source?: "website" | "mobile_app" | "phone" | "email";
}

// Contact inquiry interface
export interface ContactInquiry {
  contactId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "general" | "support" | "complaint" | "suggestion" | "business";
  source: "website" | "mobile_app" | "phone" | "email";
  isRead: boolean;
  assignedTo?: string;
  response?: string;
  respondedAt?: string;
  respondedBy?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact filters interface
export interface ContactFilters {
  status?: "pending" | "in_progress" | "resolved" | "closed";
  priority?: "low" | "medium" | "high" | "urgent";
  category?: "general" | "support" | "complaint" | "suggestion" | "business";
  assignedTo?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Update contact status request
export interface UpdateContactStatusRequest {
  status: "pending" | "in_progress" | "resolved" | "closed";
  priority?: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  response?: string;
}

// Respond to contact request
export interface RespondToContactRequest {
  response: string;
  status?: "in_progress" | "resolved";
}

// Bulk operation request
export interface BulkContactRequest {
  contactIds: string[];
  action: "mark_read" | "change_status" | "assign" | "delete";
  data?: {
    status?: "pending" | "in_progress" | "resolved" | "closed";
    assignedTo?: string;
  };
}

// Pagination response
export interface ContactPagination {
  current: number;
  total: number;
  count: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Contact list response
export interface ContactListResponse {
  success: boolean;
  data: ContactInquiry[];
  pagination: ContactPagination;
}

// Single contact response
export interface ContactResponse {
  success: boolean;
  data: ContactInquiry;
}

// Contact statistics interface
export interface ContactStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  unread: number;
  byCategory: {
    general: number;
    support: number;
    complaint: number;
    suggestion: number;
    business: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

// Stats response
export interface ContactStatsResponse {
  success: boolean;
  data: ContactStats;
}

export const contactApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Contact"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // ================= PUBLIC ENDPOINTS =================

      // Submit contact form
      submitContactForm: builder.mutation<
        {
          success: boolean;
          message: string;
          data: { contactId: string; submittedAt: string };
        },
        ContactFormData
      >({
        query: (formData) => ({
          url: "/api/contact",
          method: "POST",
          body: formData,
        }),
        invalidatesTags: ["Contact"],
      }),

      // Get user's own inquiries by email
      getMyInquiries: builder.query<
        { success: boolean; data: Partial<ContactInquiry>[] },
        string
      >({
        query: (email) => ({
          url: `/api/contact/my-inquiries/${email}`,
          method: "GET",
        }),
        providesTags: (_result, _error, email) => [
          { type: "Contact", id: `my-${email}` },
        ],
      }),

      // ================= ADMIN ENDPOINTS =================

      // Get all contact inquiries (Admin)
      getContactInquiries: builder.query<ContactListResponse, ContactFilters>({
        query: (filters) => ({
          url: "/api/contact/admin",
          method: "GET",
          params: filters,
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.data.map(({ contactId }) => ({
                  type: "Contact" as const,
                  id: contactId,
                })),
                { type: "Contact", id: "LIST" },
              ]
            : [{ type: "Contact", id: "LIST" }],
      }),

      // Get single contact inquiry (Admin)
      getContactInquiry: builder.query<ContactResponse, string>({
        query: (contactId) => ({
          url: `/api/contact/admin/${contactId}`,
          method: "GET",
        }),
        providesTags: (_result, _error, contactId) => [
          { type: "Contact", id: contactId },
        ],
      }),

      // Get contact statistics (Admin)
      getContactStats: builder.query<ContactStatsResponse, void>({
        query: () => ({
          url: "/api/contact/admin/stats",
          method: "GET",
        }),
        providesTags: [{ type: "Contact", id: "STATS" }],
      }),

      // Update contact status (Admin)
      updateContactStatus: builder.mutation<
        ContactResponse,
        { contactId: string; data: UpdateContactStatusRequest }
      >({
        query: ({ contactId, data }) => ({
          url: `/api/contact/admin/${contactId}/status`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { contactId }) => [
          { type: "Contact", id: contactId },
          { type: "Contact", id: "LIST" },
          { type: "Contact", id: "STATS" },
        ],
      }),

      // Respond to contact inquiry (Admin)
      respondToContact: builder.mutation<
        ContactResponse,
        { contactId: string; data: RespondToContactRequest }
      >({
        query: ({ contactId, data }) => ({
          url: `/api/contact/admin/${contactId}/respond`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: (_result, _error, { contactId }) => [
          { type: "Contact", id: contactId },
          { type: "Contact", id: "LIST" },
          { type: "Contact", id: "STATS" },
        ],
      }),

      // Mark contact as read (Admin)
      markContactAsRead: builder.mutation<ContactResponse, string>({
        query: (contactId) => ({
          url: `/api/contact/admin/${contactId}/read`,
          method: "PATCH",
        }),
        invalidatesTags: (_result, _error, contactId) => [
          { type: "Contact", id: contactId },
          { type: "Contact", id: "LIST" },
          { type: "Contact", id: "STATS" },
        ],
      }),

      // Delete contact inquiry (Admin)
      deleteContactInquiry: builder.mutation<
        { success: boolean; message: string },
        string
      >({
        query: (contactId) => ({
          url: `/api/contact/admin/${contactId}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, contactId) => [
          { type: "Contact", id: contactId },
          { type: "Contact", id: "LIST" },
          { type: "Contact", id: "STATS" },
        ],
      }),

      // Bulk operations (Admin)
      bulkContactOperations: builder.mutation<
        { success: boolean; message: string; data: any },
        BulkContactRequest
      >({
        query: (data) => ({
          url: "/api/contact/admin/bulk",
          method: "POST",
          body: data,
        }),
        invalidatesTags: [
          { type: "Contact", id: "LIST" },
          { type: "Contact", id: "STATS" },
        ],
      }),
    }),
  });

export const {
  // Public hooks
  useSubmitContactFormMutation,
  useGetMyInquiriesQuery,

  // Admin hooks
  useGetContactInquiriesQuery,
  useGetContactInquiryQuery,
  useGetContactStatsQuery,
  useUpdateContactStatusMutation,
  useRespondToContactMutation,
  useMarkContactAsReadMutation,
  useDeleteContactInquiryMutation,
  useBulkContactOperationsMutation,
} = contactApi;
