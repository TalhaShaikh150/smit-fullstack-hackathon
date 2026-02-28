import React from "react";
import { Loader2, MapPin, Award, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetDoctorsQuery } from "@/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";

const DoctorsPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { data: doctorsRes, isLoading } = useGetDoctorsQuery({
    status: "active",
  });

  const doctors = doctorsRes?.data || [];

  const handleBookAppointment = (doctorId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/book-appointment?doctorId=${doctorId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-background px-4 py-12 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Top Doctors to Book
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simply browse through our extensive list of trusted doctors.
            </p>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          {doctors.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500 text-lg">
                No doctors currently available. Please check back later.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <Card
                  key={doctor._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Doctor Image */}
                  <div className="h-48 bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden">
                    {doctor.user?.avatar?.url ? (
                      <img
                        src={doctor.user.avatar.url}
                        alt={doctor.user?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">👨‍⚕️</div>
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div className="p-6 space-y-4">
                    {/* Availability Badge */}
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium text-green-600">
                        Available
                      </span>
                    </div>

                    {/* Name */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        Dr. {doctor.user?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {doctor.specialization}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-2 pt-2 border-t">
                      {/* Experience */}
                      {doctor.experience && (
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {doctor.experience} years experience
                          </span>
                        </div>
                      )}

                      {/* License */}
                      {doctor.licenseNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 truncate">
                            Lic: {doctor.licenseNumber}
                          </span>
                        </div>
                      )}

                      {/* Fee */}
                      {doctor.consultationFee && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 font-medium">
                            ₹{doctor.consultationFee} per consultation
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Qualifications */}
                    {doctor.qualifications && (
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-1">Qualifications:</p>
                        <p>{doctor.qualifications}</p>
                      </div>
                    )}

                    {/* Book Button */}
                    <Button
                      onClick={() => handleBookAppointment(doctor._id)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Book Appointment
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DoctorsPage;
