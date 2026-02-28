import React, { useState, useMemo } from "react";
import { CheckCircle2, Clock, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  useGetAppointmentsQuery,
  useGetDoctorsQuery,
} from "@/features/auth/authApi";
import { toast } from "sonner";

const CheckInPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [checkedInAppointments, setCheckedInAppointments] = useState(new Set());

  const { data: doctorsRes, isLoading: doctorsLoading } = useGetDoctorsQuery();
  const { data: appointmentsRes, isLoading: appointmentsLoading } =
    useGetAppointmentsQuery();

  const doctors = doctorsRes?.data || [];
  const appointments = appointmentsRes?.data || [];

  const isLoading = doctorsLoading || appointmentsLoading;

  // Filter appointments for today
  const todayAppointments = appointments.filter((a) => {
    const apt = new Date(a.appointmentDate);
    const today = new Date();
    return apt.toDateString() === today.toDateString();
  });

  // Filter appointments based on search and filters
  const filteredAppointments = useMemo(() => {
    return todayAppointments.filter((apt) => {
      const matchesSearch =
        apt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDoctor =
        selectedDoctor === "all" || apt.doctor?._id === selectedDoctor;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "checked-in" && checkedInAppointments.has(apt._id)) ||
        (filterStatus === "scheduled" && !checkedInAppointments.has(apt._id));

      return matchesSearch && matchesDoctor && matchesStatus;
    });
  }, [
    searchTerm,
    filterStatus,
    selectedDoctor,
    checkedInAppointments,
    todayAppointments,
  ]);

  const handleCheckIn = (appointmentId) => {
    setCheckedInAppointments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(appointmentId)) {
        newSet.delete(appointmentId);
        toast.success("Check-in removed");
      } else {
        newSet.add(appointmentId);
        toast.success("Patient checked in");
      }
      return newSet;
    });
  };

  const todayStats = {
    total: todayAppointments.length,
    checkedIn: checkedInAppointments.size,
    pending: todayAppointments.length - checkedInAppointments.size,
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading check-in data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Check-In Management</h1>
        <p className="text-gray-500">Manage patient check-ins for today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm font-medium">
            Total Appointments
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {todayStats.total}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm font-medium">Checked In</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {todayStats.checkedIn}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {todayStats.pending}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-4 py-2 rounded border border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.user?.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded border border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Pending</option>
            <option value="checked-in">Checked In</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 text-lg">
              {todayAppointments.length === 0
                ? "No appointments scheduled for today"
                : "No appointments found"}
            </p>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => {
            const isCheckedIn = checkedInAppointments.has(appointment._id);
            return (
              <Card
                key={appointment._id}
                className={`p-4 transition-all ${
                  isCheckedIn
                    ? "bg-green-50 border-green-200"
                    : "hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left side - Patient & Appointment Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">
                        {appointment.patient?.name}
                      </h3>
                      {isCheckedIn && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {appointment.patient?.email}
                    </p>

                    <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs">Time</span>
                        <p className="font-medium flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4" />
                          {appointment.timeSlot}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Doctor</span>
                        <p className="font-medium">
                          {appointment.doctor?.user?.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Reason</span>
                        <p className="font-medium">{appointment.reason}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Status</span>
                        <p
                          className={`font-medium inline-block mt-1 px-2 py-1 rounded text-xs ${
                            isCheckedIn
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isCheckedIn ? "Checked In" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Check-in Button */}
                  <Button
                    onClick={() => handleCheckIn(appointment._id)}
                    variant={isCheckedIn ? "default" : "outline"}
                    className={`whitespace-nowrap ${
                      isCheckedIn ? "bg-green-600 hover:bg-green-700" : ""
                    }`}
                  >
                    {isCheckedIn ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Checked In
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Check In
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Card */}
      {todayStats.total > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            📊 <strong>Today's Summary:</strong> {todayStats.checkedIn} of{" "}
            {todayStats.total} patients checked in (
            {Math.round((todayStats.checkedIn / todayStats.total) * 100)}%)
          </p>
        </Card>
      )}
    </div>
  );
};

export default CheckInPage;
