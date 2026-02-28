import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { Card } from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import {
  useGetPatientAppointmentsQuery,
  useGetPrescriptionsQuery,
} from "../../features/auth/authApi";

const PatientDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const { data: appointmentsRes, isLoading: appointmentsLoading } =
    useGetPatientAppointmentsQuery(user?._id);
  const { data: prescriptionsRes, isLoading: prescriptionsLoading } =
    useGetPrescriptionsQuery();

  const appointments = appointmentsRes?.data || [];
  const prescriptions = prescriptionsRes?.data || [];

  const isLoading = appointmentsLoading || prescriptionsLoading;

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.appointmentDate) > new Date() && a.status === "scheduled",
  );

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      apt.status === "scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {apt.status}
                  </span>
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      prescription.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {prescription.status}
                  </span>
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
