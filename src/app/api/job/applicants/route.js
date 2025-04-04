import { NextResponse } from "next/server";
import { Applicant } from "@/models/Applicant";
import dbConnect from "@/utils/dbConnect";

// POST: Create a new applicant
export async function POST(req) {
  try {
    await dbConnect();

    const { jobPost, fullName, email, phone, resume, coverLetter } =
      await req.json();

    if (!jobPost || !fullName || !email || !phone || !resume) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }


    const newApplicant = new Applicant({
      jobPost,
      fullName,
      email,
      phone,
      resume,
      coverLetter,
    });

    await newApplicant.save();

    return NextResponse.json(
      { message: "Applicant created successfully", applicant: newApplicant },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating applicant:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
