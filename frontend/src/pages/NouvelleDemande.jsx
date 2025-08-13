import Sidebar from "../components/Sidebar.jsx";
import { useState } from "react";
import { equipmentService } from "../services/api.js";
import { toast } from "react-toastify";

const NouvelleDemande = () => {
    const [selectedMethod, setSelectedMethod] = useState("formulaire");
    const [equipmentType, setEquipmentType] = useState("");
    const [otherEquipmentType, setOtherEquipmentType] = useState("");
    const [requestType, setRequestType] = useState("");
    const [description, setDescription] = useState("");
    const [urgencyLevel, setUrgencyLevel] = useState("");
    const [signature, setSignature] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const equipmentTypes = [
        { id: "poste", label: "Poste micro-ordinateur", icon: "💻", hasOptions: true },
        { id: "imprimante", label: "Imprimante", icon: "🖨️", hasOptions: true },
        { id: "reseau", label: "Prise réseau", icon: "🌐", hasOptions: false },
        { id: "logiciels", label: "Logiciels", icon: "💾", hasOptions: false },
        { id: "autre", label: "Autres", icon: "📄", hasOptions: false }
    ];

    const urgencyLevels = [
        { value: "faible", label: "Faible" },
        { value: "normale", label: "Normale" },
        { value: "elevee", label: "Élevée" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification de la signature
        if (!signature) {
            toast.error("Vous devez accepter les conditions d'utilisation");
            return;
        }

        // Vérification du type de demande si nécessaire
        const selectedEquipment = equipmentTypes.find(type => type.id === equipmentType);
        if (selectedEquipment && selectedEquipment.hasOptions && !requestType) {
            toast.error("Veuillez sélectionner 'Nouveau' ou 'Changement'");
            return;
        }

        // Vérification du niveau d'urgence
        if (!urgencyLevel) {
            toast.error("Veuillez sélectionner le niveau d'urgence");
            return;
        }

        setIsSubmitting(true);

        try {
            // Mapping des IDs vers les labels pour le backend
            const selectedEquipment = equipmentTypes.find(type => type.id === equipmentType);
            const equipmentTypeForBackend = equipmentType === "autre" ? otherEquipmentType : selectedEquipment.label;
            
            // Pour les types sans options, ne pas envoyer de requestType
            const finalRequestType = selectedEquipment.hasOptions ? requestType : null;
            
            const requestData = {
                equipmentType: equipmentTypeForBackend,
                requestType: finalRequestType,
                description,
                urgencyLevel,   // le backend pourra convertir en enum
                signature
            };

            const response = await equipmentService.createRequest(requestData);

            if (response.success) {
                toast.success("Demande d'équipement créée avec succès !");
                // Réinitialisation du formulaire
                setEquipmentType("");
                setOtherEquipmentType("");
                setRequestType("");
                setDescription("");
                setUrgencyLevel("");
                setSignature(false);
            } else {
                toast.error(response.message || "Erreur lors de la création de la demande");
            }
        } catch (error) {
            toast.error(error.message || "Erreur lors de la création de la demande");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
            <Sidebar />
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
                <div className="container">

                    {/* HEADER */}
                    <div className="bg-primary text-white p-4 rounded-3 shadow-sm mb-4 d-flex align-items-center gap-3">
                        <span style={{ fontSize: "2rem" }}>🛠️</span>
                        <div>
                            <h2 className="fw-bold mb-0">Nouvelle demande d'équipement</h2>
                            <small>Remplissez le formulaire ci-dessous pour soumettre votre demande.</small>
                        </div>
                    </div>

                    {/* FORM CARD */}
                    <div className="bg-white rounded-3 shadow-sm p-4">

                        {/* TYPE ÉQUIPEMENT */}
                        <h5 className="fw-bold mb-3">Type de demande</h5>

                        <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
                            {equipmentTypes.map((type) => (
                                <div key={type.id} className="col">
                                    <div
                                        className={`equip-card ${equipmentType === type.id ? "is-active" : ""}`}
                                        onClick={() => { setEquipmentType(type.id); setRequestType(""); }}
                                    >
                                        <div className="equip-icon">{type.icon}</div>
                                        <div className="equip-label">{type.label}</div>

                                        {/* Toggle Nouveau/Changement → désormais DANS la carte sélectionnée */}
                                        {equipmentType === type.id && type.hasOptions && (
                                            <div className="mt-3 w-100" onClick={(e) => e.stopPropagation()}>
                                                <div className="segmented" role="tablist" aria-label="Type de demande">
                                                    <button
                                                        type="button"
                                                        className={`segmented-btn ${requestType === "nouveau" ? "active" : ""}`}
                                                        onClick={() => setRequestType("nouveau")}
                                                    >
                                                        Nouveau
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`segmented-btn ${requestType === "changement" ? "active" : ""}`}
                                                        onClick={() => setRequestType("changement")}
                                                    >
                                                        Changement
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>


                        {/* AUTRE ÉQUIPEMENT */}
                        {equipmentType === "autre" && (
                            <div className="mb-4">
                                <label className="form-label fw-medium">Précisez le type d'équipement *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ex: Scanner, Webcam..."
                                    value={otherEquipmentType}
                                    onChange={(e) => setOtherEquipmentType(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* DESCRIPTION */}
                        <div className="mb-4">
                            <label className="form-label fw-medium">Description détaillée *</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="Décrivez précisément l'équipement demandé..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        {/* URGENCE */}
                        <div className="mb-4">
                            <label className="form-label fw-medium">Niveau d'urgence *</label>
                            <select
                                className="form-select"
                                value={urgencyLevel}
                                onChange={(e) => setUrgencyLevel(e.target.value)}
                                required
                            >
                                <option value="">Sélectionnez</option>
                                {urgencyLevels.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SIGNATURE */}
                        <div className="mb-4 form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={signature}
                                onChange={(e) => setSignature(e.target.checked)}
                                required
                            />
                            <label className="form-check-label">
                                J'accepte les conditions d'utilisation et certifie l'exactitude des informations *
                            </label>
                        </div>

                        {/* BOUTON */}
                        <div className="text-end">
                            <button
                                type="submit"
                                className="btn btn-primary px-4 py-2 fw-medium"
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                            >
                                {isSubmitting ? "Envoi..." : "📤 Soumettre la demande"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NouvelleDemande;
