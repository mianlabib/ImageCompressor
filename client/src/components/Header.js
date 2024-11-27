import React, { useState } from 'react';
import { FaCompressAlt } from 'react-icons/fa'; // Adding a compression icon for the logo

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 transition-all duration-300 md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={toggleSidebar} // Close sidebar when overlay is clicked
      >
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform transition-all duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={toggleSidebar} // Close sidebar when X button is clicked
              className="text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col items-center space-y-4 p-4">
            <a href="#tools" className="text-gray-700 hover:text-blue-600">Tools</a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav className="w-full bg-blue-600 shadow-md p-4"> {/* Changed background color to blue */}
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Left side logo */}
          <div className="flex items-center space-x-2">
            <FaCompressAlt className="text-white text-3xl" /> {/* Changed icon color to white */}
            <h1 className="text-2xl font-bold text-white">Image Compressor</h1> {/* Changed text color to white */}
          </div>

          {/* Right side navigation links (desktop) */}
          <div className="space-x-8 hidden md:flex">
            <a href="#tools" className="text-white hover:text-blue-200 transition duration-300">Tools</a> {/* Changed text color to white */}
            <a href="#pricing" className="text-white hover:text-blue-200 transition duration-300">Pricing</a> {/* Changed text color to white */}
            <a href="#about" className="text-white hover:text-blue-200 transition duration-300">About</a> {/* Changed text color to white */}
            <a href="#contact" className="text-white hover:text-blue-200 transition duration-300">Contact</a> {/* Changed text color to white */}
          </div>

          {/* Mobile Menu (Hamburger Icon) */}
          <div className="md:hidden">
            <button
              onClick={toggleSidebar} // Open the sidebar when hamburger icon is clicked
              className="text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
