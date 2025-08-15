import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api.js";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const Sidebar = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [isSupportIT, setIsSupportIT] = useState(false);
    const [isSI, setIsSI] = useState(false);
    const [isAdministrateur, setIsAdministrateur] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const info = await authService.getUserInfo();
                setUserInfo(info);
                setIsSuperAdmin(info.role === 'SUPER_ADMIN');
                setIsManager(info.role === 'Manager N+1');
                setIsSupportIT(info.role === 'Support IT');
                setIsSI(info.role === 'SI');
                setIsAdministrateur(info.role === 'Administrateur');
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
        // Pour l'Administrateur, on affiche uniquement Validation
        ...(isAdministrateur ? [
            {
                id: "validation",
                title: "Validation",
                icon: "✅",
                description: "Validation finale des demandes approuvées par le SI",
                active: location.pathname === "/validation"
            }
        ] : []),

        // Pour les autres rôles (sauf Super Admin et Administrateur)
        ...(!isSuperAdmin && !isAdministrateur ? [
            {
                id: "dashboard",
                title: "Dashboard",
                icon: "📊",
                description: "Vue d'ensemble et statistiques",
                active: location.pathname === "/dashboard"
            },
            {
                id: "mes-demandes",
                title: "Mes Demandes",
                icon: "📄",
                description: "Consulter et gérer mes demandes",
                active: location.pathname === "/mes-demandes"
            },
            ...((isManager || isSupportIT || isSI) ? [{
                id: "validation",
                title: "Validation",
                icon: "✅",
                description: isSupportIT
                    ? "Traiter les demandes (tous services)"
                    : (isManager ? "Valider ou refuser les demandes de votre service"
                        : (isSI ? "Valider les demandes avec rapport du Support IT"
                            : "Validation des demandes")),
                active: location.pathname === "/validation"
            }] : [])
        ] : [])
    ];

    const handleLogout = async () => {
        try {
            const response = await authService.logout();
            if (response && response.success) {
                toast.success("Déconnexion réussie");
            } else {
                toast.info("Déconnexion effectuée");
            }
            window.location.href = "/login";
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            toast.info("Déconnexion effectuée");
            window.location.href = "/login";
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

            {/* Section Créer une nouvelle demande - Masquée pour l'Administrateur */}
            {!isSuperAdmin && !isAdministrateur && (
                <div className="p-3 border-bottom">
                    <div
                        className="d-flex align-items-center p-3 rounded-3 cursor-pointer text-primary hover-bg-light"
                        style={{
                            transition: "all 0.2s ease",
                            backgroundColor: "#EBF3FF",
                            border: "1px solid #4A90E2"
                        }}
                        onClick={() => navigate("/nouvelle-demande")}
                    >
                        <div className="me-3" style={{ fontSize: "1.2rem" }}>➕</div>
                        <div>
                            <div className="fw-medium">Créer une nouvelle demande</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
                {navigationItems.length > 0 && (
                    <div className="mb-4">
                        <h6 className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            {isAdministrateur ? "VALIDATION" : "NAVIGATION"}
                        </h6>
                        {navigationItems.map((item) => (
                            <div
                                key={item.id}
                                className={`d-flex align-items-center p-3 rounded-3 mb-2 cursor-pointer ${
                                    item.active ? 'bg-primary text-white' : 'text-muted hover-bg-light'
                                }`}
                                style={{ transition: "all 0.2s ease" }}
                                onClick={() => navigate(`/${item.id}`)}
                            >
                                <div className="me-3" style={{ fontSize: "1.2rem" }}>{item.icon}</div>
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
                )}

                {/* Administration - Masquée pour l'Administrateur */}
                {isSuperAdmin && (
                    <div className="mb-4">
                        <h6 className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            ADMINISTRATION
                        </h6>
                        <div
                            className="d-flex align-items-center p-3 rounded-3 mb-2 cursor-pointer text-danger hover-bg-light"
                            style={{ transition: "all 0.2s ease" }}
                            onClick={() => navigate("/admin")}
                        >
                            <div className="me-3" style={{ fontSize: "1.2rem" }}>👑</div>
                            <span className="fw-medium">Panel d'Administration</span>
                        </div>
                    </div>
                )}
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
                            <div className="fw-medium text-dark mb-1">{userInfo.prenom} {userInfo.nom}</div>
                            <div className="fs-7 text-muted mb-1">{userInfo.service || 'Service non défini'}</div>
                            <div className="fs-7 text-muted" style={{ wordBreak: "break-all", lineHeight: "1.2" }} title={userInfo.email}>
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
                    style={{ transition: "all 0.2s ease" }}
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