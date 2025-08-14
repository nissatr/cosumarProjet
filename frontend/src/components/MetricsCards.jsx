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
            icon: "📊",
            color: "#6366f1",
            trend: "up"
        },
        {
            title: "En cours",
            value: stats.enCours,
            icon: "⏳",
            color: "#f59e0b",
            trend: "neutral"
        },
        {
            title: "Acceptées",
            value: stats.acceptees,
            icon: "✅",
            color: "#10b981",
            trend: "up"
        },
        {
            title: "Refusées",
            value: stats.refusees,
            icon: "❌",
            color: "#ef4444",
            trend: "down"
        }
    ];

    if (loading) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem'
            }}>
                {metrics.map((_, index) => (
                    <div key={index} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '10px',
                                background: '#f3f4f6'
                            }}></div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    height: '16px',
                                    width: '80px',
                                    background: '#f3f4f6',
                                    borderRadius: '4px',
                                    marginBottom: '8px'
                                }}></div>
                                <div style={{
                                    height: '24px',
                                    width: '60px',
                                    background: '#f3f4f6',
                                    borderRadius: '4px'
                                }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
        }}>
            {metrics.map((metric, index) => (
                <div key={index} style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.3s ease',
                    borderTop: `4px solid ${metric.color}`,
                    ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)'
                    }
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            background: `${metric.color}10`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            color: metric.color
                        }}>
                            {metric.icon}
                        </div>
                        <div>
                            <p style={{
                                color: '#6b7280',
                                fontSize: '0.875rem',
                                marginBottom: '0.25rem'
                            }}>
                                {metric.title}
                            </p>
                            <h3 style={{
                                color: '#111827',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                margin: 0
                            }}>
                                {metric.value}
                            </h3>
                        </div>
                    </div>
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        color: metric.trend === 'up' ? '#10b981' :
                            metric.trend === 'down' ? '#ef4444' : '#f59e0b',
                        fontSize: '0.875rem'
                    }}>
                        {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                        <span style={{ marginLeft: '4px' }}>
                            {metric.trend === 'up' ? 'Augmentation' :
                                metric.trend === 'down' ? 'Diminution' : 'Stable'}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MetricsCards;