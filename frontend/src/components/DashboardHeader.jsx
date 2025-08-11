import { useState, useEffect } from "react";
import { authService } from "../services/api.js";

const DashboardHeader = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const info = await authService.getUserInfo();
                setUserInfo(info);
            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `Aujourd'hui à ${hours}:${minutes}`;
    };

    return (
        <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
                <h1 className="fw-bold mb-2" style={{ fontSize: "2rem", color: "#1f2937" }}>
                    Dashboard
                </h1>
                <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
                    Bienvenue {loading ? "..." : userInfo ? userInfo.prenom : "utilisateur"}, voici un aperçu de vos demandes d'équipement
                </p>
            </div>
            <div className="text-end">
                <div className="text-muted fs-7">Dernière connexion</div>
                <div className="fw-medium" style={{ color: "#6b7280" }}>
                    {getCurrentTime()}
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
