"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ApplicantTableToolbar from "../shared/ApplicantTableToolbar";
import { usePathname } from "next/navigation";
import ApplicantsTables from "../tables/ApplicantsTable";

export default function ApplicantWrap() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false); // Track client-side mount
  const pathname = usePathname();
  const jobId = pathname?.split("/")[3];

  const fetchApplicants = async () => {
    try {
      console.log(jobId);
      const response = await axios.get(`/api/job/applicants/${jobId}`);
      setApplicants(response.data.data || response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setError("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true); // Mark as mounted on client
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const filteredApplicants = applicants.filter((applicant) => {
    const searchString = `${applicant.fullName || ""} ${
      applicant.email || ""
    } ${applicant.phone || ""} ${applicant.coverLetter || ""}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (!isMounted) {
    return null; // Render nothing on server
  }

  return (
    <>
      <ApplicantTableToolbar onSearch={handleSearch} />
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <ApplicantsTables
          applicants={filteredApplicants}
          fetchApplicants={fetchApplicants}
        />
      )}
    </>
  );
}
