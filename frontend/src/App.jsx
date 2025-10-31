import './css/app.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChangePasswordForm from './components/login/changePasswordForm';
import Form from './components/projectForm/form'
import Header from './components/header/header'
import LoginForm from './components/login/loginForm';
import LandingPage from './components/landingPage/landingPage';
import MyProjects from './components/projects/myProjects';
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
          {/* Rutas sin inicio de sesión*/}
          <Route path='/login' element={
            <PublicRoute children={<LoginForm />} />
          } />
          <Route path='/register' element={
            <PublicRoute children={<RegisterForm />} />
          } />
          {/* <Route path='/changePassword' element={
            <PublicRoute children={<ChangePasswordForm />} />
          } /> */}


          {/* Rutas con inicio de sesión*/}
          <Route path='/cargarProyecto' element={
            <ProtectedRoute children={<Form />} />
          } />
          <Route path='/' element={
            <ProtectedRoute children={<LandingPage />} />
          } />
          <Route path='/myProjects' element={
            <ProtectedRoute children={<MyProjects />} />
          }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
