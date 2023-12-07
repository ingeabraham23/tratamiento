// eslint-disable-next-line no-unused-vars
import { useState } from "react";

import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Medicamentos from "./components/Medicamentos";
import Receta from "./components/Receta";

function App() {
  return (
    <HashRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Medicamentos />} />
          <Route path="/receta" element={<Receta />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
