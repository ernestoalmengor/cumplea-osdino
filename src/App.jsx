import { HashRouter, Routes, Route } from "react-router-dom";
import Invitacion from "./Invitacion";
import Admin from "./Admin";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Invitacion />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
