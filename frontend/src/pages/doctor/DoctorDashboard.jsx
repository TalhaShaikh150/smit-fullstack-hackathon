import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { Card } from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import { useGetDoctorAppointmentsQuery } from "../../features/auth/authApi";

const DoctorDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const { data: appointmentsRes, isLoading } = useGetDoctorAppointmentsQuery(
    user?._id,
  );

  const appointments = appointmentsRes?.data || [];

  const todayAppointments = appointments.filter((a) => {
    const apt = new Date(a.appointmentDate);
    const today = new Date();
    return (
      apt.toDateString() === today.toDateString() && a.status === "scheduled"
    );
  });

  const completedAppointments = appointments.filter(
    (a) => a.status === "completed",
  );

  const totalAppointments = appointments.length;

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
        <h1 className="text-3xl font-bold">Welcome, Dr. {user?.name}!</h1>
        <p className="text-gray-500">Doctor Dashboard</p>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Total Appointments</h3>
          <p className="text-2xl font-bold">{totalAppointments}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Completed</h3>
          <p className="text-2xl font-bold">{completedAppointments.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Pending</h3>
          <p className="text-2xl font-bold">
            {appointments.length - completedAppointments.length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Today's Appointments</h3>
          <p className="text-2xl font-bold">{todayAppointments.length}</p>
        </Card>
      </div>

      {/* Today's Appointments */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>
        {todayAppointments.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-500">No appointments scheduled for today</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <Card key={apt._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{apt.patient?.name}</p>
                    <p className="text-gray-600">
                      Time: {apt.timeSlot} | Reason: {apt.reason}
                    </p>
                    {apt.symptoms && (
                      <p className="text-sm text-gray-500 mt-1">
                        Symptoms: {apt.symptoms}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      apt.status === "scheduled"
                        ? "bg-yellow-100 text-yellow-700"
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

      {/* All Appointments */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Appointments</h2>
        {appointments.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-500">No appointments</p>
          </Card>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {appointments.map((apt) => (
              <Card key={apt._id} className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{apt.patient?.name}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(apt.appointmentDate).toLocaleDateString()} at{" "}
                      {apt.timeSlot}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      apt.status === "scheduled"
                        ? "bg-yellow-100 text-yellow-700"
                        : apt.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
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
    </div>
  );
};

export default DoctorDashboard;
