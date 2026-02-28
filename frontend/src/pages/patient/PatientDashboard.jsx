import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { Card } from "../../components/ui/card";

const PatientDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      // Fetch appointments
      const appointmentsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/appointments`,
        {
          credentials: "include",
        },
      );
      const appointmentsData = await appointmentsRes.json();
      setAppointments(appointmentsData.data || []);

      // Fetch prescriptions
      const prescriptionsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/prescriptions`,
        {
          credentials: "include",
        },
      );
      const prescriptionsData = await prescriptionsRes.json();
      setPrescriptions(prescriptionsData.data || []);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.appointmentDate) > new Date() && a.status === "scheduled",
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-gray-500">Patient Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Upcoming Appointments</h3>
          <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Active Prescriptions</h3>
          <p className="text-2xl font-bold">
            {prescriptions.filter((p) => p.status === "active").length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Total Appointments</h3>
          <p className="text-2xl font-bold">{appointments.length}</p>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-500">No upcoming appointments</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <Card key={apt._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{apt.doctor?.name}</p>
                    <p className="text-gray-600">
                      {new Date(apt.appointmentDate).toLocaleDateString()} at{" "}
                      {apt.timeSlot}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{apt.reason}</p>
                  </div>
                  <button className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                    Cancel
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Prescriptions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-500">No prescriptions yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((prescription) => (
              <Card key={prescription._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">
                      From Dr. {prescription.doctor?.name}
                    </p>
                    <p className="text-gray-600">{prescription.diagnosis}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Issued:{" "}
                      {new Date(prescription.issuedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                    Download PDF
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
