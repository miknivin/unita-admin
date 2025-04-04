// components/tables/CompaniesTables.jsx
import { useState } from "react";
import axios from "axios";
import CompanyView from "../modals/CompanyView";
import toast from "react-hot-toast";

export default function CompaniesTables({ companies, fetchCompanies }) {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Add loading state for deletion

  const handleOpenModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const handleDelete = async (companyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company? All associated jobs will also be deleted."
    );
    if (!confirmDelete) return;

    setDeletingId(companyId); // Set the loading state for the specific company
    try {
      await axios.delete(`/api/company/${companyId}`);
      await fetchCompanies();
      toast.success("Company deleted successfully");
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Error deleting company");
    } finally {
      setDeletingId(null); // Clear the loading state
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full max-w-screen-xl">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Website
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((company) => (
                <tr
                  key={company._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {company.name}
                  </th>
                  <td className="px-6 py-4">{company.contactEmail}</td>
                  <td className="px-6 py-4">{company.contactPhone}</td>
                  <td className="px-6 py-4">{company.website}</td>
                  <td className="px-6 py-4 text-right flex gap-3">
                    <button
                      onClick={() => handleOpenModal(company)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      disabled={deletingId === company._id}
                      className={`font-medium text-red-600 dark:text-red-500 hover:underline ${
                        deletingId === company._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {deletingId === company._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedCompany && (
        <CompanyView
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          company={selectedCompany}
        />
      )}
    </>
  );
}
