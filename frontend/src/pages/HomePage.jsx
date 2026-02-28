import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Stethoscope, 
  HeartPulse, 
  Brain, 
  Baby, 
  Activity, 
  ScanFace 
} from "lucide-react";
import { ROUTES } from "@/utils/constants";
import { useGetDoctorsQuery } from "@/features/auth/authApi";

// --- MOCK DATA (Fallback for non-logged in users or if API is empty) ---
const mockTopDoctors = [
  {
    id: 1,
    name: "Dr. Richard James",
    specialty: "General Physician",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop",
    available: true,
  },
  {
    id: 2,
    name: "Dr. Emily Larson",
    specialty: "Gynecologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=500&auto=format&fit=crop",
    available: true,
  },
  {
    id: 3,
    name: "Dr. Sarah Patel",
    specialty: "Dermatologist",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=500&auto=format&fit=crop",
    available: true,
  },
  {
    id: 4,
    name: "Dr. Christopher Lee",
    specialty: "Pediatrician",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=500&auto=format&fit=crop",
    available: true,
  },
  {
    id: 5,
    name: "Dr. Jennifer Garcia",
    specialty: "Neurologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500&auto=format&fit=crop",
    available: true,
  },
];

const specialties = [
  { label: "General physician", icon: Stethoscope },
  { label: "Gynecologist", icon: HeartPulse },
  { label: "Dermatologist", icon: ScanFace },
  { label: "Pediatricians", icon: Baby },
  { label: "Neurologist", icon: Brain },
  { label: "Gastroenterologist", icon: Activity },
];

const Home = () => {
  const navigate = useNavigate();
  
  // Fetch doctors (This might fail if user is not logged in, depending on backend)
  const { 
    data: doctorsRes, 
    isLoading, 
    isError 
  } = useGetDoctorsQuery({ status: "active" });
  
  // Logic: If API has data, use it. If API errors (e.g. 401 Not Auth) or is empty, use Mock Data.
  const hasApiData = doctorsRes?.data && doctorsRes.data.length > 0;
  const displayDoctors = hasApiData ? doctorsRes.data : mockTopDoctors;
  
  // Only show loading state if we are loading AND we don't have mock data ready
  // (In this case, we always have mock data, so we can skip the loading spinner for a smoother UI if preferred, 
  // but keeping it for API realism is good practice)
  const showLoading = isLoading && !hasApiData; 

  const handleBookClick = (id) => {
    window.scrollTo(0, 0);
    navigate(`/appointment/${id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-24 font-[Plus_Jakarta_Sans]">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-indigo-50 rounded-[2.5rem] flex flex-col md:flex-row items-center relative overflow-hidden px-6 md:px-16 py-12 md:py-0 min-h-[580px] shadow-xl shadow-slate-200/60 border border-indigo-100/50">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 z-10 space-y-8 py-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-indigo-600 text-xs font-bold tracking-wide shadow-sm border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            #1 TOP RATED CLINIC
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] font-[Outfit] tracking-tight">
            Your Health, <br />
            <span className="text-indigo-600">Simplified.</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-md mx-auto md:mx-0 leading-relaxed">
            Connect with top-tier medical professionals in seconds. No waiting
            rooms, just exceptional care.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center md:justify-start">
            <Link
              to={ROUTES.REGISTER}
              className="h-14 px-10 rounded-full bg-indigo-600 text-white font-bold flex items-center gap-2 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1"
            >
              Book Now <ArrowRight size={20} />
            </Link>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
              <div className="flex -space-x-3 pl-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden"
                  >
                    <img
                      src={`https://randomuser.me/api/portraits/thumb/women/${i + 30}.jpg`}
                      className="h-full w-full object-cover"
                      alt="Reviewer"
                    />
                  </div>
                ))}
              </div>
              <span>2k+ Happy Patients</span>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 relative h-[400px] md:h-full flex items-end justify-center md:justify-end">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-60 mix-blend-overlay"></div>

          <img
            src="https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-young-afro-professional-doctor-png-image_10148632.png"
            alt="Friendly Doctor"
            className="relative z-10 w-auto h-full max-h-[550px] object-contain object-bottom drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </section>

      {/* --- SPECIALTY SECTION --- */}
      <section className="text-center space-y-10">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Outfit]">
            Find by Specialty
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-lg">
            Simply browse through our extensive list of trusted doctors.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {specialties.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center gap-4 cursor-pointer group"
                onClick={() => navigate(`/doctors`)}
              >
                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-indigo-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:-translate-y-2 transition-all duration-300">
                  <Icon size={32} className="text-slate-400 group-hover:text-indigo-600 transition-colors" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- TOP DOCTORS GRID --- */}
      <section className="text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Outfit]">
            Top Doctors to Book
          </h2>
          <p className="text-slate-500 text-lg">
            Highly qualified professionals available for immediate booking.
          </p>
        </div>

        {/* 
            LOGIC: 
            1. If Loading AND no mock data fallback desired -> Show Skeletons.
            2. Else show Data (API or Mock).
        */}
        {showLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {[1,2,3,4,5].map(i => (
                 <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse border border-slate-200" />
              ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {displayDoctors.slice(0, 10).map((doc) => (
              <div
                key={doc._id || doc.id}
                onClick={() => handleBookClick(doc._id || doc.id)}
                className="group bg-white border border-slate-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="bg-indigo-50 h-60 flex items-end justify-center relative overflow-hidden">
                  <img
                    src={doc.image || doc.avatar?.url}
                    alt={doc.name}
                    className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors duration-300" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Available</span>
                  </div>
                </div>
                
                <div className="p-5 text-left">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors font-[Outfit] line-clamp-1">
                    {doc.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    {doc.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4">
          <Link
            to="/doctors"
            className="inline-block bg-indigo-50 text-indigo-600 px-12 py-4 rounded-full font-bold hover:bg-indigo-100 hover:scale-105 transition-all duration-300"
            onClick={() => window.scrollTo(0,0)}
          >
            Browse All Doctors
          </Link>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="bg-indigo-600 rounded-[2.5rem] flex flex-col md:flex-row items-center px-6 md:px-20 py-16 md:py-0 min-h-[450px] relative overflow-hidden shadow-2xl shadow-indigo-900/20">
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="md:w-1/2 space-y-8 z-10 py-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight font-[Outfit]">
            Book Appointment <br /> With{" "}
            <span className="text-indigo-200">100+ Trusted Doctors</span>
          </h2>
          <p className="text-indigo-100 text-lg max-w-md mx-auto md:mx-0">
             Create an account today to access AI-powered health tracking and instant specialist bookings.
          </p>
          <div className="pt-2">
            <Link to={ROUTES.REGISTER}>
              <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold hover:scale-105 hover:shadow-xl transition-all shadow-lg active:scale-95">
                Create Account
              </button>
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 relative h-full flex items-end justify-center md:justify-end mt-12 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop"
            alt="Doctor Pointing"
            className="w-[320px] lg:w-[420px] object-contain md:absolute bottom-0 drop-shadow-2xl transition-transform hover:-translate-y-2 duration-500"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;