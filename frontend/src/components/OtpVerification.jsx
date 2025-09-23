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
                console.log("Appel de onSuccess() avec userInfo:", response.user);
                onSuccess(response.user);
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
        <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
             style={{
                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                 minHeight: "100vh"
             }}>

            {/* Particules d'arrière-plan */}
            <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
                <div className="position-absolute" style={{ top: "20%", left: "10%", width: "20px", height: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", animation: "float 6s ease-in-out infinite" }}></div>
                <div className="position-absolute" style={{ top: "60%", right: "15%", width: "15px", height: "15px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", animation: "float 8s ease-in-out infinite" }}></div>
                <div className="position-absolute" style={{ top: "40%", left: "80%", width: "25px", height: "25px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", animation: "float 7s ease-in-out infinite" }}></div>
            </div>

            {/* Conteneur principal */}
            <div className="container" style={{ zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-6 col-sm-8">
                        {/* Carte du formulaire */}
                        <div className="card border-0 shadow-lg"
                             style={{
                                 borderRadius: "20px",
                                 backdropFilter: "blur(10px)",
                                 backgroundColor: "rgba(255, 255, 255, 0.95)"
                             }}>

                            {/* Header de la carte */}
                            <div className="card-header bg-transparent border-0 text-center pt-4 pb-0">
                                <div className="mb-3">
                                    <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center"
                                         style={{ width: "60px", height: "60px" }}>
                                        <i className="bi bi-shield-check text-white" style={{ fontSize: "1.5rem" }}></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>
                                    Vérification OTP
                                </h2>
                                <p className="text-muted mb-0">
                                    Sécurisez votre connexion
                                </p>
                            </div>

                            <div className="card-body p-4">
                                {/* Message d'information */}
                                <div className="alert alert-info border-0 mb-4"
                                     style={{
                                         backgroundColor: "rgba(102, 126, 234, 0.1)",
                                         borderLeft: "4px solid #667eea",
                                         borderRadius: "12px"
                                     }}>
                                    <div className="d-flex align-items-start">
                                        <i className="bi bi-info-circle-fill text-primary me-2 mt-1"></i>
                                        <div>
                                            <strong>Code envoyé !</strong><br/>
                                            Un code de vérification a été envoyé à <strong>{email}</strong><br/>
                                            <small className="text-muted">Cette vérification ne sera nécessaire que pour la première connexion.</small>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {/* Champ OTP */}
                                    <div className="mb-4">
                                        <label htmlFor="otp" className="form-label fw-medium">
                                            Code OTP <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-key text-muted"></i>
                                            </span>
                                            <input
                                                type="text"
                                                id="otp"
                                                className="form-control border-start-0 text-center fw-bold"
                                                placeholder="000000"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                maxLength="6"
                                                required
                                                style={{
                                                    borderColor: "#e9ecef",
                                                    fontSize: "1.5rem",
                                                    letterSpacing: "0.5rem"
                                                }}
                                            />
                                        </div>
                                        <small className="text-muted">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Entrez le code à 6 chiffres reçu par email
                                        </small>
                                    </div>

                                    {/* Boutons */}
                                    <div className="d-grid gap-3">
                                        <button
                                            type="submit"
                                            className="btn btn-success py-3 fw-medium"
                                            disabled={isSubmitting}
                                            style={{
                                                borderRadius: "12px",
                                                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                                                border: "none",
                                                boxShadow: "0 4px 15px rgba(40, 167, 69, 0.4)",
                                                transition: "all 0.3s ease"
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.transform = "translateY(-2px)";
                                                e.target.style.boxShadow = "0 6px 20px rgba(40, 167, 69, 0.6)";
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.transform = "translateY(0)";
                                                e.target.style.boxShadow = "0 4px 15px rgba(40, 167, 69, 0.4)";
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Vérification...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    Vérifier et se connecter
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary py-2"
                                            onClick={onCancel}
                                            style={{ borderRadius: "12px" }}
                                        >
                                            <i className="bi bi-arrow-left me-2"></i>
                                            Retour à la connexion
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-4">
                            <p className="text-white opacity-75 mb-0">
                                © 2024 Équipement IT - Système de gestion des demandes
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS pour les animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                .form-control:focus {
                    border-color: #28a745 !important;
                    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
                }

                .input-group-text {
                    border-color: #e9ecef !important;
                }
            `}</style>
        </div>
    );
};

export default OtpVerification;
