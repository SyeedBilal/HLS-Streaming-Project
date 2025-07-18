import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const { auth } = useContext(AuthContext);
  if (!auth.loggedIn) return null;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto border border-gray-100 backdrop-blur-sm">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img 
            src={auth.profilePicture} 
            alt="Profile" 
            className="w-12 h-12 rounded-full object-cover border-2 border-gradient-to-r from-blue-500 to-purple-500 shadow-md transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
        </div>
        <div className="flex-1">
          <span className="text-lg font-semibold text-gray-800 block leading-tight">
            Welcome, {auth.userName}
          </span>
          <span className="text-sm text-gray-500">Online now</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link 
          to={'/videoUpload'}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
        >
          <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Upload Video</span>
        </Link>

        <a 
          href="http://localhost:3000/logout"
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group border border-gray-200 hover:border-gray-300"
        >
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log Out</span>
        </a>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-10 translate-x-10 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full translate-y-8 -translate-x-8 blur-lg"></div>
    </div>
  );
}