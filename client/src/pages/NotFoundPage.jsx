import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 relative overflow-hidden">

      {/* Blurry Background Balls */}
      <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-3xl -top-10 -left-16 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-purple-600/20 rounded-full blur-3xl bottom-10 -right-16 animate-pulse delay-200"></div>

      {/* Floating 404 Text */}
      <h1 className="text-[120px] sm:text-[160px] font-extrabold text-white/10 select-none tracking-widest absolute top-10 animate-fadeIn">
        404
      </h1>

      {/* Main Card */}
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center max-w-md text-center animate-slideUp">
        
        <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4 animate-floating">
          <span className="text-4xl">🧭</span>
        </div>

        <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Oops! The page you’re looking for doesn’t exist or has been moved.
          Let’s get you back to safety.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium shadow-lg"
        >
          Go Home
        </Link>
      </div>

      {/* Small Note */}
      <p className="absolute bottom-8 text-gray-400 text-sm">
        Made with ❤️ by NexManage
      </p>

      {/* Animations */}
      <style>{`
        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-floating {
          animation: floating 3s ease-in-out infinite;
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1.4s ease forwards;
        }
      `}</style>
    </div>
  );
}
