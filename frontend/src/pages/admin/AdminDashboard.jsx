import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { Card } from "../../components/ui/card";

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [analytics, setAnalytics] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch system analytics
      const analyticsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/staff/analytics/system`,
        {
          credentials: "include",
        },
      );
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData.data);

      // Fetch all doctors
      const doctorsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/staff/doctors`,
        {
          credentials: "include",
        },
      );
      const doctorsData = await doctorsRes.json();
      setDoctors(doctorsData.data || []);

      // Fetch all receptionists
      const receptRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/staff/receptionists`,
        {
          credentials: "include",
        },
      );
      const receptData = await receptRes.json();
      setReceptionists(receptData.data || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administration Dashboard</h1>
        <p className="text-gray-500">System Overview & Management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">{analytics?.totalUsers || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Total Patients</h3>
          <p className="text-2xl font-bold">{analytics?.totalPatients || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Total Doctors</h3>
          <p className="text-2xl font-bold">{analytics?.totalDoctors || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm">Total Receptionists</h3>
          <p className="text-2xl font-bold">
            {analytics?.totalReceptionists || 0}
          </p>
        </Card>
      </div>

      {/* Appointment Statistics */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Appointment Statistics</h2>
        <Card className="p-6">
          {analytics?.appointmentStats &&
          analytics.appointmentStats.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {analytics.appointmentStats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-gray-600 uppercase text-xs font-semibold">
                    {stat._id}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stat.count}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No appointment data</p>
          )}
        </Card>
      </div>

      {/* Doctors Management */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Doctors ({doctors.length})</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add Doctor
          </button>
        </div>
        {doctors.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-500">No doctors registered yet</p>
          </Card>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {doctors.map((doctor) => (
              <Card
                key={doctor._id}
                className="p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{doctor.user?.name}</p>
                  <p className="text-sm text-gray-600">
                    {doctor.specialization} | License: {doctor.licenseNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded font-semibold ${
                      doctor.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {doctor.status}
                  </span>
                  <button className="text-blue-600 hover:underline">
                    Edit
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Receptionists Management */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Receptionists ({receptionists.length})
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add Receptionist
          </button>
        </div>
        {receptionists.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-500">No receptionists registered yet</p>
          </Card>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {receptionists.map((receptionist) => (
              <Card
                key={receptionist._id}
                className="p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{receptionist.user?.name}</p>
                  <p className="text-sm text-gray-600">
                    {receptionist.department}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded font-semibold ${
                      receptionist.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {receptionist.status}
                  </span>
                  <button className="text-blue-600 hover:underline">
                    Edit
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

export default AdminDashboard;
