"use client;";

import Link from "next/link";
import RedirectIcon from "../icons/Redirect";

export default function MenuGrid() {
  return (
    <>
      <div className="grid grid-cols-8 md:grid-cols-6 gap-4">
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 col-span-2">
          <a href="#">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Website Enquiries
            </h5>
          </a>
          <Link
            href={"/home/enquiries"}
            className="inline-flex font-medium items-center text-blue-600 hover:underline"
          >
            Go to page
            <RedirectIcon />
          </Link>
        </div>
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 col-span-2">
          <a href="#">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Companies
            </h5>
          </a>
          <Link
            href={"/home/companies"}
            className="inline-flex font-medium items-center text-blue-600 hover:underline"
          >
            Go to page
            <RedirectIcon />
          </Link>
        </div>
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 col-span-2">
          <a href="#">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Jobs
            </h5>
          </a>
          <Link
            href={"/home/jobs"}
            className="inline-flex font-medium items-center text-blue-600 hover:underline"
          >
            Go to page
            <RedirectIcon />
          </Link>
        </div>
      </div>
    </>
  );
}
