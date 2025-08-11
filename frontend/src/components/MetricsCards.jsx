import { useState, useEffect } from "react";
import { equipmentService } from "../services/api.js";

const MetricsCards = () => {
    const [stats, setStats] = useState({
        totalDemandes: 0,
        enCours: 0,
        acceptees: 0,
        refusees: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await equipmentService.getDashboardStats();
                if (response.success && response.stats) {
                    setStats({
                        totalDemandes: response.stats.totalDemandes || 0,
                        enCours: response.stats.enCours || 0,
                        acceptees: response.stats.acceptees || 0,
                        refusees: response.stats.refusees || 0
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des statistiques:", error);
                // Utiliser les données par défaut en cas d'erreur
                setStats({
                    totalDemandes: 12,
                    enCours: 4,
                    acceptees: 6,
                    refusees: 2
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const metrics = [
        {
            title: "Total demandes",
            value: stats.totalDemandes,
            icon: "📄",
            color: "#4A90E2",
            bgColor: "#EBF3FF"
        },
        {
            title: "En cours",
            value: stats.enCours,
            icon: "⏰",
            color: "#F59E0B",
            bgColor: "#FEF3C7"
        },
        {
            title: "Acceptées",
            value: stats.acceptees,
            icon: "✅",
            color: "#10B981",
            bgColor: "#D1FAE5"
        },
        {
            title: "Refusées",
            value: stats.refusees,
            icon: "❌",
            color: "#EF4444",
            bgColor: "#FEE2E2"
        }
    ];

    if (loading) {
        return (
            <div className="row g-4 mb-4">
                {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="col-md-3 col-sm-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <div className="placeholder-glow">
                                            <div className="placeholder rounded-circle mb-3" style={{ width: "48px", height: "48px" }}></div>
                                            <div className="placeholder col-6 mb-1"></div>
                                            <div className="placeholder col-8"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="row g-4 mb-4">
            {metrics.map((metric, index) => (
                <div key={index} className="col-md-3 col-sm-6">
                    <div 
                        className="card border-0 shadow-sm h-100"
                        style={{
                            borderRadius: "12px",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                        }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            backgroundColor: metric.bgColor
                                        }}
                                    >
                                        <span style={{ fontSize: "1.5rem" }}>{metric.icon}</span>
                                    </div>
                                    <h3 
                                        className="fw-bold mb-1"
                                        style={{ color: metric.color, fontSize: "2rem" }}
                                    >
                                        {metric.value}
                                    </h3>
                                    <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                                        {metric.title}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MetricsCards;
