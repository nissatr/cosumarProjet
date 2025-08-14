import Sidebar from "../components/Sidebar.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import MetricsCards from "../components/MetricsCards.jsx";

const Dashboard = () => {
    const steps = [
        {
            num: 1,
            title: "Soumission",
            desc: "Demande initiale",
            icon: "📝"
        },
        {
            num: 2,
            title: "Validation N+1",
            desc: "Approbation hiérarchique",
            icon: "👔"
        },
        {
            num: 3,
            title: "Examen IT",
            desc: "Analyse technique",
            icon: "💻"
        },
        {
            num: 4,
            title: "Validation SI",
            desc: "Approbation système d'information",
            icon: "🔒"
        },
        {
            num: 5,
            title: "Administration",
            desc: "Traitement administratif",
            icon: "📋"
        }
    ];

    return (
        <div className="dashboard-container" style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="dashboard-main" style={{
                flex: 1,
                padding: '2rem',
                overflowY: 'auto',
                background: 'radial-gradient(at top right, #f9fafb 0%, #f3f4f6 100%)'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Dashboard Header */}
                    <DashboardHeader />

                    {/* Metrics Section */}
                    <section className="metrics-section" style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                    }}>
                        <MetricsCards />
                    </section>

                    {/* Processus de validation - Version complète */}
                    <section style={{
                        marginTop: '3rem',
                        padding: '3rem 1rem',
                        borderRadius: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div className="text-center">
                            <h2 style={{
                                color: '#4f46e5',
                                fontWeight: '700',
                                fontSize: '1.8rem',
                                marginBottom: '1rem'
                            }}>
                                Workflow de validation
                            </h2>
                            <p style={{
                                color: '#6b7280',
                                maxWidth: '700px',
                                margin: '0 auto 2.5rem',
                                lineHeight: '1.6'
                            }}>
                                Votre demande suit un processus structuré en 5 étapes clés
                            </p>

                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '1rem',
                                marginTop: '2rem',
                                position: 'relative'
                            }}>
                                {/* Ligne de connexion */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50px',
                                    left: '50px',
                                    right: '50px',
                                    height: '3px',
                                    backgroundColor: '#e5e7eb',
                                    zIndex: 0
                                }}></div>

                                {steps.map(({ num, title, desc, icon }, index) => (
                                    <div key={num} style={{
                                        flex: '1 1 120px',
                                        maxWidth: '140px',
                                        position: 'relative',
                                        zIndex: 1,
                                        marginBottom: '2rem'
                                    }}>
                                        {/* Carte d'étape */}
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            padding: '1.2rem 0.8rem',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 5px 15px rgba(123,97,255,0.1)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '1px solid rgba(0,0,0,0.03)',
                                            ':hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 15px 30px rgba(123,97,255,0.2)'
                                            }
                                        }}>
                                            <div style={{
                                                fontSize: '2rem',
                                                marginBottom: '0.8rem',
                                                color: '#4f46e5'
                                            }}>
                                                {icon}
                                            </div>
                                            <h4 style={{
                                                color: '#111827',
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                                marginBottom: '0.4rem',
                                                textAlign: 'center'
                                            }}>
                                                {title}
                                            </h4>
                                            <p style={{
                                                color: '#6b7280',
                                                fontSize: '0.75rem',
                                                textAlign: 'center',
                                                margin: 0
                                            }}>
                                                {desc}
                                            </p>
                                        </div>

                                        {/* Numéro d'étape */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '-15px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            backgroundColor: '#7b61ff',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '700',
                                            boxShadow: '0 4px 10px rgba(123,97,255,0.4)',
                                            fontSize: '0.8rem'
                                        }}>
                                            {num}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;