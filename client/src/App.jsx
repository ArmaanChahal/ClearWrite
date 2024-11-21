import "./App.css";
import MainPage from "./components/MainPage"; // Ensure this path matches your actual file
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import EvaluationPage from "./components/evaluationPage";

function App() {
  console.log("Rendering App Component");
  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<IntroPage />} /> */}
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/loading" element={<LoadingPage />} /> */}
        <Route path="/evaluation" element={<EvaluationPage />} />
      </Routes>
    </div>
  );
}
export default App;
