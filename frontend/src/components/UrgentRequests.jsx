const UrgentRequests = () => {
    return (
        <div className="mb-4">
            {/* Section urgente */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                        <div 
                            className="me-3"
                            style={{ 
                                fontSize: "1.2rem",
                                color: "#EF4444"
                            }}
                        >
                            🔴
                        </div>
                        <div>
                            <div className="fw-medium">Urgentes</div>
                        </div>
                    </div>
                    <div 
                        className="badge rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "#EF4444",
                            color: "white",
                            fontSize: "0.9rem",
                            fontWeight: "bold"
                        }}
                    >
                        2
                    </div>
                </div>
                <div className="fs-7 text-muted">2 demandes marquées comme urgentes</div>
            </div>

            {/* Banner d'alerte */}
            <div 
                className="d-flex align-items-center p-3 rounded-3"
                style={{ 
                    backgroundColor: "#FEF3C7", 
                    border: "1px solid #F59E0B",
                    borderRadius: "12px"
                }}
            >
                <div 
                    className="me-3"
                    style={{ 
                        fontSize: "1.5rem",
                        color: "#F59E0B"
                    }}
                >
                    ⚠️
                </div>
                <div className="fw-medium" style={{ color: "#92400E" }}>
                    Nécessitent une attention particulière
                </div>
            </div>
        </div>
    );
};

export default UrgentRequests;
