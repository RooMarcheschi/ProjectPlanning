import './css/app.css'
import Header from './components/header/header'
import Form from './components/form/form'
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <>
      <Header />
      <Form />
      <ToastContainer />
    </>
  )
}

export default App
