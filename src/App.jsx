import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invitacion from "./Invitacion";
import Admin from "./Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Invitacion />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
