import { useState } from "react";
import ContactView from "../modals/ContactView";

export default function ContactTables({ contacts }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
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
                Subject
              </th>
              <th scope="col" className="px-6 py-3">
                Interested in
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {contact.firstName} {contact.lastName}
                  </th>
                  <td className="px-6 py-4">{contact.email}</td>
                  <td className="px-6 py-4">{contact.phone}</td>
                  <td className="px-6 py-4">{contact.subject}</td>
                  <td className="px-6 py-4">
                    {contact.serviceInterestedIn?.map((interest, index) => (
                      <p key={index}>{interest}</p>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenModal(contact)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      View
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
      <ContactView
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contact={selectedContact}
      />
    </>
  );
}
