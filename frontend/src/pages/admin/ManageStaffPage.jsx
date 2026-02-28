import React, { useState } from "react";
import { Plus, X, Loader2, Edit, Trash2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useGetDoctorsQuery,
  useGetReceptionistsQuery,
  useDeleteDoctorMutation,
  useDeleteReceptionistMutation,
  useDeactivateStaffMutation,
} from "@/features/auth/authApi";
import AddDoctorForm from "./AddDoctorForm";
import AddReceptionistForm from "./AddReceptionistForm";
import { toast } from "sonner";

const ManageStaffPage = () => {
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddReceptionist, setShowAddReceptionist] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editingReceptionist, setEditingReceptionist] = useState(null);

  const {
    data: doctorsRes,
    isLoading: doctorsLoading,
    refetch: refetchDoctors,
  } = useGetDoctorsQuery();
  const {
    data: receptionistsRes,
    isLoading: receptionistsLoading,
    refetch: refetchReceptionists,
  } = useGetReceptionistsQuery();

  const [deleteDoctor] = useDeleteDoctorMutation();
  const [deleteReceptionist] = useDeleteReceptionistMutation();
  const [deactivateStaff] = useDeactivateStaffMutation();

  const doctors = doctorsRes?.data || [];
  const receptionists = receptionistsRes?.data || [];

  const handleDoctorSuccess = () => {
    setShowAddDoctor(false);
    setEditingDoctor(null);
    refetchDoctors();
  };

  const handleReceptionistSuccess = () => {
    setShowAddReceptionist(false);
    setEditingReceptionist(null);
    refetchReceptionists();
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setShowAddDoctor(true);
  };

  const handleEditReceptionist = (receptionist) => {
    setEditingReceptionist(receptionist);
    setShowAddReceptionist(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await deleteDoctor(doctorId).unwrap();
      toast.success("Doctor deleted successfully!");
      refetchDoctors();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete doctor");
    }
  };

  const handleDeleteReceptionist = async (receptionistId) => {
    if (!window.confirm("Are you sure you want to delete this receptionist?"))
      return;
    try {
      await deleteReceptionist(receptionistId).unwrap();
      toast.success("Receptionist deleted successfully!");
      refetchReceptionists();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete receptionist");
    }
  };

  const handleDeactivateDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to deactivate this doctor?"))
      return;
    try {
      await deactivateStaff(doctorId).unwrap();
      toast.success("Doctor deactivated successfully!");
      refetchDoctors();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to deactivate doctor");
    }
  };

  const handleDeactivateReceptionist = async (receptionistId) => {
    if (
      !window.confirm("Are you sure you want to deactivate this receptionist?")
    )
      return;
    try {
      await deactivateStaff(receptionistId).unwrap();
      toast.success("Receptionist deactivated successfully!");
      refetchReceptionists();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to deactivate receptionist");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <p className="text-gray-500">Manage doctors and receptionists</p>
      </div>

      {/* Doctors Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Doctors</h2>
            <p className="text-sm text-gray-500">Total: {doctors.length}</p>
          </div>
          <Button onClick={() => setShowAddDoctor(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        </div>

        {doctorsLoading ? (
          <Card className="p-6 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading doctors...</span>
          </Card>
        ) : doctors.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-500 text-center">
              No doctors registered yet
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {doctors.map((doctor) => (
              <Card
                key={doctor._id}
                className="p-4 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {doctor.user?.name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-600">{doctor.user?.email}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Specialization:</span>
                      <p className="font-medium">{doctor.specialization}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">License:</span>
                      <p className="font-medium">{doctor.licenseNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <p className="font-medium">{doctor.experience} years</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Fee:</span>
                      <p className="font-medium">${doctor.consultationFee}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span
                    className={`px-3 py-1 text-xs rounded-full text-center font-semibold ${
                      doctor.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {doctor.status || "pending"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditDoctor(doctor)}
                      className="gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeactivateDoctor(doctor._id)}
                      className="gap-1 text-yellow-600"
                    >
                      <Ban className="h-4 w-4" />
                      Deactive
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDoctor(doctor._id)}
                      className="gap-1 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Receptionists Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Receptionists</h2>
            <p className="text-sm text-gray-500">
              Total: {receptionists.length}
            </p>
          </div>
          <Button
            onClick={() => setShowAddReceptionist(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Receptionist
          </Button>
        </div>

        {receptionistsLoading ? (
          <Card className="p-6 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading receptionists...</span>
          </Card>
        ) : receptionists.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-500 text-center">
              No receptionists registered yet
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {receptionists.map((receptionist) => (
              <Card
                key={receptionist._id}
                className="p-4 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {receptionist.user?.name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {receptionist.user?.email}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Department:</span>
                      <p className="font-medium">{receptionist.department}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium">
                        {receptionist.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span
                    className={`px-3 py-1 text-xs rounded-full text-center font-semibold ${
                      receptionist.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {receptionist.status || "pending"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditReceptionist(receptionist)}
                      className="gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleDeactivateReceptionist(receptionist._id)
                      }
                      className="gap-1 text-yellow-600"
                    >
                      <Ban className="h-4 w-4" />
                      Deactive
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteReceptionist(receptionist._id)}
                      className="gap-1 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Doctor Modal */}
      {showAddDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">
                {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
              </h3>
              <button
                onClick={() => {
                  setShowAddDoctor(false);
                  setEditingDoctor(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <AddDoctorForm
                mode={editingDoctor ? "edit" : "create"}
                doctor={editingDoctor}
                onSuccess={handleDoctorSuccess}
                onCancel={() => {
                  setShowAddDoctor(false);
                  setEditingDoctor(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Receptionist Modal */}
      {showAddReceptionist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">
                {editingReceptionist
                  ? "Edit Receptionist"
                  : "Add New Receptionist"}
              </h3>
              <button
                onClick={() => {
                  setShowAddReceptionist(false);
                  setEditingReceptionist(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <AddReceptionistForm
                mode={editingReceptionist ? "edit" : "create"}
                receptionist={editingReceptionist}
                onSuccess={handleReceptionistSuccess}
                onCancel={() => {
                  setShowAddReceptionist(false);
                  setEditingReceptionist(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaffPage;
