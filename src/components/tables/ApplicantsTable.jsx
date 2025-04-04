// components/tables/ApplicantsTables.jsx
import { useState } from "react";
import axios from "axios";

import toast from "react-hot-toast";
import ApplicantView from "../modals/ApplicantView";

export default function ApplicantsTables({ applicants, fetchApplicants }) {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Loading state for deletion

  const handleOpenModal = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchApplicants();
    setSelectedApplicant(null);
  };

  const handleDelete = async (applicantId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this applicant?"
    );
    if (!confirmDelete) return;

    setDeletingId(applicantId);
    try {
      await axios.delete(`/api/job/applicants/single-applicant/${applicantId}`);
      await fetchApplicants(); // Refresh the applicant list
      toast.success("Applicant deleted successfully");
    } catch (error) {
      console.error("Error deleting applicant:", error);
      toast.error("Error deleting applicant");
    } finally {
      setDeletingId(null); // Clear loading state
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full max-w-screen-xl">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Resume
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <tr
                  key={applicant._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {applicant.fullName}
                  </th>
                  <td className="px-6 py-4">{applicant.email}</td>
                  <td className="px-6 py-4">{applicant.phone}</td>
                  <td className="px-6 py-4">
                    <a
                      href={applicant.resume?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </td>
                  <td className="px-6 py-4">{applicant.status}</td>
                  <td className="px-6 py-4 text-right flex gap-3">
                    <button
                      onClick={() => handleOpenModal(applicant)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(applicant._id)}
                      disabled={deletingId === applicant._id}
                      className={`font-medium text-red-600 dark:text-red-500 hover:underline ${
                        deletingId === applicant._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {deletingId === applicant._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No applicants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedApplicant && (
        <ApplicantView
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          applicant={selectedApplicant}
        />
      )}
    </>
  );
}
