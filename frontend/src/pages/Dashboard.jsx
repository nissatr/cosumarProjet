import Sidebar from "../components/Sidebar.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import MetricsCards from "../components/MetricsCards.jsx";
import UrgentRequests from "../components/UrgentRequests.jsx";

const Dashboard = () => {
    return (
        <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
            {/* Sidebar */}
            <Sidebar />
            
            {/* Contenu principal */}
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
                <div className="container-fluid">
                    {/* Header du dashboard */}
                    <DashboardHeader />
                    
                    {/* Cartes de métriques */}
                    <MetricsCards />
                    
                    {/* Section demandes urgentes */}
                    <div className="row">
                        <div className="col-lg-4">
                            <UrgentRequests />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
