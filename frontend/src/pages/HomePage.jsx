import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";

// Mock Data for Doctors (In a real app, this comes from your Backend)
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
    <div className="container mx-auto px-4 py-8 space-y-24">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-indigo-500 rounded-3xl text-white flex flex-col md:flex-row items-center relative overflow-hidden px-6 md:px-16 py-10 md:py-0 min-h-[500px]">
        
        {/* Left Content */}
        <div className="md:w-1/2 flex flex-col justify-center gap-6 z-10 py-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Book Appointment <br />
            With Trusted Doctors
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
               {/* Mock User Avatars */}
               {[1,2,3].map(i => (
                 <img key={i} className="w-10 h-10 rounded-full border-2 border-white object-cover" src={`https://randomuser.me/api/portraits/thumb/men/${i+20}.jpg`} alt="" />
               ))}
            </div>
            <p className="text-sm text-indigo-100 font-light leading-snug">
              Simply browse through our extensive list of <br className="hidden md:block"/>
              trusted doctors, schedule your appointment hassle-free.
            </p>
          </div>

          <Link 
            to={ROUTES.REGISTER} 
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold flex items-center gap-2 w-fit hover:scale-105 transition-transform shadow-lg"
          >
            Book appointment <ArrowRight size={20} />
          </Link>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 relative h-full flex items-end justify-end mt-8 md:mt-0">
          <img 
            src="https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=1000&auto=format&fit=crop" // Professional Group Photo
            alt="Doctors Team" 
            className="w-full max-w-md md:absolute bottom-0 right-0 object-contain drop-shadow-2xl"
          />
        </div>
      </section>


      {/* --- SPECIALTY SECTION (Bonus: Adds to functionality) --- */}
      <section className="text-center space-y-8">
        <h2 className="text-3xl font-bold text-slate-900">Find by Specialty</h2>
        <p className="text-slate-500 max-w-lg mx-auto">Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
        
        <div className="flex flex-wrap justify-center gap-8">
            {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist'].map((item) => (
                <div key={item} className="flex flex-col items-center gap-3 cursor-pointer group hover:translate-y-[-10px] transition-transform duration-300">
                    <div className="h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-indigo-100 transition-colors">
                        {/* Placeholder icons - replace with SVGs for specialty */}
                        <img src={`https://ui-avatars.com/api/?name=${item.charAt(0)}&background=transparent&color=4F46E5&size=40`} alt={item} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{item}</span>
                </div>
            ))}
        </div>
      </section>


      {/* --- TOP DOCTORS GRID --- */}
      <section className="text-center space-y-10">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Top Doctors to Book</h2>
            <p className="text-slate-500">Simply browse through our extensive list of trusted doctors.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {topDoctors.map((doc) => (
                <div 
                    key={doc.id} 
                    className="border border-indigo-50 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white group"
                >
                    <div className="bg-indigo-50/50 h-52 flex items-end justify-center pt-4">
                        <img src={doc.image} alt={doc.name} className="h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-green-500 font-medium">Available</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">{doc.name}</h3>
                        <p className="text-slate-500 text-sm">{doc.specialty}</p>
                    </div>
                </div>
            ))}
        </div>
        
        <button className="bg-indigo-50 text-indigo-600 px-10 py-3 rounded-full font-medium hover:bg-indigo-100 transition-colors mt-8">
            more
        </button>
      </section>


      {/* --- CTA BANNER --- */}
      <section className="bg-indigo-500 rounded-3xl flex flex-col md:flex-row items-center px-6 md:px-16 py-12 md:py-0 min-h-[400px] relative overflow-hidden">
         <div className="md:w-1/2 space-y-6 z-10 py-10">
             <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                 Book Appointment <br /> With 100+ Trusted Doctors
             </h2>
             <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
                 Create account
             </button>
         </div>
         
         <div className="md:w-1/2 relative h-full flex items-end justify-center md:justify-end mt-10 md:mt-0">
             <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop" 
                alt="Doctor Pointing" 
                className="w-[300px] lg:w-[380px] object-contain md:absolute bottom-0"
             />
         </div>
      </section>

    </div>
  );
};

export default Home;