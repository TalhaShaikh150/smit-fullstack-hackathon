import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { Card } from "../../components/ui/card";

const DoctorDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [appointments, setAppointments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
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

      // Fetch analytics
      const analyticsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/diagnosis/analytics/doctor`,
        {
          credentials: "include",
        },
      );
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData.data);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
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
    return (
      apt.toDateString() === today.toDateString() && a.status === "scheduled"
    );
  });

  const completedAppointments = appointments.filter(
    (a) => a.status === "completed",
  );

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
          <p className="text-2xl font-bold">
            {analytics?.totalAppointments || 0}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Completed</h3>
          <p className="text-2xl font-bold">
            {analytics?.completedAppointments || 0}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Total Diagnoses</h3>
          <p className="text-2xl font-bold">{analytics?.totalDiagnosis || 0}</p>
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
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                    Add Diagnosis
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Common Diagnoses */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Top Diagnoses</h2>
        {analytics?.commonDiagnoses && analytics.commonDiagnoses.length > 0 ? (
          <div className="space-y-2">
            {analytics.commonDiagnoses.map((diag, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex-1">
                  <p className="font-medium">{diag._id}</p>
                </div>
                <p className="text-gray-600">{diag.count} cases</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No diagnosis data yet</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
