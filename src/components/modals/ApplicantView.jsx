// components/modals/ApplicantView.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ApplicantView({ isOpen, onClose, applicant }) {
  // Move all hooks to the top, unconditionally
  const [formData, setFormData] = useState({
    fullName: applicant?.fullName || "",
    email: applicant?.email || "",
    phone: applicant?.phone || "",
    coverLetter: applicant?.coverLetter || "",
    status: applicant?.status || "Pending",
  });

  const [isSaving, setIsSaving] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `/api/job/applicants/single-applicant/${applicant._id}`,
        formData
      );
      toast.success("Applicant updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating applicant:", error);
      toast.error("Failed to update applicant");
    } finally {
      setIsSaving(false);
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Applicant: {applicant?.fullName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✖
          </button>
        </div>

        {/* Modal body */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-gray-900 dark:text-white">
              Full Name:
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-900 dark:text-white">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-900 dark:text-white">
              Phone:
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-900 dark:text-white">
              Resume:
            </label>
            <a
              href={applicant?.resume?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Resume
            </a>
          </div>

          {/* <div>
            <label className="block text-gray-900 dark:text-white">Cover Letter:</label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
              rows="3"
            />
          </div> */}

          <div>
            <label className="block text-gray-900 dark:text-white">
              Status:
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
            >
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Modal footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
