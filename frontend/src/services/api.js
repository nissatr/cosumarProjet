import axios from 'axios';

// URL de base
const API_BASE_URL = 'http://localhost:8089/api/v1.0';

// Instance axios
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur requête
api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Intercepteur réponse
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/* ================================
   SERVICE : ÉQUIPEMENT
================================ */
export const equipmentService = {
    createRequest: async (requestData) => {
        const response = await api.post('/equipment/request', requestData);
        return response.data;
    },
    getUserRequests: async () => {
        const response = await api.get('/equipment/requests');
        return response.data;
    },
    getDashboardStats: async () => {
        const response = await api.get('/equipment/dashboard-stats');
        return response.data;
    },
    getRequestById: async (id) => {
        const response = await api.get(`/equipment/request/${id}`);
        return response.data;
    }
};

/* ================================
   SERVICE : AUTHENTIFICATION
================================ */
export const authService = {
    isAuthenticated: async () => {
        try {
            const response = await api.get('/is-authentificated');
            return response.data === true;
        } catch {
            return false;
        }
    },
    getUserInfo: async () => {
        const response = await api.get('/user-info');
        return response.data;
    },
    login: async (credentials) => {
        const response = await api.post('/login', credentials);
        return response.data;
    },
    verifyLoginOtp: async (email, otp) => {
        const response = await api.post('/verify-login-otp', { email, otp });
        return response.data;
    },
    sendResetOtp: async (email) => {
        const response = await api.post(`/send-reset-otp?email=${encodeURIComponent(email)}`);
        return response.data;
    },
    resetPassword: async ({ email, otp, newPassword }) => {
        const response = await api.post('/reset-password', { email, otp, newPassword });
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/register', userData);
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/logout');
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return response.data;
    }
};

/* ================================
   SERVICE : ADMIN
================================ */
export const adminService = {
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },
    getAllRoles: async () => {
        const response = await api.get('/admin/roles');
        return response.data;
    },
    updateUserRole: async (userId, newRole) => {
        const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
        return response.data;
    },
    createUser: async (userData) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },
    updateUser: async (userId, userData) => {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
    },
    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },
    getAllDemandes: async () => {
        const response = await api.get('/admin/demandes');
        return response.data.demandes;
    }
};

/* ================================
   SERVICE : DEMANDES UTILISATEUR
================================ */
export const demandeService = {
    getMyDemandes: async () => {
        const response = await api.get("/mes-demandes", {
            params: { _t: Date.now() } // Cache-busting
        });
        return response.data.demandes || [];
    },
    annulerDemande: async (id) => {
        const response = await api.post(`/demandes/${id}/annuler`);
        return response.data;
    },
    supprimerDemande: async (id) => {
        const response = await api.delete(`/demandes/${id}`);
        return response.data;
    }
};

export default api;