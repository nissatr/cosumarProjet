
import './App.css'
import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NouvelleDemande from "./pages/NouvelleDemande.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
      <div>
        <ToastContainer/>
        <Routes>
          <Route path="/" element={ <Home/>} ></Route>
          <Route path="/login" element={ <Login/>}></Route>
          <Route path="/email-verify" element={ <EmailVerify/>}></Route>
          <Route path="/reset-password" element={ <ResetPassword/>}></Route>
          
          {/* Routes protégées */}
          <Route path="/dashboard" element={ 
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }></Route>
          <Route path="/nouvelle-demande" element={ 
            <ProtectedRoute>
              <NouvelleDemande/>
            </ProtectedRoute>
          }></Route>
          <Route path="/admin" element={ 
            <ProtectedRoute>
              <AdminPanel/>
            </ProtectedRoute>
          }></Route>
        </Routes>
      </div>
  )
}

export default App
