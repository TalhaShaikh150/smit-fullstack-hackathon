import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export const BookAppointment = () => {
  const user = useSelector(selectCurrentUser);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/staff/doctors`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setDoctors(data.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/appointments/available-slots?doctorId=${selectedDoctor}&date=${selectedDate}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setAvailableSlots(data.data?.availableSlots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDoctor, selectedDate]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      alert("Please select doctor, date, and time slot");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/appointments/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            patientId: user._id,
            doctorId: selectedDoctor,
            appointmentDate: selectedDate,
            timeSlot: selectedSlot,
            reason,
            symptoms,
          }),
        },
      );

      if (res.ok) {
        setSuccess(true);
        setReason("");
        setSymptoms("");
        setSelectedSlot("");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Appointment booked successfully!
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleBookAppointment} className="space-y-4">
          {/* Select Doctor */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              Select Doctor *
            </Label>
            <select
              value={selectedDoctor || ""}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.user?.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Select Date */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              Select Date *
            </Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Select Time Slot */}
          {selectedDoctor && selectedDate && (
            <div>
              <Label className="block text-sm font-medium mb-2">
                Available Time Slots *
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded border text-center ${
                        selectedSlot === slot
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-100 border-gray-300 hover:border-blue-600"
                      }`}
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No available slots</p>
                )}
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              Reason for Visit
            </Label>
            <Input
              type="text"
              placeholder="e.g., Regular checkup, Fever, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Symptoms */}
          <div>
            <Label className="block text-sm font-medium mb-2">Symptoms</Label>
            <textarea
              placeholder="Describe your symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full border rounded px-3 py-2 min-h-24"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BookAppointment;
