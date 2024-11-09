import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Chat from "./pages/Room";

import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="overflow-hidden">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/chat" element={<Chat />}></Route>
          <Route path="/product/:id" element={<ProductDetails />}>
          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
