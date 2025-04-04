import Link from "next/link";
import { useState } from "react";

export default function ApplicantTableToolbar() {
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };
  return (
    <>
      <div className="flex items-center justify-between w-full flex-column flex-wrap max-w-screen-xl md:flex-row space-y-4 md:space-y-0 pb-4 ">
        <div>
          <Link
            href={"/home"}
            id="dropdownActionButton"
            data-dropdown-toggle="dropdownAction"
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
          >
            <span className="sr-only">Action button</span>
            Go Back
          </Link>
        </div>
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="flex gap-3">
          {/* <button
            className="p-3 bg-blue-600 text-white rounded-md"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            Add Company
          </button> */}
          <div className="relative flex gap-3">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              onChange={handleInputChange}
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
            />
          </div>
        </div>
      </div>
    </>
  );
}
