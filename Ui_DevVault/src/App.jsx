import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard.jsx";
import LandingPage from "./Components/LandingPage.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { verifyUser } from "./Store/Authantication/authenticationSlice.js";
import LoadingPage from "./Components/LoadingPage.jsx";
export default function App() {
  const{isVerifyingUser}=useSelector(state=>state.authenticationSlice)
  const dispatch = useDispatch();
  useEffect(()=>{
      dispatch(verifyUser())
    },[])
  return (
    <Router>
      <Routes>
        <Route path="/" element={isVerifyingUser?<LandingPage />:<LandingPage/>}/>
        <Route path="/dashboard" element={ isVerifyingUser?<LoadingPage />:<Dashboard/>} />
      </Routes>
    </Router>
  );
}
