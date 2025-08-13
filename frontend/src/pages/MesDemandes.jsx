import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { demandeService } from "../services/api.js";


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
        <div>
            <h2>Mes Demandes</h2>

            {/* Filtres */}
            <div>
                <select value={statutFilter} onChange={e => setStatutFilter(e.target.value)}>
                    <option value="">Tous les statuts</option>
                    <option value="EN_COURS">En cours</option>
                    <option value="ACCEPTEE">Acceptée</option>
                    <option value="REFUSEE">Refusée</option>
                    <option value="ANNULEE">Annulée</option>
                </select>

                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="">Tous les types</option>
                    <option value="ORDINATEUR">Ordinateur</option>
                    <option value="IMPRIMANTE">Imprimante</option>
                    <option value="PRISE_RESEAU">Prise réseau</option>
                    <option value="LOGICIELS">Logiciels</option>
                    <option value="AUTRE">Autre</option>
                </select>
            </div>

            {/* Liste */}
            <div>
                {demandes
                    .filter(d => !statutFilter || d.statut === statutFilter)
                    .filter(d => !typeFilter || d.typeDemande.nom === typeFilter)
                    .map(d => (
                        <div key={d.id_demande} style={{ border: "1px solid #ddd", padding: "10px", margin: "5px 0" }}>
                            <strong>{d.description}</strong>
                            <div>Statut: {d.statut}</div>
                            <div>Urgence: {d.urgence}</div>

                            {d.statut === "EN_COURS" && <button onClick={() => handleAnnuler(d.id_demande)}>Annuler</button>}
                            {d.statut === "ACCEPTEE" && <button onClick={() => alert("Voir détails...")}>Détails</button>}
                            {d.statut === "REFUSEE" && <button onClick={() => handleSupprimer(d.id_demande)}>Supprimer</button>}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default MesDemandes;
