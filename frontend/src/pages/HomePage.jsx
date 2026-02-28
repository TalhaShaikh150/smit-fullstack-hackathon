import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";

// Mock Data for Doctors
const topDoctors = [
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

const Home = () => {
  return (
    // Cleaned up Main Container: Removed nested divs, fixed padding
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-24">
      
    {/* --- HERO SECTION: SOFT CLINICAL --- */}
<section className="bg-indigo-50 rounded-3xl flex flex-col md:flex-row items-center relative overflow-hidden px-6 md:px-16 py-12 md:py-0 min-h-[550px] shadow-xl shadow-slate-200/60">
  
  {/* Left Content */}
  <div className="w-full md:w-1/2 z-10 space-y-8 py-8 text-center md:text-left">
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-indigo-600 text-xs font-bold tracking-wide shadow-sm border border-indigo-100">
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
      Connect with top-tier medical professionals in seconds. No waiting rooms, just exceptional care.
    </p>

    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
      <Link 
        to={ROUTES.REGISTER} 
        className="h-14 px-10 rounded-full bg-indigo-600 text-white font-bold flex items-center gap-2 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-300"
      >
        Book Now <ArrowRight size={20} />
      </Link>
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
             <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://randomuser.me/api/portraits/thumb/women/${i+30}.jpg`} className="h-full w-full object-cover"/>
             </div>
          ))}
        </div>
        <span>2k+ Happy Patients</span>
      </div>
    </div>
  </div>

  {/* Right Content */}
  <div className="w-full md:w-1/2 relative h-[400px] md:h-full flex items-end justify-center md:justify-end">
    {/* Abstract Blob Background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-60 mix-blend-overlay"></div>
    
    <img 
      src="https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-young-afro-professional-doctor-png-image_10148632.png" 
      alt="Friendly Doctor" 
      className="relative z-10 w-auto h-full max-h-[500px] object-contain object-bottom drop-shadow-2xl"
    />
  </div>
</section>
      

      {/* --- SPECIALTY SECTION --- */}
      <section className="text-center space-y-8">
        <h2 className="text-3xl font-bold text-slate-900 font-[Outfit]">Find by Specialty</h2>
        <p className="text-slate-500 max-w-lg mx-auto">Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
        
        <div className="flex flex-wrap justify-center gap-8">
            {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist'].map((item) => (
                <div key={item} className="flex flex-col items-center gap-3 cursor-pointer group hover:translate-y-[-5px] transition-transform duration-300">
                    <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100 group-hover:shadow-md group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                        <img src={`https://ui-avatars.com/api/?name=${item.charAt(0)}&background=transparent&color=4F46E5&size=40`} alt={item} />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">{item}</span>
                </div>
            ))}
        </div>
      </section>

      {/* --- TOP DOCTORS GRID --- */}
      <section className="text-center space-y-10">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 font-[Outfit]">Top Doctors to Book</h2>
            <p className="text-slate-500">Simply browse through our extensive list of trusted doctors.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {topDoctors.map((doc) => (
                <div 
                    key={doc.id} 
                    className="border border-slate-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:border-indigo-50 hover:-translate-y-2 transition-all duration-300 bg-white group"
                >
                    <div className="bg-indigo-50 h-52 flex items-end justify-center pt-4 relative">
                        <img src={doc.image} alt={doc.name} className="h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/5 transition-colors" />
                    </div>
                    <div className="p-4 text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Available</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{doc.name}</h3>
                        <p className="text-slate-500 text-sm font-medium">{doc.specialty}</p>
                    </div>
                </div>
            ))}
        </div>
        
        <button className="bg-indigo-50 text-indigo-600 px-12 py-3 rounded-full font-semibold hover:bg-indigo-100 transition-colors mt-8">
            more
        </button>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="bg-indigo-500 rounded-3xl flex flex-col md:flex-row items-center px-6 md:px-16 py-12 md:py-0 min-h-[400px] relative overflow-hidden shadow-2xl shadow-indigo-200">
         <div className="md:w-1/2 space-y-8 z-10 py-10 text-center md:text-left">
             <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight font-[Outfit]">
                 Book Appointment <br /> With <span className="text-indigo-200">100+ Trusted Doctors</span>
             </h2>
             <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                 Create account
             </button>
         </div>
         
         <div className="md:w-1/2 relative h-full flex items-end justify-center md:justify-end mt-10 md:mt-0">
             <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop" 
                alt="Doctor Pointing" 
                className="w-[300px] lg:w-[380px] object-contain md:absolute bottom-0 drop-shadow-2xl"
             />
         </div>
      </section>

    </div>
  );
};

export default Home;