import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* /projects redirects home — projects are now section 02 */}
        <Route path="/projects" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;