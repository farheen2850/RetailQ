import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import ListComponent from "./components/ListComponent";
import SignIn from "./components/SignIn";
import Navbar from "./components/NavBar";
import './App.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleSetToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <ChakraProvider>
      <Router>
        <Box className="app-container">
          <Navbar onLogout={handleLogout} />
          <Box className="app-content">
            <Routes>
              <Route
                path="/signin"
                element={!token ? <SignIn setToken={handleSetToken} /> : <Navigate to="/list" />}
              />
              <Route
                path="/list"
                element={token ? <ListComponent /> : <Navigate to="/signin" />}
              />
              <Route path="/" element={<Navigate to="/signin" />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;
