import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { demandeService, authService } from "../services/api.js";
import Sidebar from "../components/Sidebar.jsx";

const Validation = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("");
    const [urgenceFilter, setUrgenceFilter] = useState("");
    const [serviceFilter, setServiceFilter] = useState("");
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [previousDemandes, setPreviousDemandes] = useState([]);
    const [isSupportIT, setIsSupportIT] = useState(false);
    const [isManagerN1, setIsManagerN1] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [rapportFile, setRapportFile] = useState(null);
    const [rapportComment, setRapportComment] = useState("");
    const [n1Decision, setN1Decision] = useState({}); // id_demande -> 'ACCEPTEE' | 'REFUSEE'

    // Récupérer les demandes du service de l'utilisateur connecté
    const fetchDemandes = async () => {
        setLoading(true);
        setIsRefreshing(true);
        try {
            console.log("🔍 fetchDemandes - Rôle détecté:", { isSupportIT, isManagerN1 });
            
            let data;
            if (isSupportIT) {
                console.log("🔄 Récupération des demandes pour Support IT...");
                data = await demandeService.getMesDemandesService();
                console.log("📊 Données Support IT reçues:", data);
            } else {
                console.log("🔄 Récupération des demandes du service...");
                data = await demandeService.getMesDemandesService();
                console.log("📊 Données service reçues:", data);
            }
            
            // Gérer la nouvelle structure de données avec validation
            let newDemandes;
            if (Array.isArray(data)) {
                // Ancien format (pour Support IT)
                newDemandes = data;
            } else if (data && Array.isArray(data.demandes)) {
                // Nouveau format (pour Manager N+1) - données déjà structurées
                newDemandes = data.demandes;
                console.log("🔍 Demandes reçues:", newDemandes);
                
                // Debug: afficher les détails de chaque demande
                newDemandes.forEach((d, index) => {
                    console.log(`🔍 Demande ${index + 1}:`, {
                        id: d.id_demande,
                        statut: d.statut,
                        dejaValidee: d.dejaValidee,
                        validationExistante: d.validationExistante,
                        demandeur: d.demandeur?.prenom + " " + d.demandeur?.nom,
                        type: d.typeDemande?.nomType,
                        description: d.description
                    });
                });
            } else {
                newDemandes = [];
            }
            
            console.log("✅ Demandes normalisées:", newDemandes.length);
            console.log("🔍 Détail des demandes:", newDemandes.map(d => ({
                id: d.id_demande,
                statut: d.statut,
                dejaValidee: d.dejaValidee,
                demandeur: d.demandeur?.prenom + " " + d.demandeur?.nom,
                type: d.typeDemande?.nomType
            })));

            // Notifier le manager si des statuts ont changé depuis le dernier chargement
            if (previousDemandes.length > 0) {
                newDemandes.forEach((nd) => {
                    const od = previousDemandes.find(d => d.id_demande === nd.id_demande);
                    if (od && od.statut !== nd.statut) {
                        const messages = {
                            'ACCEPTEE': '✅ Demande validée (fin de processus).',
                            'REFUSEE': '❌ Demande refusée à une étape du processus.',
                            'EN_COURS': '🔄 Demande en cours de validation.'
                        };
                        toast.info(messages[nd.statut] || `📊 Statut mis à jour: ${nd.statut}`, {
                            position: "top-right",
                            autoClose: 6000,
                        });
                    }
                });
            }

            setDemandes(newDemandes);
            setPreviousDemandes(newDemandes);
        } catch (error) {
            console.error("Erreur fetchDemandes:", error);
            toast.error("Erreur lors de la récupération des demandes");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await demandeService.approveDemande(id);
            
            // Recharger les demandes pour afficher le nouveau statut
            // Mettre à jour l'état local pour refléter l'approbation N+1 immédiatement
            setN1Decision((prev) => ({ ...prev, [id]: 'ACCEPTEE' }));
            await fetchDemandes();
            
            // Notification de succès avec détails
            toast.success("✅ Validation N+1 enregistrée. Le statut final changera à la fin du processus.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
        } catch (error) {
            console.error("Erreur approve:", error);
            toast.error("❌ Erreur lors de l'approbation de la demande", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const handleReject = async (id) => {
        try {
            await demandeService.rejectDemande(id);
            
            // Recharger les demandes pour afficher le nouveau statut
            // Mettre à jour l'état local pour refléter le refus N+1 immédiatement
            setN1Decision((prev) => ({ ...prev, [id]: 'REFUSEE' }));
            await fetchDemandes();
            
            // Notification d'info avec détails
            toast.info("❌ Refus enregistré. Le statut passe à REFUSEE.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
        } catch (error) {
            console.error("Erreur reject:", error);
            toast.error("❌ Erreur lors du refus de la demande", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const handleShowDetail = async (demande) => {
        setSelectedDemande(demande);
        setShowDetailModal(true);
        
        // Si c'est Support IT, récupérer le rapport existant
        if (isSupportIT) {
            try {
                const rapportData = await demandeService.getRapportIT(demande.id_demande);
                if (rapportData.success && rapportData.rapportIT) {
                    setSelectedDemande(prev => ({ ...prev, rapportIT: rapportData.rapportIT }));
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du rapport IT:", error);
            }
        }
    };

    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedDemande(null);
    };

    useEffect(() => {
        const init = async () => {
            try {
                console.log("🚀 Initialisation de Validation.jsx");
                const info = await authService.getUserInfo();
                console.log("👤 Informations utilisateur:", info);
                
                const role = info?.role || "";
                const isSupport = role === "Support IT";
                const isManager = role === "Manager N+1";
                
                console.log("🎭 Rôles détectés:", { role, isSupport, isManager });
                
                setIsSupportIT(isSupport);
                setIsManagerN1(isManager);
                
                // Réinitialiser les filtres
                setServiceFilter("");
                setTypeFilter("");
                setUrgenceFilter("");
                
                // Charger les demandes appropriées selon le rôle
                await fetchDemandes();
            } catch (e) {
                console.error("❌ Erreur user-info:", e);
            }
        };
        init();
        
        // Pas d'actualisation automatique périodique
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmitRapport = async () => {
        if (!selectedDemande) return;
        try {
            await demandeService.submitRapportIT(selectedDemande.id_demande, {
                fichier: rapportFile,
                commentaire: rapportComment
            });
            toast.success("🧩 Rapport technique soumis", { position: "top-right" });
            setRapportFile(null);
            setRapportComment("");
            setShowDetailModal(false);
            
            // Actualisation après soumission du rapport
            await fetchDemandes();
            
        } catch (e) {
            console.error(e);
            toast.error("❌ Erreur lors de la soumission du rapport", { position: "top-right" });
        }
    };

    const handleDownloadRapport = async (demandeId) => {
        try {
            const response = await fetch(`http://localhost:8089/api/v1.0/demandes/${demandeId}/rapport-it/download`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf,application/octet-stream,*/*'
                }
            });
            
            if (!response.ok) {
                throw new Error('Fichier non trouvé');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = selectedDemande.rapportIT?.nomFichier || 'rapport-it.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            toast.success("📥 Fichier téléchargé", { position: "top-right" });
        } catch (e) {
            console.error(e);
            toast.error("❌ Erreur lors du téléchargement", { position: "top-right" });
        }
    };



    return (
        <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
            <Sidebar />
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
                <div className="container">
                    {/* HEADER */}
                    <div className="bg-primary text-white p-4 rounded-3 shadow-sm mb-4 d-flex align-items-center gap-3">
                        <span style={{ fontSize: "2rem" }}>✅</span>
                        <div>
                            <h2 className="fw-bold mb-0">
                                {isSupportIT ? "Traitement Support IT" : "Validation des demandes"}
                            </h2>
                            <small>
                                {isSupportIT 
                                    ? "Traitez les demandes approuvées par les managers N+1 de tous services"
                                    : "Visualisez et gérez les demandes de votre service"
                                }
                            </small>
                        </div>

                    </div>

                    {/* FILTRES */}
                    <div className="bg-white rounded-3 shadow-sm p-3 mb-4 d-flex gap-3 flex-wrap">
                        {isSupportIT && (
                            <select className="form-select w-auto" value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
                                <option value="">Tous les services</option>
                                <option value="Informatique">Informatique</option>
                                <option value="RH">RH</option>
                                <option value="Direction">Direction</option>
                                <option value="Production">Production</option>
                                <option value="Qualité">Qualité</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Finance">Finance</option>
                                <option value="Logistique">Logistique</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        )}

                        <select className="form-select w-auto" value={urgenceFilter} onChange={e => setUrgenceFilter(e.target.value)}>
                            <option value="">Toutes les urgences</option>
                            <option value="FAIBLE">Faible</option>
                            <option value="NORMALE">Normale</option>
                            <option value="ELEVEE">Élevée</option>
                        </select>

                        <select className="form-select w-auto" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                            <option value="">Tous les types</option>
                            <option value="Poste micro-ordinateur">Poste micro-ordinateur</option>
                            <option value="Imprimante">Imprimante</option>
                            <option value="Prise réseau">Prise réseau</option>
                            <option value="Logiciels">Logiciels</option>
                            <option value="Autres">Autres</option>
                        </select>
                    </div>

                    {/* TABLEAU DES DEMANDES */}
                    <div className="bg-white rounded-3 shadow-sm">
                        {loading ? (
                            <div className="p-5 text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Chargement...</span>
                                </div>
                                <p className="mt-3 text-muted">Chargement des demandes...</p>
                            </div>
                        ) : demandes && Array.isArray(demandes) && demandes.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        <th>Demandeur</th>
                                        {isSupportIT && <th>Service</th>}
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Urgence</th>
                                        <th>Date création</th>
                                        {!isSupportIT && <th>Statut</th>}
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {demandes
                                        .filter(d => !typeFilter || (d.typeDemande && d.typeDemande.nomType === typeFilter))
                                        .filter(d => !urgenceFilter || d.urgence === urgenceFilter)
                                        .filter(d => !serviceFilter || (d.demandeur && d.demandeur.service && d.demandeur.service.nom === serviceFilter))
                                        .map(d => (
                                            <tr key={d.id_demande}>
                                                <td>
                                                    <div>
                                                        <strong>{d.demandeur?.prenom} {d.demandeur?.nom}</strong>
                                                        <br />
                                                        <small className="text-muted">{d.demandeur?.email}</small>
                                                    </div>
                                                </td>
                                                {isSupportIT && (
                                                    <td>
                                                        <span className="badge bg-secondary">
                                                            {d.demandeur?.service?.nom || "Service non défini"}
                                                        </span>
                                                    </td>
                                                )}
                                                <td>
                                                        <span className="badge bg-info">
                                                            {d.typeDemande?.nomType || "Non défini"}
                                                        </span>
                                                </td>
                                                <td>
                                                    <div style={{ maxWidth: "200px" }}>
                                                        <div className="text-truncate" title={d.description}>
                                                            {d.description}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                        <span className={`badge ${
                                                            d.urgence === "ELEVEE" ? "bg-danger" :
                                                                d.urgence === "NORMALE" ? "bg-warning" : "bg-success"
                                                        }`}>
                                                            {d.urgence}
                                                        </span>
                                                </td>
                                                <td>
                                                    <small>
                                                        {d.dateCreation ? new Date(d.dateCreation).toLocaleDateString('fr-FR') : "N/A"}
                                                    </small>
                                                </td>
                                                {!isSupportIT && (
                                                    <td>
                                                        {d.dejaValidee ? (
                                                            <div>
                                                                {d.validationExistante && d.validationExistante.statut === 'REFUSEE' ? (
                                                                    <>
                                                                        <span className="badge bg-danger">❌ Refusée</span>
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            Refusée le {new Date(d.validationExistante.dateValidation).toLocaleDateString('fr-FR')}
                                                                        </small>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="badge bg-success">✅ Approuvée</span>
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            Approuvée le {new Date(d.validationExistante.dateValidation).toLocaleDateString('fr-FR')}
                                                                        </small>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ) : n1Decision[d.id_demande] === 'ACCEPTEE' ? (
                                                            <span className="badge bg-success">✅ Approuvée</span>
                                                        ) : n1Decision[d.id_demande] === 'REFUSEE' ? (
                                                            <span className="badge bg-danger">❌ Refusée</span>
                                                        ) : d.statut === "REFUSEE" ? (
                                                            <span className="badge bg-danger">❌ Refusée</span>
                                                        ) : d.statut === "ACCEPTEE" ? (
                                                            <span className="badge bg-success">✅ Approuvée</span>
                                                        ) : d.statut === "EN_COURS" ? (
                                                            <span className="badge bg-primary">En cours</span>
                                                        ) : (
                                                            <span className="badge bg-primary">En cours</span>
                                                        )}
                                                    </td>
                                                )}
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-outline-info btn-sm"
                                                            onClick={() => handleShowDetail(d)}
                                                            title="Voir les détails"
                                                        >
                                                            📋 Voir
                                                        </button>

                                                        {!isSupportIT && d.statut === "EN_COURS" && !d.dejaValidee && n1Decision[d.id_demande] !== 'ACCEPTEE' && n1Decision[d.id_demande] !== 'REFUSEE' && (
                                                            <>
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() => handleApprove(d.id_demande)}
                                                                    title="Approuver la demande"
                                                                >
                                                                    ✅ Approuver
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleReject(d.id_demande)}
                                                                    title="Refuser la demande"
                                                                >
                                                                    ❌ Refuser
                                                                </button>
                                                            </>
                                                        )}
                                                        {!isSupportIT && d.dejaValidee && (
                                                            <span className="text-muted small">
                                                                {d.validationExistante && d.validationExistante.statut === 'REFUSEE' ? (
                                                                    <>❌ Déjà refusée</>
                                                                ) : (
                                                                    <>✅ Déjà validée</>
                                                                )}
                                                            </span>
                                                                                                                )}
                                                        {isSupportIT && d.validationSupportITExiste && (
                                                            <span className="text-muted small">
                                                                📋 Déjà fait rapport
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-5 text-center">
                                <p className="text-muted">
                                    {isSupportIT 
                                        ? "Aucune demande validée par les managers N+1 trouvée. Le Support IT voit uniquement les demandes qui ont été approuvées par les managers N+1 de tous services."
                                        : "Aucune demande trouvée pour votre service"
                                    }
                                </p>
                                {isSupportIT && (
                                    <div className="mt-3 p-3 bg-light rounded">
                                        <h6>ℹ️ Information</h6>
                                        <p className="mb-2">En tant que Support IT, vous voyez uniquement les demandes qui :</p>
                                        <ul className="text-start text-muted">
                                            <li>Ont le statut "EN_COURS"</li>
                                            <li>Ont été validées par un Manager N+1</li>
                                            <li>N'ont pas encore été traitées par le Support IT</li>
                                            <li>Proviennent de tous les services</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL DÉTAILS */}
            {showDetailModal && selectedDemande && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">📋 Détails de la demande</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={handleCloseDetail}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold">👤 Informations du demandeur</h6>
                                        <p><strong>Nom complet:</strong> {selectedDemande.demandeur?.prenom} {selectedDemande.demandeur?.nom}</p>
                                        <p><strong>Email:</strong> {selectedDemande.demandeur?.email}</p>
                                        <p><strong>Téléphone:</strong> {selectedDemande.demandeur?.telephone || "Non renseigné"}</p>
                                        <p><strong>Service:</strong> {selectedDemande.demandeur?.service?.nom || "Non défini"}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold">📄 Détails de la demande</h6>
                                        <p><strong>Type:</strong> {selectedDemande.typeDemande?.nomType || "Non défini"}</p>
                                        <p><strong>Urgence:</strong>
                                            <span className={`badge ms-2 ${
                                                selectedDemande.urgence === "ELEVEE" ? "bg-danger" :
                                                    selectedDemande.urgence === "NORMALE" ? "bg-warning" : "bg-success"
                                            }`}>
                                                {selectedDemande.urgence}
                                            </span>
                                        </p>
                                        <p><strong>Statut:</strong>
                                            <span className={`badge ms-2 ${
                                                selectedDemande.statut === "EN_COURS" ? "bg-primary" :
                                                    selectedDemande.statut === "ACCEPTEE" ? "bg-success" : "bg-danger"
                                            }`}>
                                                {selectedDemande.statut}
                                            </span>
                                        </p>
                                        <p><strong>Date création:</strong> {selectedDemande.dateCreation ? new Date(selectedDemande.dateCreation).toLocaleString('fr-FR') : "N/A"}</p>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <h6 className="fw-bold">📝 Description</h6>
                                    <div className="bg-light p-3 rounded">
                                        {selectedDemande.description || "Aucune description"}
                                    </div>
                                </div>

                                {selectedDemande.commentaireAutres && (
                                    <div className="mt-3">
                                        <h6 className="fw-bold">💬 Commentaires</h6>
                                        <div className="bg-light p-3 rounded">
                                            {selectedDemande.commentaireAutres}
                                        </div>
                                    </div>
                                )}

                                {isSupportIT && !selectedDemande.validationSupportITExiste && (
                                    <div className="mt-4">
                                        <h6 className="fw-bold">🧩 Rapport technique (Support IT)</h6>
                                        <div className="mb-3">
                                            <label className="form-label">Importer un rapport technique</label>
                                            <input type="file" className="form-control" onChange={(e) => setRapportFile(e.target.files?.[0] || null)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Commentaire technique</label>
                                            <textarea className="form-control" rows="4" placeholder="Ajoutez vos observations et recommandations..." value={rapportComment} onChange={(e) => setRapportComment(e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                {/* Afficher le rapport existant s'il existe */}
                                {isSupportIT && selectedDemande.validationSupportITExiste && (
                                    <div className="mt-4">
                                        <h6 className="fw-bold">📋 Rapport technique soumis</h6>
                                        <div className="bg-success bg-opacity-10 p-3 rounded border border-success">
                                            <p><strong>Date du rapport:</strong> {selectedDemande.rapportIT?.dateRapport ? new Date(selectedDemande.rapportIT.dateRapport).toLocaleString('fr-FR') : 'N/A'}</p>
                                            <p><strong>Commentaire:</strong> {selectedDemande.rapportIT?.commentaire || 'Aucun commentaire'}</p>
                                            {selectedDemande.rapportIT?.nomFichier && (
                                                <div>
                                                    <p><strong>Fichier:</strong> 
                                                        <a 
                                                            href="#" 
                                                            className="text-primary text-decoration-underline"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDownloadRapport(selectedDemande.id_demande);
                                                            }}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            📄 {selectedDemande.rapportIT.nomFichier}
                                                        </a>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDetail}>Fermer</button>
                                {!isSupportIT && selectedDemande.statut === "EN_COURS" && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => {
                                                handleApprove(selectedDemande.id_demande);
                                                handleCloseDetail();
                                            }}
                                        >
                                            ✅ Approuver
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => {
                                                handleReject(selectedDemande.id_demande);
                                                handleCloseDetail();
                                            }}
                                        >
                                            ❌ Refuser
                                        </button>
                                    </>
                                )}
                                {isSupportIT && !selectedDemande.validationSupportITExiste && (
                                    <button type="button" className="btn btn-primary" onClick={handleSubmitRapport} disabled={!rapportFile && !rapportComment}>
                                        Soumettre le rapport
                                    </button>
                                )}
                                {isSupportIT && selectedDemande.validationSupportITExiste && (
                                    <span className="text-muted">
                                        📋 Rapport déjà soumis
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Validation;
