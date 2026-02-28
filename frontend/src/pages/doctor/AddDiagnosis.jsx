import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export const AddDiagnosis = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [appointment, setAppointment] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [gettingAI, setGettingAI] = useState(false);

  const [formData, setFormData] = useState({
    symptoms: "",
    vitals: {
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      respiratoryRate: "",
      weight: "",
      height: "",
    },
    observations: "",
    diagnosis: "",
    icd10Code: "",
    treatmentPlan: "",
    followUpDate: "",
    urgency: "routine",
    referralNeeded: false,
    referralDetails: "",
  });

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/appointments/${appointmentId}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setAppointment(data.data);
      if (data.data?.symptoms) {
        setFormData((prev) => ({
          ...prev,
          symptoms: data.data.symptoms,
        }));
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
    }
  };

  const getAIAssistance = async () => {
    if (!formData.symptoms) {
      alert("Please enter symptoms first");
      return;
    }

    setGettingAI(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/diagnosis/ai/analysis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            symptoms: formData.symptoms,
            vitals: formData.vitals,
          }),
        },
      );
      const data = await res.json();
      setAiAnalysis(data.data?.analysis || "");
    } catch (error) {
      console.error("Error getting AI analysis:", error);
    } finally {
      setGettingAI(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVitalChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.diagnosis) {
      alert("Please enter diagnosis");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/diagnosis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            appointmentId,
            ...formData,
          }),
        },
      );

      if (res.ok) {
        alert("Diagnosis saved successfully!");
        navigate("/doctor/appointments");
      } else {
        alert("Failed to save diagnosis");
      }
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      alert("Error saving diagnosis");
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Add Diagnosis</h1>
      <p className="text-gray-600 mb-6">
        Patient: {appointment.patient?.name} | Appointment:{" "}
        {new Date(appointment.appointmentDate).toLocaleDateString()}{" "}
        {appointment.timeSlot}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Symptoms */}
        <Card className="p-4">
          <Label className="block text-sm font-medium mb-2">Symptoms *</Label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleInputChange}
            placeholder="Enter patient symptoms..."
            className="w-full border rounded px-3 py-2 min-h-20"
            required
          />
          <button
            type="button"
            onClick={getAIAssistance}
            disabled={gettingAI}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {gettingAI ? "Getting AI Analysis..." : "Get AI Assistance"}
          </button>
          {aiAnalysis && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm font-medium text-blue-900">AI Analysis:</p>
              <p className="text-sm text-blue-800 mt-1">{aiAnalysis}</p>
            </div>
          )}
        </Card>

        {/* Vitals */}
        <Card className="p-4">
          <h3 className="text-lg font-bold mb-4">Vitals</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Temperature (°C)</Label>
              <Input
                type="number"
                name="temperature"
                value={formData.vitals.temperature}
                onChange={handleVitalChange}
                placeholder="98.6"
                step="0.1"
              />
            </div>
            <div>
              <Label>Blood Pressure</Label>
              <Input
                type="text"
                name="bloodPressure"
                value={formData.vitals.bloodPressure}
                onChange={handleVitalChange}
                placeholder="120/80"
              />
            </div>
            <div>
              <Label>Heart Rate (bpm)</Label>
              <Input
                type="number"
                name="heartRate"
                value={formData.vitals.heartRate}
                onChange={handleVitalChange}
                placeholder="72"
              />
            </div>
            <div>
              <Label>Respiratory Rate</Label>
              <Input
                type="number"
                name="respiratoryRate"
                value={formData.vitals.respiratoryRate}
                onChange={handleVitalChange}
                placeholder="16"
              />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                name="weight"
                value={formData.vitals.weight}
                onChange={handleVitalChange}
                placeholder="70"
                step="0.1"
              />
            </div>
            <div>
              <Label>Height (cm)</Label>
              <Input
                type="number"
                name="height"
                value={formData.vitals.height}
                onChange={handleVitalChange}
                placeholder="170"
              />
            </div>
          </div>
        </Card>

        {/* Observations & Diagnosis */}
        <Card className="p-4">
          <div className="mb-4">
            <Label>Observations</Label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleInputChange}
              placeholder="Clinical observations..."
              className="w-full border rounded px-3 py-2 min-h-20"
            />
          </div>

          <div>
            <Label>Diagnosis *</Label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              placeholder="Final diagnosis..."
              className="w-full border rounded px-3 py-2 min-h-20"
              required
            />
          </div>
        </Card>

        {/* ICD Code & Treatment */}
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label>ICD-10 Code</Label>
              <Input
                type="text"
                name="icd10Code"
                value={formData.icd10Code}
                onChange={handleInputChange}
                placeholder="e.g., J06.9"
              />
            </div>
            <div>
              <Label>Urgency</Label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Treatment Plan</Label>
            <textarea
              name="treatmentPlan"
              value={formData.treatmentPlan}
              onChange={handleInputChange}
              placeholder="Detailed treatment plan..."
              className="w-full border rounded px-3 py-2 min-h-20"
            />
          </div>
        </Card>

        {/* Follow-up */}
        <Card className="p-4">
          <div className="mb-4">
            <Label>Follow-up Date</Label>
            <Input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="referralNeeded"
              checked={formData.referralNeeded}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  referralNeeded: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <Label className="m-0">Referral Needed</Label>
          </div>

          {formData.referralNeeded && (
            <div>
              <Label>Referral Details</Label>
              <textarea
                name="referralDetails"
                value={formData.referralDetails}
                onChange={handleInputChange}
                placeholder="Referral details..."
                className="w-full border rounded px-3 py-2 min-h-20"
              />
            </div>
          )}
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Diagnosis"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDiagnosis;
