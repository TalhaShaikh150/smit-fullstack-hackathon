import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, AlertCircle, Clock, ArrowRight } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-28 pb-16 font-[Plus_Jakarta_Sans]">
      
      {/* --- PAGE TITLE --- */}
      <div className="text-center text-2xl font-[Outfit] text-slate-500 mb-16">
        <p>CONTACT <span className="font-bold text-slate-800">US</span></p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
        
        {/* --- LEFT: CONTACT INFO --- */}
        <div className="flex-1 flex flex-col justify-center gap-10">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop" 
            alt="Clinic Reception" 
            className="w-full h-[300px] object-cover rounded-2xl shadow-lg mb-4"
          />

          <div className="space-y-6">
             <h3 className="text-lg font-bold text-slate-800 font-[Outfit] uppercase tracking-wide">
                Our Office
             </h3>
             
             <div className="flex items-start gap-4 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                   <MapPin size={20} />
                </div>
                <div>
                   <p className="font-medium text-slate-900">San Francisco HQ</p>
                   <p className="text-sm">54709 Willms Station</p>
                   <p className="text-sm">Suite 350, Washington, USA</p>
                </div>
             </div>

             <div className="flex items-start gap-4 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                   <Phone size={20} />
                </div>
                <div>
                   <p className="font-medium text-slate-900">Phone</p>
                   <p className="text-sm hover:text-indigo-600 transition-colors cursor-pointer">+1 (415) 555-0132</p>
                </div>
             </div>

             <div className="flex items-start gap-4 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                   <Mail size={20} />
                </div>
                <div>
                   <p className="font-medium text-slate-900">Email</p>
                   <p className="text-sm hover:text-indigo-600 transition-colors cursor-pointer">support@prescripto.com</p>
                </div>
             </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 font-[Outfit] uppercase tracking-wide mb-4">
                Careers at Prescripto
             </h3>
             <p className="text-slate-600 text-sm mb-6">
                Learn more about our teams and job openings.
             </p>
             <Button variant="outline" className="border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white rounded-none px-8 py-6 h-auto transition-all">
                Explore Jobs
             </Button>
          </div>
        </div>

        {/* --- RIGHT: CONTACT FORM --- */}
        <div className="flex-1 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
           <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800 font-[Outfit]">Send us a message</h3>
              <p className="text-slate-500 mt-2">
                 We typically reply within 24 hours.
              </p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Your Name</Label>
                    <Input
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       placeholder="John Doe"
                       className={`h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600 rounded-xl ${errors.name ? "border-red-500" : ""}`}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Email Address</Label>
                    <Input
                       name="email"
                       type="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="john@example.com"
                       className={`h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600 rounded-xl ${errors.email ? "border-red-500" : ""}`}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <Label className="text-slate-700 font-medium">Subject</Label>
                 <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Appointment Inquiry"
                    className={`h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600 rounded-xl ${errors.subject ? "border-red-500" : ""}`}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-slate-700 font-medium">Message</Label>
                 <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you today?"
                    className={`flex w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-50 resize-none ${errors.message ? "border-red-500" : ""}`}
                 />
              </div>

              {Object.keys(errors).length > 0 && (
                 <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    Please fill in all required fields.
                 </div>
              )}

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1"
              >
                {isSubmitting ? "Sending..." : "Send Message"} <Send size={18} className="ml-2" />
              </Button>
           </form>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;