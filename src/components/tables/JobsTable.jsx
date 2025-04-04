import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function JobsTable({ jobs, fetchJobs }) {
  const handleDelete = async (jobId) => {
    // Add a confirmation prompt
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job post?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/job/${jobId}`);
      // Refetch jobs to update the table
      await fetchJobs();
      toast.success("Job post deleted");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Error deleting job post");
      //alert("Failed to delete job post. Please try again.");
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full max-w-screen-xl">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Job Title
              </th>
              <th scope="col" className="px-6 py-3">
                Location
              </th>
              <th scope="col" className="px-6 py-3">
                Company
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Deadline
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr
                  key={job._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {job.jobTitle}
                  </th>
                  <td className="px-6 py-4">{job.jobLocation || "N/A"}</td>
                  <td className="px-6 py-4">{job.company?.name || "N/A"}</td>
                  <td className="px-6 py-4">{job.status}</td>
                  <td className="px-6 py-4">
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right flex gap-3 ">
                    <Link
                      href={`/home/jobs/${job._id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
