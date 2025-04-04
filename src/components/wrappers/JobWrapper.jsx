"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import JobsTableToolBar from "../shared/JobsTableToolbar";
import JobsTable from "../tables/JobsTable";

export default function JobsWrap() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await axios.get("/api/job");
      setJobs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs?.filter((job) => {
    const searchString = `
      ${job.jobTitle || ""}
      ${job.jobLocation || ""}
      ${job.jobDescription || ""}
      ${job.company?.name || ""}
      ${job.status || ""}
    `.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      <JobsTableToolBar onSearch={handleSearch} />
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <JobsTable jobs={filteredJobs} fetchJobs={fetchJobs} />
      )}
    </>
  );
}
