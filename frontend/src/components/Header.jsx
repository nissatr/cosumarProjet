import { assets } from "../assets/assets.js";

const steps = [
    { num: 1, title: "Demandeur", desc: "Création de la demande", icon: "👤" },
    { num: 2, title: "Manager N+1", desc: "Validation hiérarchique", icon: "👥" },
    { num: 3, title: "Support IT", desc: "Analyse technique", icon: "⚙️" },
    { num: 4, title: "SI", desc: "Validation système", icon: "🧑🏻‍💻" },
    { num: 5, title: "Administration", desc: "Approbation finale", icon: "🏢" },
];

const Header = () => {
    return (
        <>
            {/* Section d'accueil */}
            <div
                className="d-flex flex-column align-items-center justify-content-center text-center py-5 px-3"
                style={{
                    minHeight: "80vh",
                    background:
                        "linear-gradient(135deg, rgba(74,144,226,0.85), rgba(123,97,255,0.85))",
                    color: "#f9fafb",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderRadius: "12px",
                    margin: "20px",
                    boxShadow: "0 12px 30px rgba(123,97,255,0.3)",
                }}
            >
                <img
                    src={assets.header}
                    alt="header"
                    width={140}
                    className="mb-4"
                    style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.25))" }}
                />



                <h1
                    className="fw-bold display-5 mb-3"
                    style={{
                        animation: "fadeInUp 1.3s ease forwards",
                        maxWidth: "650px",
                        color: "#eef2ff",
                    }}
                >
                    Vos équipements, à portée de clic
                </h1>

                <p
                    className="fs-5 mb-4"
                    style={{
                        maxWidth: "520px",
                        opacity: 0.85,
                        animation: "fadeInUp 1.6s ease forwards",
                        color: "#d1d5db",
                    }}
                >
                    Demandez vos équipements informatiques en quelques clics. Simple, rapide et 100% digital.
                </p>

                <button
                    className="btn rounded-pill px-5 py-2 fw-semibold shadow"
                    style={{
                        background:
                            "linear-gradient(90deg, #7B61FF 0%, #4A90E2 100%)",
                        color: "white",
                        boxShadow: "0 10px 20px rgba(123,97,255,0.5)",
                        border: "none",
                        transition: "all 0.35s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            "linear-gradient(90deg, #4A90E2 0%, #7B61FF 100%)";
                        e.currentTarget.style.boxShadow =
                            "0 14px 25px rgba(123,97,255,0.7)";
                        e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                            "linear-gradient(90deg, #7B61FF 0%, #4A90E2 100%)";
                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(123,97,255,0.5)";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    Faire une demande
                </button>
            </div>

            {/* Section processus de validation */}
            <div
                className="py-5"
                style={{ backgroundColor: "#f9fafb", borderRadius: "12px", margin: "20px" }}
            >
                <div className="container text-center">
                    <h2
                        className="fw-bold mb-3"
                        style={{ color: "#4A90E2", fontWeight: "700" }}
                    >
                        Processus de validation
                    </h2>
                    <p
                        className="text-muted mb-5"
                        style={{ maxWidth: "600px", margin: "0 auto", color: "#6B7280" }}
                    >
                        Votre demande suit un workflow structuré en 5 étapes
                    </p>

                    <div className="row justify-content-center g-4">
                        {steps.map(({ num, title, desc, icon }) => (
                            <div key={num} className="col-6 col-md-2">
                                <div
                                    className="p-4 bg-white rounded-4 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center"
                                    style={{
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        boxShadow:
                                            "0 5px 15px rgba(123,97,255,0.1), 0 2px 5px rgba(74,144,226,0.1)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-10px)";
                                        e.currentTarget.style.boxShadow =
                                            "0 15px 35px rgba(123,97,255,0.25), 0 5px 15px rgba(74,144,226,0.25)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                            "0 5px 15px rgba(123,97,255,0.1), 0 2px 5px rgba(74,144,226,0.1)";
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "3rem",
                                            marginBottom: "0.8rem",
                                            userSelect: "none",
                                        }}
                                    >
                                        {icon}
                                    </div>
                                    <h6 className="fw-bold mb-1" style={{ color: "#2C2C2C" }}>
                                        {title}
                                    </h6>
                                    <small className="text-muted" style={{ color: "#6B7280" }}>
                                        {desc}
                                    </small>
                                </div>
                                <div
                                    className="badge rounded-circle d-flex align-items-center justify-content-center mx-auto mt-3"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        fontWeight: "700",
                                        fontSize: "1.25rem",
                                        backgroundColor: "#7B61FF",
                                        color: "white",
                                        boxShadow: "0 4px 10px rgba(123,97,255,0.4)",
                                    }}
                                >
                                    {num}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <footer
                        className="mt-5 pt-4 border-top text-center"
                        style={{ fontSize: "0.9rem", color: "#6B7280" }}
                    >
                        <p className="mb-1">© 2025 Cosumar. Développé par NissAtr et dnsaad</p>
                        <p className="mb-0">Support : it-support@cosumar.co.ma</p>
                    </footer>
                </div>
            </div>

            {/* Animations CSS */}
            <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </>
    );
};

export default Header;
