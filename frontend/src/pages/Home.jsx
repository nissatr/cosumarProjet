import Menubar from "../components/Menubar.jsx";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-content-center min-vh-100" >
            <Menubar/>
            <Header/>
            
            {/* Bouton pour accéder au dashboard */}
            <div className="text-center mt-4">
                <button 
                    className="btn btn-outline-primary rounded-pill px-4 py-2"
                    onClick={() => navigate('/dashboard')}
                >
                    Accéder au Dashboard
                </button>
            </div>
        </div>
    )
}
export default Home;