import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { demandeService } from "../services/api.js";
import Sidebar from "../components/Sidebar.jsx";

const MesDemandes = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statutFilter, setStatutFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [urgenceFilter, setUrgenceFilter] = useState("");
    const [previousDemandes, setPreviousDemandes] = useState([]);


    useEffect(() => {
        fetchDemandes();
    }, []);


    const fetchDemandes = async () => {
        setLoading(true);
        try {
            const data = await demandeService.getMyDemandes();
            console.log("Données reçues:", data); // Debug
            console.log("Type de data:", typeof data);
            console.log("Est-ce un tableau?", Array.isArray(data));
            if (data && Array.isArray(data) && data.length > 0) {
                console.log("Première demande:", data[0]);
                console.log("TypeDemande de la première demande:", data[0].typeDemande);
            }
            
            let newDemandes = [];
            // S'assurer que data est un tableau
            if (data && Array.isArray(data)) {
                newDemandes = data;
            } else if (data && data.demandes && Array.isArray(data.demandes)) {
                newDemandes = data.demandes;
            }
            
            // Vérifier les changements de statut et notifier
            if (previousDemandes.length > 0) {
                newDemandes.forEach(newDemande => {
                    const oldDemande = previousDemandes.find(d => d.id_demande === newDemande.id_demande);
                    if (oldDemande && oldDemande.statut !== newDemande.statut) {
                        // Notification de changement de statut
                        const statusMessages = {
                            'ACCEPTEE': '✅ Votre demande a été acceptée !',
                            'REFUSEE': '❌ Votre demande a été refusée.',
                            'EN_COURS': '🔄 Votre demande est en cours de traitement.',
                            'ANNULEE': '🚫 Votre demande a été annulée.'
                        };
                        
                        const message = statusMessages[newDemande.statut] || `📊 Le statut de votre demande a changé vers: ${newDemande.statut}`;
                        
                        toast.info(message, {
                            position: "top-right",
                            autoClose: 7000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    }
                });
            }
            
            setDemandes(newDemandes);
            setPreviousDemandes(newDemandes);
            
        } catch (err) {
            console.error("Erreur fetchDemandes:", err); // Debug
            toast.error("Erreur de chargement des demandes");
            setDemandes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAnnuler = async (id) => {
        if (!window.confirm("Voulez-vous annuler cette demande ?")) return;
        try {
            await demandeService.annulerDemande(id);
            toast.success("✅ Demande annulée avec succès !", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            fetchDemandes(); // Rafraîchit la liste
        } catch {
            toast.error("❌ Impossible d'annuler la demande.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const handleSupprimer = async (id) => {
        if (!window.confirm("Voulez-vous supprimer cette demande ?")) return;
        try {
            await demandeService.supprimerDemande(id);
            toast.success("🗑️ Demande supprimée avec succès !", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            fetchDemandes(); // Rafraîchit la liste
        } catch {
            toast.error("❌ Impossible de supprimer la demande.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };


    return (
        <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
            <Sidebar />
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
                <div className="container">

                    {/* HEADER */}
                    <div className="bg-primary text-white p-4 rounded-3 shadow-sm mb-4 d-flex align-items-center gap-3">
                        <span style={{ fontSize: "2rem" }}>📋</span>
                        <div>
                            <h2 className="fw-bold mb-0">Mes demandes</h2>
                            <small>Visualisez et gérez vos demandes d'équipement.</small>
                        </div>
                    </div>

                    {/* FILTRES */}
                    <div className="bg-white rounded-3 shadow-sm p-3 mb-4 d-flex gap-3 flex-wrap">
                        <select className="form-select w-auto" value={statutFilter}
                                onChange={e => setStatutFilter(e.target.value)}>
                            <option value="">Tous les statuts</option>
                            <option value="EN_COURS">En cours</option>
                            <option value="ACCEPTEE">Acceptée</option>
                            <option value="REFUSEE">Refusée</option>
                            <option value="ANNULEE">Annulée</option>
                        </select>
                        <select className="form-select w-auto" value={urgenceFilter}
                                onChange={e => setUrgenceFilter(e.target.value)}>
                            <option value="">Toutes les urgences</option>
                            <option value="FAIBLE">Faible</option>
                            <option value="MOYENNE">Moyenne</option>
                            <option value="ELEVEE">Élevée</option>
                        </select>


                        <select className="form-select w-auto" value={typeFilter}
                                onChange={e => setTypeFilter(e.target.value)}>
                            <option value="">Tous les types</option>
                            <option value="Poste micro-ordinateur">Poste micro-ordinateur</option>
                            <option value="Imprimante">Imprimante</option>
                            <option value="Prise réseau">Prise réseau</option>
                            <option value="Logiciels">Logiciels</option>
                            <option value="Autres">Autres</option>
                        </select>
                    </div>

                    {/* LISTE DES DEMANDES */}
                    <div className="row row-cols-1 row-cols-md-2 g-3">
                        {loading ? (
                            <div className="col-12">
                                <div className="bg-white rounded-3 shadow-sm p-5 text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Chargement...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Chargement des demandes...</p>
                                </div>
                            </div>
                        ) : demandes && Array.isArray(demandes) && demandes.length > 0 ? (
                            demandes
                                .filter(d => d && d.id_demande) // Vérifier que d existe
                                .filter(d => !statutFilter || d.statut === statutFilter)
                                .filter(d => !typeFilter || (d.typeDemande && d.typeDemande.nomType === typeFilter))
                                .filter(d => !urgenceFilter || d.urgence === urgenceFilter)
                                .map(d => (
                                <div key={d.id_demande} className="col">
                                    <div className="bg-white rounded-3 shadow-sm p-3 h-100 d-flex flex-column justify-content-between">
                                        <div>
                                            <h5 className="fw-bold">{d.description}</h5>
                                            <p className="mb-1"><strong>Statut:</strong> {d.statut}</p>
                                            <p className="mb-1"><strong>Urgence:</strong> {d.urgence}</p>
                                            <p className="mb-0">
                                                <strong>Type:</strong> 
                                                {d.typeDemande && d.typeDemande.nomType ? (
                                                    d.typeDemande.nomType
                                                ) : (
                                                    <span className="text-danger">Type supprimé ou non défini</span>
                                                )}
                                            </p>
                                        </div>

                                        <div className="mt-3 d-flex gap-2 flex-wrap">
                                            {d.statut === "EN_COURS" && <button className="btn btn-warning btn-sm" onClick={() => handleAnnuler(d.id_demande)}>Annuler</button>}
                                            {d.statut === "ACCEPTEE" && <span className="badge bg-success">Demande acceptée</span>}
                                            {d.statut === "REFUSEE" && <button className="btn btn-danger btn-sm" onClick={() => handleSupprimer(d.id_demande)}>Supprimer</button>}
                                            {d.statut === "ANNULEE" && <button className="btn btn-danger btn-sm" onClick={() => handleSupprimer(d.id_demande)}>Supprimer</button>}

                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : null}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MesDemandes;