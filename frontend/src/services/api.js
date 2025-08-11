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
            await api.post('/logout');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }
};

export default api;
