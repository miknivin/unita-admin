"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CompanyView({ isOpen, onClose, company }) {
  const [formData, setFormData] = useState({
    name: company?.name || "",
    contactEmail: company?.contactEmail || "",
    contactPhone: company?.contactPhone || "",
    website: company?.website || "",
    description: company?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedCompany = {
        name: formData.name,
        contactEmail: formData.contactEmail || undefined,
        contactPhone: formData.contactPhone || undefined,
        website: formData.website || undefined,
        description: formData.description || undefined,
      };

      const response = await axios.put(
        `/api/company/${company._id}`,
        updatedCompany
      );
      toast.success("Company updated successfully");
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/75 bg-black bg-opacity-50 z-50">
      <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {company?.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-2">
          <label className="block text-gray-900 dark:text-white">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <label className="block text-gray-900 dark:text-white">Email:</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />

          <label className="block text-gray-900 dark:text-white">Phone:</label>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />

          <label className="block text-gray-900 dark:text-white">
            Website:
          </label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />

          <label className="block text-gray-900 dark:text-white">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Buttons */}
          <div className="py-4 border-t border-gray-200 dark:border-gray-600 flex justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
