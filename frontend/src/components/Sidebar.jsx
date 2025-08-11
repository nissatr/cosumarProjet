import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api.js";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const Sidebar = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const info = await authService.getUserInfo();
                setUserInfo(info);
            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur:", error);
                toast.error("Erreur lors du chargement des informations utilisateur");
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const navigationItems = [
        {
            id: "dashboard",
            title: "Dashboard",
            icon: "📊",
            description: "Vue d'ensemble et statistiques",
            active: true
        },
        {
            id: "mes-demandes",
            title: "Mes Demandes",
            icon: "📄",
            description: "Consulter et gérer mes demandes"
        },
        {
            id: "notifications",
            title: "Notifications",
            icon: "🔔",
            description: "Alertes et changements de statut",
            badge: 3
        }
    ];

    const toolsItems = [
        {
            id: "parametres",
            title: "Paramètres",
            icon: "⚙️"
        }
    ];

    const handleLogout = async () => {
        try {
            await authService.logout();
            toast.success("Déconnexion réussie");
            navigate("/login");
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            // Rediriger quand même vers la page de login
            navigate("/login");
        }
    };

    return (
        <div className="sidebar bg-white d-flex flex-column" style={{ width: "280px", borderRight: "1px solid #e5e7eb", height: "100vh" }}>
            {/* Header */}
            <div className="p-4" style={{ backgroundColor: "#4A90E2", color: "white" }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <img src={assets.logo} alt="logo" width={24} height={24} />
                    <span className="fw-bold fs-6">Équipement IT</span>
                </div>
                <div className="fs-7 opacity-75">Système de demandes</div>
            </div>

            {/* Section Créer une nouvelle demande */}
            <div className="p-3 border-bottom">
                <div
                    className="d-flex align-items-center p-3 rounded-3 cursor-pointer text-primary hover-bg-light"
                    style={{
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        backgroundColor: "#EBF3FF",
                        border: "1px solid #4A90E2"
                    }}
                    onClick={() => navigate("/nouvelle-demande")}
                >
                    <div className="me-3" style={{ fontSize: "1.2rem" }}>
                        ➕
                    </div>
                    <div>
                        <div className="fw-medium">Créer une nouvelle demande</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
                <div className="mb-4">
                    <h6 className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                        NAVIGATION
                    </h6>
                    {navigationItems.map((item) => (
                        <div
                            key={item.id}
                            className={`d-flex align-items-center p-3 rounded-3 mb-2 cursor-pointer ${
                                item.active ? 'bg-primary text-white' : 'text-muted hover-bg-light'
                            }`}
                            style={{
                                transition: "all 0.2s ease",
                                cursor: "pointer"
                            }}
                            onClick={() => navigate(`/${item.id}`)}
                        >
                            <div className="me-3" style={{ fontSize: "1.2rem" }}>
                                {item.icon}
                            </div>
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="fw-medium">{item.title}</span>
                                    {item.badge && (
                                        <span className="badge bg-danger rounded-circle" style={{ fontSize: "0.7rem" }}>
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <div className="fs-7 opacity-75 mt-1">{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tools */}
                <div className="mb-4">
                    <h6 className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                        OUTILS
                    </h6>
                    {toolsItems.map((item) => (
                        <div
                            key={item.id}
                            className="d-flex align-items-center p-3 rounded-3 mb-2 cursor-pointer text-muted hover-bg-light"
                            style={{
                                transition: "all 0.2s ease",
                                cursor: "pointer"
                            }}
                            onClick={() => navigate(`/${item.id}`)}
                        >
                            <div className="me-3" style={{ fontSize: "1.2rem" }}>
                                {item.icon}
                            </div>
                            <span className="fw-medium">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Profile */}
            <div className="p-3 border-top">
                {loading ? (
                    <div className="d-flex align-items-center p-3 rounded-3 bg-light">
                        <div className="spinner-border spinner-border-sm me-3" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                        <span className="text-muted">Chargement des informations...</span>
                    </div>
                ) : userInfo ? (
                    <div className="d-flex align-items-start p-3 rounded-3 bg-light">
                        <div className="me-3 flex-shrink-0">
                            <div 
                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                            >
                                <span className="text-white fw-bold">
                                    {userInfo.prenom ? userInfo.prenom.charAt(0).toUpperCase() : 
                                     userInfo.nom ? userInfo.nom.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                        </div>
                        <div className="flex-grow-1 min-w-0">
                            <div className="fw-medium text-dark mb-1">
                                {userInfo.prenom} {userInfo.nom}
                            </div>
                            <div className="fs-7 text-muted mb-1">{userInfo.service || 'Service non défini'}</div>
                            <div 
                                className="fs-7 text-muted"
                                style={{ 
                                    wordBreak: "break-all",
                                    lineHeight: "1.2"
                                }}
                                title={userInfo.email}
                            >
                                {userInfo.email}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex align-items-center p-3 rounded-3 bg-light">
                        <span className="text-muted">Erreur de chargement</span>
                    </div>
                )}
                <div 
                    className="d-flex align-items-center p-2 mt-2 rounded-3 cursor-pointer text-muted hover-bg-light"
                    style={{
                        transition: "all 0.2s ease",
                        cursor: "pointer"
                    }}
                    onClick={handleLogout}
                >
                    <span className="me-2">↪</span>
                    <span className="fw-medium">Déconnexion</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
