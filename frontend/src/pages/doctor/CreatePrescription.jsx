import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export const CreatePrescription = () => {
  const { appointmentId, patientId } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([
    {
      name: "",
      dosage: "",
      frequency: "Once daily",
      duration: "",
      instructions: "",
    },
  ]);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);

  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Thrice daily",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
  ];

  const searchMedicine = async (index, query) => {
    if (!query || query.length < 2) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/prescriptions/search/medicines?query=${query}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setSearchResults((prev) => ({
        ...prev,
        [index]: data.data || [],
      }));
    } catch (error) {
      console.error("Error searching medicines:", error);
    }
  };

  const selectMedicine = (index, medicine) => {
    const newMedicines = [...medicines];
    newMedicines[index].name = medicine.name;
    setMedicines(newMedicines);
    setSearchResults((prev) => ({
      ...prev,
      [index]: [],
    }));
  };

  const updateMedicine = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        dosage: "",
        frequency: "Once daily",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis || medicines.some((m) => !m.name || !m.dosage)) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/prescriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            patientId,
            appointmentId,
            medicines: medicines.filter((m) => m.name), // Only include medicines with names
            diagnosis,
            notes,
          }),
        },
      );

      if (res.ok) {
        alert("Prescription created successfully!");
        navigate(-1);
      } else {
        alert("Failed to create prescription");
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      alert("Error creating prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Prescription</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Diagnosis */}
        <Card className="p-4">
          <Label className="block text-sm font-medium mb-2">Diagnosis *</Label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter diagnosis..."
            className="w-full border rounded px-3 py-2 min-h-20"
            required
          />
        </Card>

        {/* Medicines */}
        <Card className="p-4">
          <h3 className="text-lg font-bold mb-4">Medicines</h3>
          <div className="space-y-4">
            {medicines.map((medicine, index) => (
              <div key={index} className="border rounded p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Medicine Name */}
                  <div>
                    <Label>Medicine Name *</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={medicine.name}
                        onChange={(e) => {
                          updateMedicine(index, "name", e.target.value);
                          searchMedicine(index, e.target.value);
                        }}
                        placeholder="Search medicine..."
                      />
                      {searchResults[index] &&
                        searchResults[index].length > 0 && (
                          <div className="absolute top-10 left-0 right-0 bg-white border rounded shadow-lg z-10">
                            {searchResults[index].map((med, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => selectMedicine(index, med)}
                                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                              >
                                {med.name}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Dosage */}
                  <div>
                    <Label>Dosage *</Label>
                    <Input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) =>
                        updateMedicine(index, "dosage", e.target.value)
                      }
                      placeholder="e.g., 500mg"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <Label>Frequency *</Label>
                    <select
                      value={medicine.frequency}
                      onChange={(e) =>
                        updateMedicine(index, "frequency", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                    >
                      {frequencyOptions.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <Label>Duration *</Label>
                    <Input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) =>
                        updateMedicine(index, "duration", e.target.value)
                      }
                      placeholder="e.g., 7 days"
                    />
                  </div>

                  {/* Instructions */}
                  <div className="col-span-2">
                    <Label>Instructions</Label>
                    <Input
                      type="text"
                      value={medicine.instructions}
                      onChange={(e) =>
                        updateMedicine(index, "instructions", e.target.value)
                      }
                      placeholder="e.g., After food"
                    />
                  </div>
                </div>

                {/* Remove Button */}
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addMedicine}
              className="w-full px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded hover:bg-blue-50"
            >
              + Add Another Medicine
            </button>
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-4">
          <Label className="block text-sm font-medium mb-2">
            Additional Notes
          </Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional instructions for patient..."
            className="w-full border rounded px-3 py-2 min-h-20"
          />
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Prescription"}
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

export default CreatePrescription;
