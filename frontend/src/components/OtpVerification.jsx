import { useState } from "react";
import { authService } from "../services/api.js";
import { toast } from "react-toastify";

const OtpVerification = ({ email, onSuccess, onCancel }) => {
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!otp || otp.length !== 6) {
            toast.error("Veuillez entrer un code OTP à 6 chiffres");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Vérification OTP pour:", email, "avec code:", otp);
            const response = await authService.verifyLoginOtp(email, otp);
            console.log("Réponse OTP:", response);
            
            if (response.success) {
                toast.success("Connexion réussie !");
                console.log("Appel de onSuccess()");
                onSuccess();
            } else {
                toast.error(response.message || "Code OTP invalide");
            }
        } catch (error) {
            console.error("Erreur OTP:", error);
            toast.error(error.message || "Erreur lors de la vérification");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
             style={{
                 background: "linear-gradient(90deg, #6a5af9 , #8268f9)",
                 border: "none",
             }}>
            <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">Vérification OTP</h2>
                
                                       <div className="alert alert-info mb-4">
                           <strong>Première connexion !</strong><br/>
                           Un code de vérification a été envoyé à <strong>{email}</strong><br/>
                           <small>Cette vérification ne sera nécessaire que pour la première connexion.</small>
                       </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="otp" className="form-label">
                            Code OTP <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            id="otp"
                            className="form-control text-center"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength="6"
                            required
                            style={{ fontSize: "1.5rem", letterSpacing: "0.5rem" }}
                        />
                        <small className="text-muted">Entrez le code à 6 chiffres reçu par email</small>
                    </div>

                    <div className="d-grid gap-2">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Vérification...
                                </>
                            ) : (
                                "Vérifier et se connecter"
                            )}
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={onCancel}
                        >
                            Retour à la connexion
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;
