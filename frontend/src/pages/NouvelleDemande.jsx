import Sidebar from "../components/Sidebar.jsx";
import { useState } from "react";
import { equipmentService } from "../services/api.js";
import { toast } from "react-toastify";

const NouvelleDemande = () => {
    const [selectedMethod, setSelectedMethod] = useState("formulaire");
    const [equipmentType, setEquipmentType] = useState("");
    const [otherEquipmentType, setOtherEquipmentType] = useState("");
    const [requestType, setRequestType] = useState(""); // Nouveau ou Changement
    const [description, setDescription] = useState("");
    const [urgencyLevel, setUrgencyLevel] = useState("");
    const [signature, setSignature] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const equipmentTypes = [
        { id: "poste", label: "1- Poste micro-ordinateur", icon: "💻", hasOptions: true },
        { id: "imprimante", label: "2- Imprimante", icon: "🖨️", hasOptions: true },
        { id: "reseau", label: "3- Prise réseau", icon: "🌐", hasOptions: false },
        { id: "logiciels", label: "4- Logiciels", icon: "💾", hasOptions: false },
        { id: "autre", label: "5- Autres", icon: "📄", hasOptions: false }
    ];

    const urgencyLevels = [
        { value: "faible", label: "Faible" },
        { value: "normale", label: "Normale" },
        { value: "elevee", label: "Élevée" },
        { value: "critique", label: "Critique" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!signature) {
            toast.error("Vous devez accepter les conditions d'utilisation");
            return;
        }

        // Vérifier si le type de demande est requis
        const selectedEquipment = equipmentTypes.find(type => type.id === equipmentType);
        if (selectedEquipment && selectedEquipment.hasOptions && !requestType) {
            toast.error("Veuillez sélectionner 'Nouveau' ou 'Changement'");
            return;
        }

        setIsSubmitting(true);

        try {
            const requestData = {
                equipmentType: equipmentType === "autre" ? otherEquipmentType : equipmentType,
                requestType: requestType,
                description: description,
                urgencyLevel: urgencyLevel,
                signature: signature
            };

            const response = await equipmentService.createRequest(requestData);
            
            if (response.success) {
                toast.success("Demande d'équipement créée avec succès !");
                
                // Réinitialiser le formulaire
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
        <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
            {/* Sidebar */}
            <Sidebar />
            
            {/* Contenu principal */}
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
                <div className="container-fluid">
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        {/* Header */}
                        <h2 className="fw-bold mb-3">Nouvelle demande d'équipement</h2>
                        
                        {/* Sélection de méthode */}
                        <div className="mb-4">
                            <h5 className="fw-medium mb-3">Choisissez votre méthode préférée pour créer votre demande</h5>
                            <div className="d-flex gap-3 mb-4">
                                <button
                                    className={`btn ${selectedMethod === "assistant" ? 'btn-primary' : 'btn-outline-secondary'} rounded-3 px-4 py-2`}
                                    onClick={() => setSelectedMethod("assistant")}
                                >
                                    ✨ Assistant IA
                                </button>
                                <button
                                    className={`btn ${selectedMethod === "nouveau" ? 'btn-primary' : 'btn-outline-secondary'} rounded-3 px-4 py-2`}
                                    onClick={() => setSelectedMethod("nouveau")}
                                >
                                    ✨ Nouveau
                                </button>
                                <button
                                    className={`btn ${selectedMethod === "formulaire" ? 'btn-primary' : 'btn-outline-secondary'} rounded-3 px-4 py-2`}
                                    onClick={() => setSelectedMethod("formulaire")}
                                >
                                    📄 Formulaire classique
                                </button>
                            </div>
                        </div>

                        {/* Formulaire traditionnel */}
                        <div>
                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2" style={{ fontSize: "1.5rem" }}>📄</span>
                                <h4 className="fw-bold mb-0">Formulaire traditionnel</h4>
                            </div>
                            <p className="text-muted mb-4">
                                Remplissez directement le formulaire si vous préférez une approche plus classique.
                            </p>

                            <form onSubmit={handleSubmit}>
                                {/* Type d'équipement */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        Type de demande <span className="text-danger">*</span>
                                    </label>
                                    <div className="d-flex flex-column gap-2">
                                        {equipmentTypes.map((type) => (
                                            <div key={type.id} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="equipmentType"
                                                    id={type.id}
                                                    value={type.id}
                                                    checked={equipmentType === type.id}
                                                    onChange={(e) => {
                                                        setEquipmentType(e.target.value);
                                                        setRequestType(""); // Reset request type when equipment type changes
                                                    }}
                                                    required
                                                />
                                                <label className="form-check-label d-flex align-items-center" htmlFor={type.id}>
                                                    <span className="me-2" style={{ fontSize: "1.2rem" }}>{type.icon}</span>
                                                    {type.label}
                                                </label>
                                                
                                                {/* Options Nouveau/Changement pour certains types */}
                                                {equipmentType === type.id && type.hasOptions && (
                                                    <div className="ms-4 mt-2">
                                                        <div className="d-flex gap-3">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="requestType"
                                                                    id={`${type.id}-nouveau`}
                                                                    value="nouveau"
                                                                    checked={requestType === "nouveau"}
                                                                    onChange={(e) => setRequestType(e.target.value)}
                                                                    required
                                                                />
                                                                <label className="form-check-label" htmlFor={`${type.id}-nouveau`}>
                                                                     Nouveau
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="requestType"
                                                                    id={`${type.id}-changement`}
                                                                    value="changement"
                                                                    checked={requestType === "changement"}
                                                                    onChange={(e) => setRequestType(e.target.value)}
                                                                    required
                                                                />
                                                                <label className="form-check-label" htmlFor={`${type.id}-changement`}>
                                                                     Changement
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Champ pour "Autre" */}
                                    {equipmentType === "autre" && (
                                        <div className="mt-3">
                                            <label className="form-label fw-medium">
                                                Précisez le type d'équipement <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ex: Scanner, Webcam, Casque audio..."
                                                value={otherEquipmentType}
                                                onChange={(e) => setOtherEquipmentType(e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Description détaillée */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        Description détaillée <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="6"
                                        placeholder="Décrivez précisément l'équipement demandé, ses spécifications techniques si nécessaire..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        style={{ resize: "vertical" }}
                                    ></textarea>
                                </div>

                                {/* Niveau d'urgence */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">
                                        Niveau d'urgence <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        value={urgencyLevel}
                                        onChange={(e) => setUrgencyLevel(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionnez le niveau d'urgence</option>
                                        {urgencyLevels.map((level) => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Signature électronique */}
                                <div className="mb-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="signature"
                                            checked={signature}
                                            onChange={(e) => setSignature(e.target.checked)}
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="signature">
                                            Je certifie que les informations fournies sont exactes et j'accepte les conditions d'utilisation du système de demande d'équipement IT <span className="text-danger">*</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Bouton de soumission */}
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="btn btn-dark rounded-3 px-5 py-3 fw-medium"
                                        style={{ fontSize: "1.1rem" }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Envoi en cours...
                                            </>
                                        ) : (
                                            "📤 Soumettre la demande"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NouvelleDemande;
