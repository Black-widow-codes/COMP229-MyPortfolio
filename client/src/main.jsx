import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { About, Contact, Education, Home, Layout, Projects, Services } from "./App.jsx";

// Create the React root and render the portfolio application
const root = createRoot(document.getElementById("root"));
root.render(
	<StrictMode>
		<BrowserRouter>
		{/* Define routes for each of the six portfolio pages */}
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/projects" element={<Projects />} />
					<Route path="/education" element={<Education />} />
					<Route path="/services" element={<Services />} />
					<Route path="/contact" element={<Contact />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);