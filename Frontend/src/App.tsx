import { Route,Routes} from "react-router-dom"
import Auth from "./pages/Auth"
import Project from "./pages/Project"
import {IsLogin,IsLogout} from "./util/IsLogin"
import {Toaster} from 'react-hot-toast';
import { useEffect } from "react";
import { AppProvider } from "./lib/AppContext";

const App = () => {
  useEffect(() => {
    const defaultTheme = "theme_purple_light light";
    const storedTheme = localStorage.getItem("Theme") ?? defaultTheme;

    localStorage.setItem("Theme", storedTheme);
    document.body.className = storedTheme;
  }, []);

  return (
    <>
    <AppProvider>
      <Toaster/>
        <Routes>
          <Route path="/" element={<IsLogin><Project /></IsLogin>} />
          <Route path="/auth" element={<IsLogout><Auth /></IsLogout>} />
        </Routes>
    </AppProvider>
    </>
  )
}

export default App