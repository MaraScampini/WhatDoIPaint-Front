import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import NavBar from "./components/NavBar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Feed from "./pages/Feed"
import ErrorTooltip from "./components/ErrorTooltip"
import AddProject from "./pages/AddProject"
import HelpMeChoose from "./pages/HelpMeChoose"
import ProjectFeed from "./pages/ProjectFeed"
import UpdateDetail from "./pages/UpdateDetail"
import AddElements from "./pages/AddElements"
import AddUpdate from "./pages/AddUpdate"

function App() {

  return (
    <div className="bg-darkBg min-h-screen flex flex-col overflow-x-hidden">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/create" element={<AddProject />} />
          <Route path="/help-me-choose" element={<HelpMeChoose />} />
          <Route path="/project/:projectId" element={<ProjectFeed />} />
          <Route path="/update/:updateId" element={<UpdateDetail />} />
          <Route path="/element/add/:projectId" element={<AddElements />} />
          <Route path="/update/add/:projectId" element={<AddUpdate/>}/>
        </Routes>
      </BrowserRouter>
      <ErrorTooltip />
    </div>
  )
}

export default App
