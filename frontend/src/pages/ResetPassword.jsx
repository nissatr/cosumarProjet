// src/pages/ResetPassword.jsx
import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../services/api.js";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();

    const sendOtp = async () => {
        if (!email) {
            toast.error("Veuillez saisir votre adresse email");
            return;
        }
        setIsSendingOtp(true);
        try {
            await authService.sendResetOtp(email);
            setOtpSent(true);
            toast.success("Code OTP envoyé à votre email");
        } catch (e) {
            toast.error(e.message || "Impossible d'envoyer le code");
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !otp || !newPassword || !confirmPassword) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }
        if (otp.length !== 6) {
            toast.error("Le code OTP doit contenir 6 chiffres");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        setIsSubmitting(true);
        try {
            await authService.resetPassword({ email, otp, newPassword });
            toast.success("Mot de passe réinitialisé avec succès !");
            navigate("/login");
        } catch (e) {
            toast.error(e.message || "Erreur lors de la réinitialisation");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                minHeight: "100vh",
            }}
        >
            {/* Particules */}
            <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
                <div
                    className="position-absolute"
                    style={{
                        top: "20%",
                        left: "10%",
                        width: "20px",
                        height: "20px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "50%",
                        animation: "float 6s ease-in-out infinite",
                    }}
                />
                <div
                    className="position-absolute"
                    style={{
                        top: "60%",
                        right: "15%",
                        width: "15px",
                        height: "15px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "50%",
                        animation: "float 8s ease-in-out infinite",
                    }}
                />
                <div
                    className="position-absolute"
                    style={{
                        top: "40%",
                        left: "80%",
                        width: "25px",
                        height: "25px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "50%",
                        animation: "float 7s ease-in-out infinite",
                    }}
                />
            </div>

            {/* Logo */}
            <div
                className="position-absolute"
                style={{ top: "30px", left: "40px", zIndex: 10 }}
            >
                <Link
                    to="/"
                    className="d-flex align-items-center text-decoration-none"
                    style={{ color: "white" }}
                >
                    <div
                        className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                            width: "45px",
                            height: "45px",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        }}
                    >
                        <img src={assets.logo} alt="logo" height={28} width={28} />
                    </div>
                    <div>
                        <div className="fw-bold fs-5">Équipement IT</div>
                        <div className="fs-7 opacity-75">Système de demandes</div>
                    </div>
                </Link>
            </div>

            {/* Carte */}
            <div className="container" style={{ zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7 col-sm-9">
                        <div
                            className="card border-0 shadow-lg"
                            style={{
                                borderRadius: "20px",
                                backdropFilter: "blur(10px)",
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                            }}
                        >
                            <div className="card-header bg-transparent border-0 text-center pt-4 pb-0">
                                <div className="mb-3">
                                    <div
                                        className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                                        style={{ width: "60px", height: "60px" }}
                                    >
                                        <i
                                            className="bi bi-key-fill text-white"
                                            style={{ fontSize: "1.5rem" }}
                                        />
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>
                                    Réinitialiser le mot de passe
                                </h2>
                                <p className="text-muted mb-0">
                                    Entrez votre email, recevez le code, puis définissez votre
                                    nouveau mot de passe
                                </p>
                            </div>

                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    {/* Email */}
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label fw-medium">
                                            Adresse email <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted" />
                      </span>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control border-start-0"
                                                placeholder="exemple@cosumar.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                style={{ borderColor: "#e9ecef" }}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-end mt-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={sendOtp}
                                                disabled={isSendingOtp}
                                                style={{ borderRadius: "10px" }}
                                            >
                                                {isSendingOtp ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" />
                                                        Envoi...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-send me-1" />
                                                        {otpSent ? "Renvoyer le code" : "Envoyer le code"}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* OTP */}
                                    <div className="mb-4">
                                        <label htmlFor="otp" className="form-label fw-medium">
                                            Code OTP <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-shield-lock text-muted" />
                      </span>
                                            <input
                                                type="text"
                                                id="otp"
                                                className="form-control border-start-0 text-center fw-bold"
                                                placeholder="000000"
                                                value={otp}
                                                onChange={(e) =>
                                                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                                                }
                                                maxLength="6"
                                                required
                                                style={{
                                                    borderColor: "#e9ecef",
                                                    fontSize: "1.2rem",
                                                    letterSpacing: "0.3rem",
                                                }}
                                            />
                                        </div>
                                        {otpSent && (
                                            <small className="text-muted">
                                                Un code a été envoyé à <strong>{email}</strong>
                                            </small>
                                        )}
                                    </div>

                                    {/* Nouveau mot de passe */}
                                    <div className="mb-4">
                                        <label
                                            htmlFor="newPassword"
                                            className="form-label fw-medium"
                                        >
                                            Nouveau mot de passe{" "}
                                            <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted" />
                      </span>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                className="form-control border-start-0"
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                style={{ borderColor: "#e9ecef" }}
                                            />
                                        </div>
                                    </div>

                                    {/* Confirmation */}
                                    <div className="mb-4">
                                        <label
                                            htmlFor="confirmPassword"
                                            className="form-label fw-medium"
                                        >
                                            Confirmer le mot de passe{" "}
                                            <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock-fill text-muted" />
                      </span>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                className="form-control border-start-0"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                style={{ borderColor: "#e9ecef" }}
                                            />
                                        </div>
                                    </div>

                                    {/* Bouton */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-3 fw-medium mb-4"
                                        disabled={isSubmitting}
                                        style={{
                                            borderRadius: "12px",
                                            background:
                                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            border: "none",
                                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                                            transition: "all 0.3s ease",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = "translateY(-2px)";
                                            e.target.style.boxShadow =
                                                "0 6px 20px rgba(102, 126, 234, 0.6)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = "translateY(0)";
                                            e.target.style.boxShadow =
                                                "0 4px 15px rgba(102, 126, 234, 0.4)";
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Réinitialisation...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-arrow-repeat me-2" />
                                                Réinitialiser
                                            </>
                                        )}
                                    </button>

                                    {/* Retour */}
                                    <div className="text-center">
                                        <Link
                                            to="/login"
                                            className="btn btn-link text-decoration-none fw-medium"
                                            style={{ color: "#667eea" }}
                                        >
                                            <i className="bi bi-arrow-left me-1" /> Retour à la
                                            connexion
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-4">
                            <p className="text-white opacity-75 mb-0">
                                ©️ 2024 Équipement IT - Système de gestion des demandes
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS animation */}
            <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .form-control:focus,
        .form-select:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
        }
        .input-group-text {
          border-color: #e9ecef !important;
        }
      `}</style>
        </div>
    );
};

export default ResetPassword;
