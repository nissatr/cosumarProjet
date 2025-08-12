import axios from 'axios';

// Configuration de base d'axios
const API_BASE_URL = 'http://localhost:8089/api/v1.0';

// Créer une instance axios avec la configuration de base
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Réactivé pour les cookies JWT
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
    (config) => {
        // Le token JWT est automatiquement inclus via les cookies
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Rediriger vers la page de login si non authentifié
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Service pour les demandes d'équipement
export const equipmentService = {
    // Créer une nouvelle demande d'équipement
    createRequest: async (requestData) => {
        try {
            const response = await api.post('/equipment/request', requestData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la création de la demande');
        }
    },

    // Récupérer toutes les demandes de l'utilisateur
    getUserRequests: async () => {
        try {
            const response = await api.get('/equipment/requests');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des demandes');
        }
    },

    // Récupérer les statistiques du dashboard
    getDashboardStats: async () => {
        try {
            const response = await api.get('/equipment/dashboard-stats');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des statistiques');
        }
    },

    // Récupérer une demande spécifique
    getRequestById: async (id) => {
        try {
            const response = await api.get(`/equipment/request/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la demande');
        }
    }
};

// Service pour l'authentification
export const authService = {
    // Vérifier si l'utilisateur est authentifié
    isAuthenticated: async () => {
        try {
            const response = await api.get('/is-authentificated');
            console.log("Réponse isAuthenticated:", response.data);
            // L'endpoint retourne un boolean directement
            return response.data === true;
        } catch (error) {
            console.error("Erreur isAuthenticated:", error);
            return false;
        }
    },

    // Récupérer les informations de l'utilisateur connecté
    getUserInfo: async () => {
        try {
            const response = await api.get('/user-info');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Erreur lors de la récupération des informations utilisateur');
        }
    },

    // Login
    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
        }
    },

    // Vérifier OTP de connexion
    verifyLoginOtp: async (email, otp) => {
        try {
            const response = await api.post('/verify-login-otp', { email, otp });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification OTP');
        }
    },

    // Créer un compte
    register: async (userData) => {
        try {
            console.log("Envoi de la requête register:", userData);
            const response = await api.post('/register', userData);
            console.log("Réponse register:", response.data);
            return response.data;
        } catch (error) {
            console.error("Erreur register détaillée:", error);
            console.error("Response data:", error.response?.data);
            console.error("Response status:", error.response?.status);
            throw new Error(error.response?.data?.message || 'Erreur lors de la création du compte');
        }
    },

    // Logout
    logout: async () => {
        try {
            const response = await api.post('/logout');
            // Supprimer le cookie côté client aussi
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // Supprimer le cookie même en cas d'erreur
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            throw error;
        }
    }
};

// Service pour l'administration
export const adminService = {
    // Récupérer tous les utilisateurs
    getAllUsers: async () => {
        try {
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Erreur lors de la récupération des utilisateurs');
        }
    },

    // Récupérer tous les rôles
    getAllRoles: async () => {
        try {
            const response = await api.get('/admin/roles');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Erreur lors de la récupération des rôles');
        }
    },

    // Mettre à jour le rôle d'un utilisateur
    updateUserRole: async (userId, newRole) => {
        try {
            console.log("🚀 Envoi de la requête updateUserRole:", { userId, newRole });
            const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
            console.log("✅ Réponse updateUserRole:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Erreur updateUserRole:", error);
            console.error("❌ Response data:", error.response?.data);
            console.error("❌ Response status:", error.response?.status);
            throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du rôle');
        }
    },

    // Créer un nouvel utilisateur
    createUser: async (userData) => {
        try {
            console.log("🚀 Envoi de la requête createUser:", userData);
            const response = await api.post('/admin/users', userData);
            console.log("✅ Réponse createUser:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Erreur createUser:", error);
            console.error("❌ Response data:", error.response?.data);
            console.error("❌ Response status:", error.response?.status);
            throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
        }
    },

    // Mettre à jour un utilisateur
    updateUser: async (userId, userData) => {
        try {
            console.log("🚀 Envoi de la requête updateUser:", { userId, userData });
            const response = await api.put(`/admin/users/${userId}`, userData);
            console.log("✅ Réponse updateUser:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Erreur updateUser:", error);
            console.error("❌ Response data:", error.response?.data);
            console.error("❌ Response status:", error.response?.status);
            throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
        }
    },

    // Supprimer un utilisateur
    deleteUser: async (userId) => {
        try {
            console.log("🚀 Envoi de la requête deleteUser:", userId);
            const response = await api.delete(`/admin/users/${userId}`);
            console.log("✅ Réponse deleteUser:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Erreur deleteUser:", error);
            console.error("❌ Response data:", error.response?.data);
            console.error("❌ Response status:", error.response?.status);
            throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
        }
    },

    // Récupérer toutes les demandes
    getAllDemandes: async () => {
        try {
            console.log("🚀 Envoi de la requête getAllDemandes");
            const response = await api.get('/admin/demandes');
            console.log("✅ Réponse getAllDemandes:", response.data);
            return response.data.demandes;
        } catch (error) {
            console.error("❌ Erreur getAllDemandes:", error);
            console.error("❌ Response data:", error.response?.data);
            console.error("❌ Response status:", error.response?.status);
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des demandes');
        }
    }
};

export default api;
