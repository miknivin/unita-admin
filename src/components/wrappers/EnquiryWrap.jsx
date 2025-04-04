"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import TableToolBar from "../shared/TableToolBar";
import ContactTables from "../tables/ContactTables";

export default function EnquiryWrap() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/api/contacts");
        setContacts(response.data.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter((contact) => {
    const searchString = `${contact.firstName || ""} ${
      contact.lastName || ""
    } ${contact.email || ""} ${contact.phoneNo || ""} ${
      contact.subject || ""
    } ${contact.message || ""} ${contact.serviceInterestedIn.join(
      ""
    )} `.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Handler for search input from TableToolBar
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      <TableToolBar onSearch={handleSearch} />
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <ContactTables contacts={filteredContacts} />
      )}
    </>
  );
}
