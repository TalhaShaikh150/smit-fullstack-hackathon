import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { Card } from "../../components/ui/card";

const ReceptionistDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceptionistData();
  }, []);

  const fetchReceptionistData = async () => {
    try {
      setLoading(true);

      // Fetch all appointments
      const appointmentsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/appointments`,
        {
          credentials: "include",
        },
      );
      const appointmentsData = await appointmentsRes.json();
      setAppointments(appointmentsData.data || []);

      // Fetch doctors
      const doctorsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/staff/doctors`,
        {
          credentials: "include",
        },
      );
      const doctorsData = await doctorsRes.json();
      setDoctors(doctorsData.data || []);
    } catch (error) {
      console.error("Error fetching receptionist data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const todayAppointments = appointments.filter((a) => {
    const apt = new Date(a.appointmentDate);
    const today = new Date();
    return apt.toDateString() === today.toDateString();
  });

  const scheduledAppointments = appointments.filter(
    (a) => a.status === "scheduled",
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-gray-500">Receptionist Dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Today's Appointments</h3>
          <p className="text-2xl font-bold">{todayAppointments.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Scheduled Appointments</h3>
          <p className="text-2xl font-bold">{scheduledAppointments.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Available Doctors</h3>
          <p className="text-2xl font-bold">{doctors.length}</p>
        </Card>
      </div>

      {/* Check-in Appointments (Today) */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Today's Check-ins</h2>
        {todayAppointments.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-500">No appointments today</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <Card key={apt._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{apt.patient?.name}</p>
                    <p className="text-gray-600">
                      Time: {apt.timeSlot} | Doctor: {apt.doctor?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          apt.status === "scheduled"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200">
                    Mark Done
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Doctors */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Doctors</h2>
        {doctors.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-500">No doctors available</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {doctors.map((doctor) => (
              <Card key={doctor._id} className="p-4">
                <p className="font-bold">{doctor.user?.name}</p>
                <p className="text-gray-600">{doctor.specialization}</p>
                <p className="text-sm text-gray-500">
                  Fee: ₹{doctor.consultationFee}
                </p>
                <p className="text-sm mt-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      doctor.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {doctor.status}
                  </span>
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
