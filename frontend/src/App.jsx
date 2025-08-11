
import './App.css'
import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const App = () => {
  return (
      <div>
        <ToastContainer/>
        <Routes>
          <Route path="/" element={ <Home/>} ></Route>
          <Route path="/login" element={ <Login/>}></Route>
          <Route path="/email-verify" element={ <EmailVerify/>}></Route>
          <Route path="/reset-password" element={ <ResetPassword/>}></Route>


        </Routes>
      </div>
  )
}

export default App
