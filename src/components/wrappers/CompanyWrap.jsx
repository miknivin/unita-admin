"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import CompanyTableToolBar from "../shared/CompanyTableToolbar";
import CompaniesTables from "../tables/CompaniesTable";

export default function CompanyWrap() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchCompanies = async () => {
    try {
      const response = await axios.get("/api/company");
      setCompanies(response.data.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const searchString = `${company.name || ""} ${company.contactEmail || ""} ${
      company.contactPhone || ""
    } ${company.description || ""}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      <CompanyTableToolBar onSearch={handleSearch} />
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <CompaniesTables
          companies={filteredCompanies}
          fetchCompanies={fetchCompanies}
        />
      )}
    </>
  );
}
