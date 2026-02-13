import api from "../utils/api";

export const notificationService = {
    
    getNotification: async () => {
        const response = await api.get('/notifications/')
        return response.data
    },

    markAsRead: async (notificationId) => {
        const response = await api.post(`/notifications/${notificationId}/read/`)
        return response.data
    },

    markAllAsRead: async () => {
        const response = await api.post('notifications/read-all/')
        return response.data
    },

    getStats: async () => {
        const response = await api.get('notifications/stats/')
        return response.data
    }
}