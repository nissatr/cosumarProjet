import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { demandeService } from "../services/api.js";
import Sidebar from "../components/Sidebar.jsx";

const MesDemandes = () => {
    const [demandes, setDemandes] = useState([]);
    const [statutFilter, setStatutFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    useEffect(() => {
        fetchDemandes();
    }, []);

    const fetchDemandes = async () => {
        try {
            const data = await demandeService.getMyDemandes();
            setDemandes(data);
        } catch (err) {
            toast.error("Erreur de chargement des demandes");
        }
    };

    const handleAnnuler = async (id) => {
        if (!window.confirm("Voulez-vous annuler cette demande ?")) return;
        await demandeService.annulerDemande(id);
        fetchDemandes();
    };

    const handleSupprimer = async (id) => {
        if (!window.confirm("Voulez-vous supprimer cette demande ?")) return;
        await demandeService.supprimerDemande(id);
        fetchDemandes();
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
                        <select className="form-select w-auto" value={statutFilter} onChange={e => setStatutFilter(e.target.value)}>
                            <option value="">Tous les statuts</option>
                            <option value="EN_COURS">En cours</option>
                            <option value="ACCEPTEE">Acceptée</option>
                            <option value="REFUSEE">Refusée</option>
                            <option value="ANNULEE">Annulée</option>
                        </select>

                        <select className="form-select w-auto" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                            <option value="">Tous les types</option>
                            <option value="ORDINATEUR">Ordinateur</option>
                            <option value="IMPRIMANTE">Imprimante</option>
                            <option value="PRISE_RESEAU">Prise réseau</option>
                            <option value="LOGICIELS">Logiciels</option>
                            <option value="AUTRE">Autre</option>
                        </select>
                    </div>

                    {/* LISTE DES DEMANDES */}
                    <div className="row row-cols-1 row-cols-md-2 g-3">
                        {demandes
                            .filter(d => !statutFilter || d.statut === statutFilter)
                            .filter(d => !typeFilter || d.typeDemande.nom === typeFilter)
                            .map(d => (
                                <div key={d.id_demande} className="col">
                                    <div className="bg-white rounded-3 shadow-sm p-3 h-100 d-flex flex-column justify-content-between">
                                        <div>
                                            <h5 className="fw-bold">{d.description}</h5>
                                            <p className="mb-1"><strong>Statut:</strong> {d.statut}</p>
                                            <p className="mb-1"><strong>Urgence:</strong> {d.urgence}</p>
                                            <p className="mb-0"><strong>Type:</strong> {d.typeDemande.nom}</p>
                                        </div>

                                        <div className="mt-3 d-flex gap-2 flex-wrap">
                                            {d.statut === "EN_COURS" && <button className="btn btn-warning btn-sm" onClick={() => handleAnnuler(d.id_demande)}>Annuler</button>}
                                            {d.statut === "ACCEPTEE" && <button className="btn btn-info btn-sm" onClick={() => alert("Voir détails...")}>Détails</button>}
                                            {d.statut === "REFUSEE" && <button className="btn btn-danger btn-sm" onClick={() => handleSupprimer(d.id_demande)}>Supprimer</button>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MesDemandes;
