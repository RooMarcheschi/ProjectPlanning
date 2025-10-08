import './css/app.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChangePasswordForm from './components/login/changePasswordForm';
import ConfirmEtapas from './components/etapas/confirmEtapas';
import Form from './components/projectForm/form'
import Header from './components/header/header'
import LoginForm from './components/login/loginForm';
import LandingPage from './components/projects/landingPage';
import RegisterForm from './components/login/registerForm';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Header />
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/cargarProyecto' element={<Form />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/changePassword' element={<ChangePasswordForm />} />
          <Route path='/' element={<LandingPage />} />
          <Route path='/etapa/:id' element={<ConfirmEtapas/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
