import './css/app.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChangePasswordForm from './components/login/changePasswordForm';
import Form from './components/projectForm/form'
import Header from './components/header/header'
import LoginForm from './components/login/loginForm';
import LandingPage from './components/projects/landingPage';
import ProtectedRoute from './components/login/protectedRoute';
import PublicRoute from './components/login/publicRoute';
import RegisterForm from './components/login/registerForm';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Header />
      <ToastContainer />
      <Router>
        <Routes>

          <Route path='/login' element={
            <PublicRoute children={<LoginForm />} />
          } />
          <Route path='/register' element={
            <PublicRoute children={<RegisterForm />} />
          } />
          <Route path='/changePassword' element={
            <PublicRoute children={<ChangePasswordForm />} />
          } />

          <Route path='/cargarProyecto' element={
            <ProtectedRoute children={<Form />} />
          } />
          <Route path='/' element={
            <ProtectedRoute children={<LandingPage />} />
          } />
        </Routes>
      </Router>
    </>
  )
}

export default App
