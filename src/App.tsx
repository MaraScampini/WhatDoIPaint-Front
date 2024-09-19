import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import NavBar from "./components/NavBar"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {

  return (
    <div className="bg-darkBg min-h-screen flex flex-col">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
