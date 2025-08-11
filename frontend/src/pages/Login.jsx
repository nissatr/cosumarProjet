import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../services/api.js";
import { toast } from "react-toastify";
import OtpVerification from "../components/OtpVerification.jsx";

const Login = () => {
    const [isCreateAccount, setIsCreateAccount] = useState(false);
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
        service: "",
        telephone: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOtpSuccess = () => {
        navigate("/dashboard");
    };

    const handleOtpCancel = () => {
        setShowOtpVerification(false);
        setLoginEmail("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isCreateAccount) {
            // Validation pour la création de compte
            if (!formData.fullName || !formData.email || !formData.password || !formData.service || !formData.telephone) {
                toast.error("Veuillez remplir tous les champs obligatoires");
                return;
            }

            if (formData.password.length < 6) {
                toast.error("Le mot de passe doit contenir au moins 6 caractères");
                return;
            }

            setIsSubmitting(true);

            try {
                console.log("Tentative de création de compte avec:", {
                    fullName: formData.fullName,
                    email: formData.email,
                    service: formData.service,
                    telephone: formData.telephone
                });

                const response = await authService.register({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    service: formData.service,
                    telephone: formData.telephone
                });

                console.log("Réponse du serveur:", response);

                if (response.success) {
                    toast.success("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
                    // Basculer vers le mode login
                    setIsCreateAccount(false);
                    // Réinitialiser le formulaire
                    setFormData({
                        email: "",
                        password: "",
                        fullName: "",
                        service: "",
                        telephone: ""
                    });
                } else {
                    toast.error(response.message || "Erreur lors de la création du compte");
                }
            } catch (error) {
                console.error("Erreur détaillée:", error);
                toast.error(error.message || "Erreur lors de la création du compte. Vérifiez que le backend est démarré.");
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        // Validation pour le login
        if (!formData.email || !formData.password) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });

            if (response.success && response.requiresOtp) {
                setLoginEmail(formData.email);
                setShowOtpVerification(true);
                if (response.isFirstLogin) {
                    toast.info("Première connexion - Code OTP envoyé par email");
                } else {
                    toast.info("Code OTP envoyé par email");
                }
            } else if (response.success) {
                toast.success("Connexion réussie !");
                navigate("/dashboard");
            }
        } catch (error) {
            toast.error(error.message || "Erreur lors de la connexion");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Si on affiche la vérification OTP
    if (showOtpVerification) {
        return (
            <OtpVerification 
                email={loginEmail}
                onSuccess={handleOtpSuccess}
                onCancel={handleOtpCancel}
            />
        );
    }

    return (
        <div
            className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
            style={{
                background: "linear-gradient(90deg, #6a5af9 , #8268f9)",
                border: "none",
            }}
        >
            {/* Logo et lien vers la page d'accueil */}
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "30px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Link
                    to="/"
                    style={{
                        display: "flex",
                        gap: 5,
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: "24px",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    <img src={assets.logo} alt="logo" height={32} width={32} />
                    <span className="fw-bold fs-4 text-light">Authify</span>
                </Link>
            </div>

            {/* Carte contenant le formulaire */}
            <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">
                    {isCreateAccount ? "Create Account" : "Login"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Champs supplémentaires seulement pour création de compte */}
                    {isCreateAccount && (
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">
                                Full Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                className="form-control"
                                placeholder="Enter fullname"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required={isCreateAccount}
                            />

                            <label
                                htmlFor="service"
                                className="form-label "
                                style={{ color: "#4A4A4A" }}
                            >
                                Service <span className="text-danger">*</span>
                            </label>
                            <select
                                id="service"
                                name="service"
                                className="form-select"
                                value={formData.service}
                                onChange={handleInputChange}
                                required={isCreateAccount}
                            >
                                <option value="">Sélectionnez votre service</option>
                                <option value="RH">RH</option>
                                <option value="IT">IT</option>
                                <option value="Finance">Finance</option>
                                <option value="Production">Production</option>
                            </select>

                            <div className="mb-3 mt-3">
                                <label
                                    htmlFor="telephone"
                                    className="form-label"
                                >
                                    Téléphone <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="telephone"
                                    name="telephone"
                                    className="form-control"
                                    placeholder="01 23 45 67 89"
                                    value={formData.telephone}
                                    onChange={handleInputChange}
                                    required={isCreateAccount}
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email Id <span className="text-danger">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password <span className="text-danger">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        {isCreateAccount && (
                            <small className="text-muted">Le mot de passe doit contenir au moins 6 caractères</small>
                        )}
                    </div>

                    {/* Lien mot de passe oublié */}
                    {!isCreateAccount && (
                        <div className="d-flex justify-content-between mb-3">
                            <Link to="/reset-password" className="text-decoration-none">
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    {/* Bouton soumission */}
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {isCreateAccount ? "Création en cours..." : "Connexion en cours..."}
                            </>
                        ) : (
                            isCreateAccount ? "Sign Up" : "Login"
                        )}
                    </button>

                    {/* Texte pour basculer entre login et création */}
                    <div className="text-center mt-3">
                        <p className="mb-0">
                            {isCreateAccount ? (
                                <>
                                    Already have an account?{" "}
                                    <span
                                        className="text-decoration-underline"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setIsCreateAccount(false)}
                                    >
                                        Login here
                                    </span>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{" "}
                                    <span
                                        className="text-decoration-underline"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setIsCreateAccount(true)}
                                    >
                                        Sign up
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
