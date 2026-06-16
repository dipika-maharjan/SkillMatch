import { Link } from "react-router-dom";
import {
  Briefcase,
  FileText,
  Lightbulb,
  Users,
} from "lucide-react";
import hero from "../assets/hero-image.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50 min-h-screen">
        <Navbar/>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Image */}
          <div>
            <img src={hero} alt="Hero" className="w-full rounded-2xl shadow-lg mr-16" />
          </div>

          {/* Right Column - Hero Content */}
          <div className="lg:pt-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Find opportunities that match your{" "}
              <span className="text-indigo-500">skills and ambition.</span>
            </h1>
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              Upload your resume and get personalized job matches, skill insights
              and suggestions to grow your career
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-7 rounded-lg transition text-center"
              >
                Get Started
              </Link>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-2.5 px-7 rounded-lg transition text-sm">
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Job Matching */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Job Matching</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Find jobs that fit your skills and goals.
            </p>
          </div>

          {/* Feature 2: Resume Analysis */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Resume Analysis</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Get AI powered feedback and improve your profile for recruiters.
            </p>
          </div>

          {/* Feature 3: Career Guidance */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Career Guidance</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Personalized tips and roadmaps to grow your career efficiently.
            </p>
          </div>

          {/* Feature 4: Fresher Friendly */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Fresher Friendly</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Curated opportunities specifically for early career talents.
            </p>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
