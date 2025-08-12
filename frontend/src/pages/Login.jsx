import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = () => {
    const [isCreateAccount, setIsCreateAccount] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
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
                 </Link>
            </div>

            {/* Carte contenant le formulaire */}
            <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">
                    {isCreateAccount ? "Create Account" : "Login"}
                </h2>

                <form onSubmit={onSubmitHandler}>
                    {/* Champs supplémentaires seulement pour création de compte */}
                    {isCreateAccount && (
                        <div className="mb-3">
                            <label htmlFor="Name" className="form-label">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                className="form-control"
                                placeholder="Enter your name"
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="first Name" className="form-label">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                className="form-control"
                                placeholder="Enter fullname"
                                required
                                onChange={(e) => setfirstName(e.target.value)}
                            />

                            <label
                                htmlFor="service"
                                className="form-label "
                                style={{color: "#4A4A4A"}}
                            >
                                Service
                            </label>
                            <select
                                id="service"
                                className="form-select"
                                required
                            >
                                <option value="">Sélectionnez votre service</option>
                                <option>RH</option>
                                <option>IT</option>
                                <option>Finance</option>
                                <option>Production</option>
                            </select>

                            <div className="mb-3 mt-3">
                                <label
                                    htmlFor="telephone"
                                    className="form-label"
                                >
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    id="telephone"
                                    className="form-control"
                                    placeholder="01 23 45 67 89"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email Id
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="form-control"
                            placeholder="Enter email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="********"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    {/* Lien mot de passe oublié */}
                    <div className="d-flex justify-content-between mb-3">
                        <Link to="/reset-password" className="text-decoration-none">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Bouton soumission */}
                    <button type="submit" className="btn btn-primary w-100">
                        {isCreateAccount ? "Sign Up" : "Login"}
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
