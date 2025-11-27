import './css/app.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChangePasswordForm from './components/login/changePasswordForm';
import { EtapasProvider } from './contexts/etapasContext';
import Form from './components/projectForm/form'
import Header from './components/header/header'
import LoginForm from './components/login/loginForm';
import LandingPage from './components/landingPage/landingPage';
import MyProjects from './components/projects/myProjects';
import Project from './components/projects/project';
import ProtectedRoute from './components/login/protectedRoute';
import PublicRoute from './components/login/publicRoute';
import RegisterForm from './components/login/registerForm';
import { ToastContainer } from "react-toastify";
import AllProjects from './components/projects/allProjects';
import MisCompromisos from './components/compromisos/misCompromisos';
import ConsultasDashboard from './components/consultas/consultasDashboard'; 
import AllObservations from './components/observaciones/allObservations';

const App = () => {
  return (
    <EtapasProvider>
      <Header />
      <ToastContainer />
      <Router>
        <Routes>
          {/* Rutas sin inicio de sesión*/}
          <Route path='/login' element={
            <PublicRoute children={<LoginForm />} />
          } />
          {/* <Route path='/register' element={
            <PublicRoute children={<RegisterForm />} />
          } />
          <Route path='/changePassword' element={
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
          } />
          <Route path='/project/:id' element={
            <ProtectedRoute children={<Project />} />
          } />
          <Route path='/allProjects' element={
            <ProtectedRoute children={<AllProjects />} />
          } />
          <Route path='/misCompromisos' element={
            <ProtectedRoute children={<MisCompromisos />} />
          } />
          <Route path='/consultas' element={
            <ProtectedRoute children={<ConsultasDashboard />} />
          } />
          <Route path='/misObservaciones' element={
            <ProtectedRoute children={<AllObservations />} />
          } />
        </Routes>
      </Router>
    </EtapasProvider>
  )
}

export default App
