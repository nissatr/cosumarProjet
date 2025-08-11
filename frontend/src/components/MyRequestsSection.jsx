const MyRequestsSection = () => {
    return (
        <div className="bg-white rounded-3 shadow-sm p-4">
            {/* Header de la section */}
            <div 
                className="d-flex align-items-center gap-2 mb-3 p-3 rounded-3"
                style={{ backgroundColor: "#4A90E2", color: "white" }}
            >
                <span className="fw-bold fs-6">Équipement IT</span>
                <span className="opacity-75">•</span>
                <span className="fs-7 opacity-75">Système de demandes</span>
            </div>

            {/* Titre et barre d'outils */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: "#1f2937" }}>
                    Mes Demandes
                </h2>
                
                <div className="d-flex align-items-center gap-2">
                    {/* Barre d'outils */}
                    <div className="d-flex align-items-center gap-1 me-3">
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Éditer">
                            ✏️
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Hash">
                            #
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Options">
                            ⬇️
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Texte">
                            T
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Cercle">
                            🔴
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Ajouter">
                            ➕
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Grille">
                            ⊞
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Forme">
                            〰️
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Liste">
                            ⊟
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Code">
                            &lt;/&gt;
                        </button>
                    </div>

                    {/* Filtres et recherche */}
                    <div className="d-flex align-items-center gap-2 me-3">
                        <span className="text-muted fs-7">Filtres et recherche</span>
                        <button className="btn btn-sm btn-outline-secondary rounded-2" title="Filtres">
                            🔍
                        </button>
                    </div>

                    {/* Bouton nouvelle demande */}
                    <button 
                        className="btn btn-primary rounded-3 px-4 py-2 fw-medium"
                        style={{
                            backgroundColor: "#4A90E2",
                            border: "none",
                            boxShadow: "0 2px 4px rgba(74, 144, 226, 0.2)"
                        }}
                    >
                        ➕ Nouvelle Demande
                    </button>
                </div>
            </div>

            {/* Contenu de la section (placeholder) */}
            <div className="text-center py-5">
                <div className="text-muted mb-3">
                    <span style={{ fontSize: "3rem" }}>📄</span>
                </div>
                <h5 className="text-muted">Aucune demande trouvée</h5>
                <p className="text-muted fs-7">
                    Commencez par créer votre première demande d'équipement
                </p>
            </div>
        </div>
    );
};

export default MyRequestsSection;
