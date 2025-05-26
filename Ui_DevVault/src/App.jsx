import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard.jsx";
import LandingPage from "./Components/LandingPage.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { verifyUser } from "./Store/Authantication/authenticationSlice.js";
export default function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
      dispatch(verifyUser())
    },[])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
