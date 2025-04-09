"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cross from "../icons/Cross";
import AddCompany from "../modals/AddCompany";
import Link from "next/link";

const schema = yup.object().shape({
  jobTitle: yup.string().required("Job title is required"),
  company: yup.string().required("Company is required"),
  jobLocation: yup.string().optional(),
  salaryRange: yup.object().shape({
    aed: yup
      .object()
      .optional()
      .shape({
        min: yup
          .number()
          .nullable()
          .optional()
          .min(0, "Minimum AED salary cannot be negative"),
        max: yup
          .number()
          .nullable()
          .optional()
          .test(
            "max-gte-min",
            "Max AED salary must be greater than or equal to min AED salary",
            function (value) {
              const min = this.parent.min;
              return !min || !value || value >= min;
            }
          ),
      }),
    usd: yup
      .object()
      .optional()
      .shape({
        min: yup
          .number()
          .nullable()
          .optional()
          .min(0, "Minimum USD salary cannot be negative"),
        max: yup
          .number()
          .nullable()
          .optional()
          .test(
            "max-gte-min",
            "Max USD salary must be greater than or equal to min USD salary",
            function (value) {
              const min = this.parent.min;
              return !min || !value || value >= min;
            }
          ),
      }),
  }),
  jobDescription: yup.string().required("Job description is required"),
  keyResponsibilities: yup
    .array()
    .of(yup.string())
    .min(1, "At least one responsibility is required")
    .required("Key responsibilities are required"),
  requiredSkillsAndQualifications: yup
    .array()
    .of(yup.string())
    .min(1, "At least one skill or qualification is required")
    .required("Required skills and qualifications are required"),
  benefits: yup.array().of(yup.string()).optional(),
  applicationDeadline: yup
    .date()
    .required("Application deadline is required")
    .typeError("Application deadline must be a valid date"),
});

export default function UpdateJob() {
  const pathname = usePathname();
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempInput, setTempInput] = useState({
    benefits: "",
    skills: "",
    responsibilities: "",
  });

  const router = useRouter();
  const params = useParams();
  const jobId = params?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      company: "",
      jobTitle: "",
      jobLocation: "",
      salaryRange: {
        aed: { min: "", max: "" },
        usd: { min: "", max: "" },
      },
      jobDescription: "",
      keyResponsibilities: [],
      requiredSkillsAndQualifications: [],
      benefits: [],
      applicationDeadline: "",
    },
  });

  const formData = watch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesResponse, jobResponse] = await Promise.all([
          axios.get("/api/company"),
          jobId
            ? axios.get(`/api/job/${jobId}`)
            : Promise.resolve({ data: null }),
        ]);
        setCompanies(companiesResponse.data.data || []);
        if (jobResponse.data && jobId) {
          const jobData = jobResponse.data.data;
          reset({
            company: jobData.company?._id || jobData.company || "",
            jobTitle: jobData.jobTitle || "",
            jobLocation: jobData.jobLocation || "",
            salaryRange: {
              aed: {
                min: jobData.salaryRange?.aed?.min ?? "",
                max: jobData.salaryRange?.aed?.max ?? "",
              },
              usd: {
                min: jobData.salaryRange?.usd?.min ?? "",
                max: jobData.salaryRange?.usd?.max ?? "",
              },
            },
            jobDescription: jobData.jobDescription || "",
            keyResponsibilities: jobData.keyResponsibilities || [],
            requiredSkillsAndQualifications:
              jobData.requiredSkillsAndQualifications || [],
            benefits: jobData.benefits || [],
            applicationDeadline: jobData.applicationDeadline
              ? new Date(jobData.applicationDeadline)
                  .toISOString()
                  .split("T")[0]
              : "",
          });
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId, reset]);
  useEffect(() => {
    if (!isModalOpen) {
      const fetchCompanies = async () => {
        try {
          const response = await axios.get("/api/company");
          setCompanies(response.data.data || []);
        } catch (err) {
          setError("Failed to load companies. Please try again.");
        }
      };
      fetchCompanies();
    }
  }, [isModalOpen]);

  const handleTempInputChange = (e) => {
    const { name, value } = e.target;
    setTempInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addToArrayField = (field, value) => {
    if (value.trim()) {
      const updatedArray = [...formData[field], value.trim()];
      setValue(field, updatedArray, { shouldValidate: true });
      setTempInput((prev) => ({
        ...prev,
        [field === "keyResponsibilities"
          ? "responsibilities"
          : field === "requiredSkillsAndQualifications"
          ? "skills"
          : field]: "",
      }));
    }
  };

  const removeFromArrayField = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setValue(field, updatedArray, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        company: data.company,
        jobTitle: data.jobTitle,
        jobLocation: data.jobLocation || undefined,
        salaryRange: {
          aed: {
            min: data.salaryRange.aed.min || undefined,
            max: data.salaryRange.aed.max || undefined,
          },
          usd: {
            min: data.salaryRange.usd.min || undefined,
            max: data.salaryRange.usd.max || undefined,
          },
        },
        jobDescription: data.jobDescription,
        keyResponsibilities: data.keyResponsibilities,
        requiredSkillsAndQualifications: data.requiredSkillsAndQualifications,
        benefits: data.benefits.length ? data.benefits : undefined,
        applicationDeadline: data.applicationDeadline,
      };

      const response = await axios.put(`/api/job/${jobId}`, payload);
      setSuccess("Job post updated successfully!");
      setTimeout(() => router.push("/home/jobs"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating job post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="py-8 px-4 mx-auto lg:py-16 max-w-screen-lg">
        <div className="flex justify-between">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Job ID - {jobId.slice(-6)}
          </h2>
          <Link
            href={`${pathname}/applicants`}
            className="bg-blue-600 p-3 rounded-lg"
          >
            View Applicants
          </Link>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && (
          <div className="text-green-500 text-sm mb-4">{success}</div>
        )}
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="jobTitle"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Job title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  {...register("jobTitle")}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type job title"
                />
                {errors.jobTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="applicationDeadline"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Application deadline
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  id="applicationDeadline"
                  {...register("applicationDeadline")}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
                {errors.applicationDeadline && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.applicationDeadline.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="company"
                  className="flex justify-between mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  <p>Company</p>
                  <button
                    role="button"
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-blue-600 underline"
                  >
                    Add Company
                  </button>
                </label>
                <select
                  id="company"
                  {...register("company")}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.company.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="jobLocation"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Job Location
                </label>
                <input
                  type="text"
                  id="jobLocation"
                  {...register("jobLocation")}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter job location"
                />
                {errors.jobLocation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.jobLocation.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Salary Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="salaryAedMin"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      AED (Min)
                    </label>
                    <input
                      type="number"
                      id="salaryAedMin"
                      {...register("salaryRange.aed.min")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Min AED salary"
                    />
                    {errors.salaryRange?.aed?.min && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salaryRange.aed.min.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="salaryAedMax"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      AED (Max)
                    </label>
                    <input
                      type="number"
                      id="salaryAedMax"
                      {...register("salaryRange.aed.max")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Max AED salary"
                    />
                    {errors.salaryRange?.aed?.max && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salaryRange.aed.max.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="salaryUsdMin"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      USD (Min)
                    </label>
                    <input
                      type="number"
                      id="salaryUsdMin"
                      {...register("salaryRange.usd.min")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Min USD salary"
                    />
                    {errors.salaryRange?.usd?.min && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salaryRange.usd.min.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="salaryUsdMax"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      USD (Max)
                    </label>
                    <input
                      type="number"
                      id="salaryUsdMax"
                      {...register("salaryRange.usd.max")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Max USD salary"
                    />
                    {errors.salaryRange?.usd?.max && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salaryRange.usd.max.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-3 block text-sm font-medium text-gray-900 dark:text-white">
                  Benefits
                </label>
                <div className="relative mb-6">
                  <input
                    type="text"
                    id="benefits"
                    name="benefits"
                    value={tempInput.benefits}
                    onChange={handleTempInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary bg-gray-50 border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Add a benefit"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addToArrayField("benefits", tempInput.benefits)
                    }
                    className="text-white absolute end-2.5 top-1.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Add
                  </button>
                </div>
                <div className="px-6.5 mt-4 flex gap-3 flex-wrap">
                  {formData.benefits.map((benefit, index) => (
                    <button
                      key={index}
                      type="button"
                      className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-start text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {benefit}
                      <span
                        onClick={() => removeFromArrayField("benefits", index)}
                        className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full cursor-pointer"
                      >
                        <Cross />
                      </span>
                    </button>
                  ))}
                </div>
                {errors.benefits && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.benefits.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-3 block text-sm font-medium text-gray-900 dark:text-white">
                  Required Skills and Qualifications
                </label>
                <div className="relative mb-6">
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={tempInput.skills}
                    onChange={handleTempInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary bg-gray-50 border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Add a skill or qualification"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addToArrayField(
                        "requiredSkillsAndQualifications",
                        tempInput.skills
                      )
                    }
                    className="text-white absolute end-2.5 top-1.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Add
                  </button>
                </div>
                <div className="px-6.5 mt-4 flex gap-3 flex-wrap">
                  {formData.requiredSkillsAndQualifications.map(
                    (skill, index) => (
                      <button
                        key={index}
                        type="button"
                        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        {skill}
                        <span
                          onClick={() =>
                            removeFromArrayField(
                              "requiredSkillsAndQualifications",
                              index
                            )
                          }
                          className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full cursor-pointer"
                        >
                          <Cross />
                        </span>
                      </button>
                    )
                  )}
                </div>
                {errors.requiredSkillsAndQualifications && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.requiredSkillsAndQualifications.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-3 block text-sm font-medium text-gray-900 dark:text-white">
                  Key Responsibilities
                </label>
                <div className="relative mb-6">
                  <input
                    type="text"
                    id="responsibilities"
                    name="responsibilities"
                    value={tempInput.responsibilities}
                    onChange={handleTempInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary bg-gray-50 border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Add a responsibility"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addToArrayField(
                        "keyResponsibilities",
                        tempInput.responsibilities
                      )
                    }
                    className="text-white absolute end-2.5 top-1.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Add
                  </button>
                </div>
                <div className="px-6.5 mt-4 flex gap-3 flex-wrap">
                  {formData.keyResponsibilities.map((responsibility, index) => (
                    <button
                      key={index}
                      type="button"
                      className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-start text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {responsibility}
                      <span
                        onClick={() =>
                          removeFromArrayField("keyResponsibilities", index)
                        }
                        className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full cursor-pointer"
                      >
                        <Cross />
                      </span>
                    </button>
                  ))}
                </div>
                {errors.keyResponsibilities && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.keyResponsibilities.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="jobDescription"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="jobDescription"
                  rows={8}
                  {...register("jobDescription")}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your description here"
                />
                {errors.jobDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.jobDescription.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-4 sm:mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
                } rounded-lg`}
              >
                {loading ? "Updating Job..." : "Update Job"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/home/jobs")}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      {isModalOpen && <AddCompany onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
