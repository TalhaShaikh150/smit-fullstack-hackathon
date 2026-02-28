import { ArrowRight } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 pt-28 pb-16">
      {/* --- PAGE TITLE --- */}
      <div className="text-center text-2xl font-[Outfit] text-slate-500 mb-12">
        <p>
          ABOUT <span className="font-bold text-slate-800">US</span>
        </p>
      </div>

      {/* --- MAIN CONTENT SECTION --- */}
      <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
        {/* Left: Image */}
        <div className="w-full md:w-1/3">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop"
            alt="Doctors Team"
            className="w-full rounded-lg shadow-sm"
          />
        </div>

        {/* Right: Text Content */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 text-sm md:text-base text-slate-600 leading-relaxed font-[Plus_Jakarta_Sans]">
          <p>
            Welcome to HealthStack, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At HealthStack, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p>
            HealthStack is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, HealthStack is here to support you every step of the
            way.
          </p>

          <div className="mt-4">
            <h3 className="font-bold text-slate-900 text-lg mb-4 font-[Outfit]">
              Our Vision
            </h3>
            <p>
              Our vision at HealthStack is to create a seamless healthcare
              experience for every user. We aim to bridge the gap between
              patients and healthcare providers, making it easier for you to
              access the care you need, when you need it.
            </p>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US SECTION --- */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 font-[Outfit] mb-8">
          WHY <span className="text-slate-500 font-normal">CHOOSE US</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Feature 1 */}
          <div className="group p-8 md:p-12 hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer flex flex-col gap-4">
            <b className="text-slate-800 group-hover:text-white uppercase font-[Outfit]">
              Efficiency:
            </b>
            <p className="text-sm text-slate-600 group-hover:text-indigo-100 leading-relaxed">
              Streamlined appointment scheduling that fits into your busy
              lifestyle.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 md:p-12 hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer flex flex-col gap-4">
            <b className="text-slate-800 group-hover:text-white uppercase font-[Outfit]">
              Convenience:
            </b>
            <p className="text-sm text-slate-600 group-hover:text-indigo-100 leading-relaxed">
              Access to a network of trusted healthcare professionals in your
              area.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 md:p-12 hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer flex flex-col gap-4">
            <b className="text-slate-800 group-hover:text-white uppercase font-[Outfit]">
              Personalization:
            </b>
            <p className="text-sm text-slate-600 group-hover:text-indigo-100 leading-relaxed">
              Tailored recommendations and reminders to help you stay on top of
              your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
