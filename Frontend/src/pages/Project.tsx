import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatComp from "../components/ChatComp";
const Project = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="h-screen w-full bg-transparent flex flex-col ">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
      <div className="flex-1 bg-amber-50 flex flex-row ">
        {isSidebarOpen && <Sidebar/>}
        <ChatComp />
      </div>
    </div>
  )
}

export default Project