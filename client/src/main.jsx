
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";

import {
  About,
  Contact,
  Education,
  Home,
  Layout,
  Projects,
  Services
} from "./App.jsx";

import Signin from "./Signin.jsx";
import Signup from "./Signup.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Original portfolio pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/education" element={<Education />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Administrator dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
