// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-700 p-6">
      <div className="text-center  text-gray-100">
        <p>&copy; 2024 Image Compressor. All rights reserved.</p>
        <div className="mt-4 text-sm">
          <a href="#privacy" className="text-blue-600 hover:text-blue-800 transition duration-300 mx-2">Privacy Policy</a>
          <a href="#terms" className="text-blue-600 hover:text-blue-800 transition duration-300 mx-2">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
