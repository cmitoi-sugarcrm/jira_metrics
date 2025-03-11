import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-semibold">Jira Metrics</h1>
        <div>
          <Link to="/" className="text-gray-300 hover:text-white px-4">Dashboard</Link>
          <Link to="/insights" className="text-gray-300 hover:text-white px-4">Insights</Link>
          <Link to="/settings" className="text-gray-300 hover:text-white px-4">Settings</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
