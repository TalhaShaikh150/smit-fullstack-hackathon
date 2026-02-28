import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 mt-20 pb-10">
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12">
        {/* Left Column: Brand & Desc */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-bold text-slate-900">
              HealthStack
            </span>
          </Link>
          <p className="text-slate-500 leading-relaxed text-sm max-w-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Middle Column: Company */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-900 text-lg">COMPANY</h3>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li>
              <Link to="/" className="hover:text-indigo-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-600">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-600">
                Contact us
              </Link>
            </li>
            <li>
              <Link to="/policy" className="hover:text-indigo-600">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column: Contact */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-900 text-lg">GET IN TOUCH</h3>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li>+1-212-456-7890</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="container mx-auto px-4">
        <div className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          Copyright © 2024 GreatStack.dev - All Right Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
