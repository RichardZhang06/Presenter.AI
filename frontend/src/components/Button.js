// src/components/Button.js
import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ to, text }) => {
  return (
    <Link to={to}>
      <button className="bg-blue-600 text-white px-6 py-3 mt-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
        {text}
      </button>
    </Link>
  );
};

export default Button;
