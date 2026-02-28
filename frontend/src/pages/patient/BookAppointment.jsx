import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../features/auth/authSlice";
import {
  useGetDoctorsQuery,
  useGetAvailableSlotsQuery,
  useCreateAppointmentMutation,
} from "../../features/auth/authApi";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";

export const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useSelector(selectCurrentUser);

  const doctorIdFromUrl = searchParams.get("doctorId");
  const [selectedDoctor, setSelectedDoctor] = useState(doctorIdFromUrl || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch doctors
  const { data: doctorsRes, isLoading: doctorsLoading } = useGetDoctorsQuery({
    status: "active",
  });
  const doctors = doctorsRes?.data || [];

  // Fetch available slots
  const {
    data: slotsRes,
    isLoading: slotsLoading,
    isFetching: slotsFetching,
  } = useGetAvailableSlotsQuery(
    { doctorId: selectedDoctor, date: selectedDate },
    {
      skip: !selectedDoctor || !selectedDate,
    },
  );
  const availableSlots = slotsRes?.data?.availableSlots || [];

  // Create appointment mutation
  const [createAppointment, { isLoading: bookingLoading }] =
    useCreateAppointmentMutation();

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setError("Please select doctor, date, and time slot");
      return;
    }

    try {
      await createAppointment({
        patientId: user._id,
        doctorId: selectedDoctor,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        reason,
        symptoms,
      }).unwrap();

      setSuccess(true);
      setReason("");
      setSymptoms("");
      setSelectedSlot("");
      setSelectedDate("");
      setSelectedDoctor("");

      // Redirect to patient dashboard after 2 seconds
      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 2000);
    } catch (err) {
      setError(err?.data?.message || "Failed to book appointment. Try again.");
      console.error("Error booking appointment:", err);
    }
  };

  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="p-6 text-center">
          <p className="text-gray-600">Please log in to book an appointment.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-900">
              Appointment booked successfully!
            </p>
            <p className="text-sm text-green-700">
              Redirecting to your appointments...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleBookAppointment} className="space-y-4">
          {/* Select Doctor */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              Select Doctor *
            </Label>
            {doctorsLoading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading doctors...</span>
              </div>
            ) : (
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.user?.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            )}
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
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Select Time Slot */}
          {selectedDoctor && selectedDate && (
            <div>
              <Label className="block text-sm font-medium mb-2">
                Available Time Slots *
              </Label>
              {slotsFetching || slotsLoading ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading available slots...</span>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded border text-center text-sm transition-colors ${
                        selectedSlot === slot
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-100 border-gray-300 hover:border-blue-600"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No available slots for selected date
                </p>
              )}
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
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Symptoms */}
          <div>
            <Label className="block text-sm font-medium mb-2">Symptoms</Label>
            <textarea
              placeholder="Describe your symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full border rounded px-3 py-2 min-h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={bookingLoading} className="flex-1">
              {bookingLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BookAppointment;
