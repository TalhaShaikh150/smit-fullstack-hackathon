import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/utils/constants";
import { setCredentials, logout } from "./authSlice";

// ── Base query with credentials (cookies) ──
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { endpoint }) => {
    // Don't set Content-Type for file uploads
    if (endpoint !== "updateAvatar") {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// ── Endpoints that should NOT trigger token refresh ──
const skipRefreshEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/me",
];

// ── Base query with automatic token refresh ──
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Get the URL being called
    const url = typeof args === "string" ? args : args?.url;

    // Don't try refresh for auth endpoints (avoids infinite loop)
    const shouldSkip = skipRefreshEndpoints.some((endpoint) =>
      url?.includes(endpoint),
    );

    if (!shouldSkip) {
      // Try refreshing the token
      const refreshResult = await baseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions,
      );

      if (refreshResult?.data?.success) {
        // Refresh succeeded → retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed → logout user
        api.dispatch(logout());
      }
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // ── Register ──
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data.user));
        } catch {
          // handled by component
        }
      },
    }),

    // ── Login ──
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data.user));
        } catch {
          // handled by component
        }
      },
    }),

    // ── Logout ──
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {
          dispatch(logout());
        }
      },
    }),

    // ── Get Current User (verify session) ──
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data.user));
        } catch {
          // not logged in — this is expected, do nothing
        }
      },
    }),

    // ── Get All Users ──
    getAllUsers: builder.query({
      query: (params = {}) => ({
        url: "/users",
        params,
      }),
      providesTags: ["User"],
    }),

    // ── Get User By ID ──
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),

    // ── Update Profile ──
    updateProfile: builder.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}/profile`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data.user));
        } catch {
          // handled by component
        }
      },
    }),

    // ── Update Avatar ──
    updateAvatar: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/users/${id}/avatar`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data.user));
        } catch {
          // handled by component
        }
      },
    }),

    // ── Remove Avatar ──
    removeAvatar: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/avatar`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data.user));
        } catch {
          // handled by component
        }
      },
    }),

    // ── Change Password ──
    changePassword: builder.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}/change-password`,
        method: "PATCH",
        body,
      }),
    }),

    // ── Update User Role ──
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    // ── Deactivate Account ──
    deactivateAccount: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/deactivate`,
        method: "PATCH",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {
          // handled by component
        }
      },
    }),

    // ── Delete User ──
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // ── Register Doctor (Admin Only) ──
    registerDoctor: builder.mutation({
      query: (body) => ({
        url: "/staff/register",
        method: "POST",
        body: { ...body, role: "doctor" },
      }),
      invalidatesTags: ["User"],
    }),

    // ── Register Receptionist (Admin Only) ──
    registerReceptionist: builder.mutation({
      query: (body) => ({
        url: "/staff/register",
        method: "POST",
        body: { ...body, role: "receptionist" },
      }),
      invalidatesTags: ["User"],
    }),

    // ── Get All Doctors ──
    getDoctors: builder.query({
      query: () => "/staff/doctors",
      providesTags: ["User"],
    }),

    // ── Get All Receptionists ──
    getReceptionists: builder.query({
      query: () => "/staff/receptionists",
      providesTags: ["User"],
    }),

    // ── Get System Analytics ──
    getSystemAnalytics: builder.query({
      query: () => "/staff/analytics/system",
      providesTags: ["User"],
    }),

    // ── Verify Staff ──
    verifyStaff: builder.mutation({
      query: (staffId) => ({
        url: `/staff/${staffId}/verify`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // ── Deactivate Staff ──
    deactivateStaff: builder.mutation({
      query: (staffId) => ({
        url: `/staff/${staffId}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // ── Update Doctor ──
    updateDoctor: builder.mutation({
      query: ({ id, body }) => ({
        url: `/staff/doctors/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // ── Update Receptionist ──
    updateReceptionist: builder.mutation({
      query: ({ id, body }) => ({
        url: `/staff/receptionists/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // ── Delete Doctor ──
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/staff/doctors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // ── Delete Receptionist ──
    deleteReceptionist: builder.mutation({
      query: (id) => ({
        url: `/staff/receptionists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // ── Get Appointments ──
    getAppointments: builder.query({
      query: (params) => ({
        url: "/appointments",
        params,
      }),
      providesTags: ["User"],
    }),

    // ── Get Doctor Appointments ──
    getDoctorAppointments: builder.query({
      query: (doctorId) => `/appointments/doctor/${doctorId}`,
      providesTags: ["User"],
    }),

    // ── Get Patient Appointments ──
    getPatientAppointments: builder.query({
      query: (patientId) => `/appointments/patient/${patientId}`,
      providesTags: ["User"],
    }),

    // ── Get Diagnoses ──
    getDiagnoses: builder.query({
      query: () => "/diagnoses",
      providesTags: ["User"],
    }),

    // ── Get Prescriptions ──
    getPrescriptions: builder.query({
      query: () => "/prescriptions",
      providesTags: ["User"],
    }),

    // ── Get Available Slots ──
    getAvailableSlots: builder.query({
      query: ({ doctorId, date }) => ({
        url: "/appointments/available-slots",
        params: { doctorId, date },
      }),
      providesTags: ["User"],
    }),

    // ── Create Appointment (Book) ──
    createAppointment: builder.mutation({
      query: (body) => ({
        url: "/appointments/book",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // ── Update Appointment ──
    updateAppointment: builder.mutation({
      query: ({ id, body }) => ({
        url: `/appointments/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // ── Cancel Appointment ──
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useRemoveAvatarMutation,
  useChangePasswordMutation,
  useUpdateUserRoleMutation,
  useDeactivateAccountMutation,
  useDeleteUserMutation,
  useRegisterDoctorMutation,
  useRegisterReceptionistMutation,
  useGetDoctorsQuery,
  useGetReceptionistsQuery,
  useGetSystemAnalyticsQuery,
  useVerifyStaffMutation,
  useDeactivateStaffMutation,
  useUpdateDoctorMutation,
  useUpdateReceptionistMutation,
  useDeleteDoctorMutation,
  useDeleteReceptionistMutation,
  useGetAppointmentsQuery,
  useGetDoctorAppointmentsQuery,
  useGetPatientAppointmentsQuery,
  useGetDiagnosesQuery,
  useGetPrescriptionsQuery,
  useGetAvailableSlotsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useCancelAppointmentMutation,
} = authApi;
