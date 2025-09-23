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

    const handleOtpSuccess = (userInfo) => {
        console.log("handleOtpSuccess - userInfo:", userInfo);
        // Rediriger selon le rôle de l'utilisateur
        if (userInfo?.role === 'SUPER_ADMIN' || userInfo?.role === 'Super Admin') {
            console.log("Redirection vers /admin pour Super Admin");
            navigate("/admin");
        } else if (userInfo?.role === 'Administrateur') {
            console.log("Redirection vers /validation pour Administrateur");
            navigate("/validation");
        } else {
            console.log("Redirection vers /dashboard pour rôle:", userInfo?.role);
            navigate("/dashboard");
        }
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
                console.log("Connexion directe - response:", response);
                // Rediriger selon le rôle de l'utilisateur
                const userRole = response.user?.role;
                console.log("Rôle utilisateur:", userRole);
                if (userRole === 'SUPER_ADMIN' || userRole === 'Super Admin') {
                    console.log("Redirection vers /admin pour Super Admin");
                    navigate("/admin");
                } else if (userRole === 'Administrateur') {
                    console.log("Redirection vers /validation pour Administrateur");
                    navigate("/validation");
                } else {
                    console.log("Redirection vers /dashboard pour rôle:", userRole);
                    navigate("/dashboard");
                }
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

            {/* Logo et lien vers la page d'accueil */}
            <div className="position-absolute" style={{ top: "30px", left: "40px", zIndex: 10 }}>
                <Link
                    to="/"
                    className="d-flex align-items-center text-decoration-none"
                    style={{ color: "white" }}
                >
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3"
                         style={{ width: "45px", height: "45px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                        <img src={assets.logo} alt="logo" height={28} width={28} />
                    </div>
                    <div>
                        <div className="fw-bold fs-5">Équipement IT</div>
                        <div className="fs-7 opacity-75">Système de demandes</div>
                    </div>
                </Link>
            </div>

            {/* Conteneur principal */}
            <div className="container" style={{ zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7 col-sm-9">
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
                                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                                         style={{ width: "60px", height: "60px" }}>
                                        <i className="bi bi-person-fill text-white" style={{ fontSize: "1.5rem" }}></i>
                                    </div>
                                </div>
                                <h2 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>
                                    {isCreateAccount ? "Créer un compte" : "Connexion"}
                                </h2>
                                <p className="text-muted mb-0">
                                    {isCreateAccount
                                        ? "Rejoignez notre système de gestion d'équipements"
                                        : "Accédez à votre espace personnel"}
                                </p>
                            </div>

                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    {/* Champs supplémentaires seulement pour création de compte */}
                                    {isCreateAccount && (
                                        <div className="mb-4">
                                            <div className="mb-3">
                                                <label htmlFor="fullName" className="form-label fw-medium">
                                                    Nom complet <span className="text-danger">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-person text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="fullName"
                                                        name="fullName"
                                                        className="form-control border-start-0"
                                                        placeholder="Entrez votre nom complet"
                                                        value={formData.fullName}
                                                        onChange={handleInputChange}
                                                        required={isCreateAccount}
                                                        style={{ borderColor: "#e9ecef" }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="service" className="form-label fw-medium">
                                                    Service <span className="text-danger">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-building text-muted"></i>
                                                    </span>
                                                    <select
                                                        id="service"
                                                        name="service"
                                                        className="form-select border-start-0"
                                                        value={formData.service}
                                                        onChange={handleInputChange}
                                                        required={isCreateAccount}
                                                        style={{ borderColor: "#e9ecef" }}
                                                    >
                                                        <option value="">Sélectionnez votre service</option>
                                                        <option value="Informatique">Informatique</option>
                                                        <option value="RH">Ressources Humaines</option>
                                                        <option value="Finance">Finance</option>
                                                        <option value="Production">Production</option>
                                                        <option value="Marketing">Marketing</option>
                                                        <option value="Commercial">Commercial</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="telephone" className="form-label fw-medium">
                                                    Téléphone <span className="text-danger">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-telephone text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="tel"
                                                        id="telephone"
                                                        name="telephone"
                                                        className="form-control border-start-0"
                                                        placeholder="06 12 34 56 78"
                                                        value={formData.telephone}
                                                        onChange={handleInputChange}
                                                        required={isCreateAccount}
                                                        style={{ borderColor: "#e9ecef" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label fw-medium">
                                            Adresse email <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-envelope text-muted"></i>
                                            </span>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control border-start-0"
                                                placeholder="exemple@cosumar.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderColor: "#e9ecef" }}
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-medium">
                                            Mot de passe <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-lock text-muted"></i>
                                            </span>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                className="form-control border-start-0"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderColor: "#e9ecef" }}
                                            />
                                        </div>
                                        {isCreateAccount && (
                                            <small className="text-muted">
                                                <i className="bi bi-info-circle me-1"></i>
                                                Le mot de passe doit contenir au moins 6 caractères
                                            </small>
                                        )}
                                    </div>

                                    {/* Lien mot de passe oublié */}
                                    {!isCreateAccount && (
                                        <div className="d-flex justify-content-end mb-4">
                                            <Link to="/reset-password" className="text-decoration-none text-primary fw-medium">
                                                Mot de passe oublié ?
                                            </Link>
                                        </div>
                                    )}

                                    {/* Bouton soumission */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-3 fw-medium mb-4"
                                        disabled={isSubmitting}
                                        style={{
                                            borderRadius: "12px",
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            border: "none",
                                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = "translateY(-2px)";
                                            e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = "translateY(0)";
                                            e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {isCreateAccount ? "Création en cours..." : "Connexion en cours..."}
                                            </>
                                        ) : (
                                            <>
                                                <i className={`bi ${isCreateAccount ? 'bi-person-plus' : 'bi-box-arrow-in-right'} me-2`}></i>
                                                {isCreateAccount ? "Créer mon compte" : "Se connecter"}
                                            </>
                                        )}
                                    </button>

                                    {/* Séparateur */}
                                    <div className="text-center mb-4">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1" style={{ height: "1px", background: "#e9ecef" }}></div>
                                            <span className="px-3 text-muted">ou</span>
                                            <div className="flex-grow-1" style={{ height: "1px", background: "#e9ecef" }}></div>
                                        </div>
                                    </div>

                                    {/* Texte pour basculer entre login et création */}
                                    <div className="text-center">
                                        <p className="mb-0 text-muted">
                                            {isCreateAccount ? "Vous avez déjà un compte ?" : "Vous n'avez pas de compte ?"}
                                            <button
                                                type="button"
                                                className="btn btn-link text-decoration-none fw-medium ms-1"
                                                onClick={() => setIsCreateAccount(!isCreateAccount)}
                                                style={{ color: "#667eea" }}
                                            >
                                                {isCreateAccount ? "Se connecter" : "Créer un compte"}
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-4">
                            <p className="text-white opacity-75 mb-0">
                                ©️ 2025 Équipement IT - Système de gestion des demandes
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
                
                .form-control:focus, .form-select:focus {
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

export default Login;