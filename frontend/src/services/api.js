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

    // Demandes du service du manager connecté (N+1)
    getMesDemandesService: async () => {
        const response = await api.get(`/demandes/mes-demandes-service`, {
            params: { _t: Date.now() }
        });
        // Le backend renvoie { success, demandes } → on normalise
        return response.data?.demandes || [];
    },

    // Demandes pour Support IT (tous services validés par N+1 et pas encore traités par Support IT)
    getDemandesSupportIT: async () => {
        const response = await api.get(`/demandes/support-it`, {
            params: { _t: Date.now() }
        });
        return response.data?.demandes || [];
    },

    // Demandes pour SI (tous services avec rapport IT, validées par N+1 et Support IT, non encore validées par SI)
    getDemandesSI: async () => {
        const response = await api.get(`/demandes/si`, {
            params: { _t: Date.now() }
        });
        return response.data?.demandes || [];
    },

    // Demandes pour Administrateur (toutes les demandes approuvées par SI, en attente de validation finale)
    getDemandesPourAdministrateur: async () => {
        const response = await api.get(`/demandes/administrateur`, {
            params: { _t: Date.now() }
        });
        return response.data?.demandes || [];
    },

    getDemandesByService: async (service) => {
        const response = await api.get(`/demandes/service/${encodeURIComponent(service)}`, {
            params: { _t: Date.now() }
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
    },

    approveDemande: async (id) => {
        const response = await api.put(`/demandes/${id}/approve`);
        return response.data;
    },

    rejectDemande: async (id) => {
        const response = await api.put(`/demandes/${id}/reject`);
        return response.data;
    },

    // Validation SI
    approveDemandeSI: async (id) => {
        const response = await api.put(`/demandes/${id}/si/approve`);
        return response.data;
    },
    rejectDemandeSI: async (id) => {
        const response = await api.put(`/demandes/${id}/si/reject`);
        return response.data;
    },

    // Validation Administrateur
    approveDemandeAdministrateur: async (id) => {
        const response = await api.put(`/demandes/${id}/administrateur/approve`);
        return response.data;
    },
    rejectDemandeAdministrateur: async (id) => {
        const response = await api.put(`/demandes/${id}/administrateur/reject`);
        return response.data;
    },

    // Soumettre rapport IT
    submitRapportIT: async (id, { fichier, commentaire }) => {
        const formData = new FormData();
        if (fichier) formData.append('fichier', fichier);
        if (commentaire) formData.append('commentaire', commentaire);
        const response = await api.post(`/demandes/${id}/rapport-it`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Récupérer le rapport IT d'une demande
    getRapportIT: async (demandeId) => {
        const response = await api.get(`/demandes/${demandeId}/rapport-it`);
        return response.data;
    },

    // Debug Support IT
    debugSupportIT: async () => {
        const response = await api.get('/demandes/debug-support-it');
        return response.data;
    },
    
    // Récupérer les validations d'une demande spécifique
    getValidationsForDemande: async (demandeId) => {
        const response = await api.get(`/demandes/${demandeId}/validations`);
        return response.data?.validations || [];
    }
};

export default api;