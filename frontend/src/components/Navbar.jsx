import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-lg font-bold text-gray-900">
            SkillMatch
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              to="/"
              className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Home
            </Link>
            <a
              href="#"
              className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Jobs
            </a>
            <a
              href="#"
              className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
            >
              How it Works
            </a>
            <a
              href="#"
              className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
            >
              About
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
