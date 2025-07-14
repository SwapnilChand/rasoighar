import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./style.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
