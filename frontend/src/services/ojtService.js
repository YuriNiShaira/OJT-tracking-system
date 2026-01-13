import api from "../utils/api";

export const ojtService = {
    // Get all OJT listings
    getAllListings: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/listings/${params ? `?${params}` : ""}`);
        return response.data;
    },

    // Get single listing
    getListing: async (id) => {
        const response = await api.get(`/listings/${id}/`);
        return response.data;
    },

    // Create listing (Company only)
    createListing: async (listingData) => {
        const response = await api.post(`/listings/`, listingData);
        return response.data;
    },

    // Update listing (Company only)
    updateListing: async (id, listingData) => {
        const response = await api.patch(`/listings/${id}/`, listingData);
        return response.data;
    },

    // Delete listing (Company only)
    deleteListing: async (id) => {
        const response = await api.delete(`/listings/${id}/`);
        return response.data;
    },

    // Apply for OJT (Student only)
    applyForOJT: async (listingId, applicationData = {}) => {
        const response = await api.post(`/applications/`, {
            listing: listingId,
            ...applicationData,
        });
        return response.data;
    },

    // Get user's applications
    getMyApplications: async () => {
        const response = await api.get(`/applications/`);
        return response.data;
    },

    // Get company's listings
    getMyListings: async () => {
        const response = await api.get(`/listings/`);
        return response.data;
    },

    // Update application status (Company only)
    updateApplicationStatus: async (applicationId, statusData) => {
        const response = await api.patch(
            `/applications/${applicationId}/`,
            statusData
        );
        return response.data;
    },

    // Dashboard stats
    getCompanyStats: async () => {
        const response = await api.get(`/dashboard/company-stats/`);
        return response.data;
    },

    getStudentStats: async () => {
        const response = await api.get(`/dashboard/student-stats/`);
        return response.data;
    },
};
