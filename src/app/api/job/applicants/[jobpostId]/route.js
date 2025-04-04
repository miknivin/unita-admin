import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { Applicant } from "@/models/Applicant";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { jobpostId } = await params;
    // console.log(params);

    if (!jobpostId) {
      return NextResponse.json(
        { error: "JobPost ID is required" },
        { status: 400 }
      );
    }

    const applicants = await Applicant.find({ jobPost: jobpostId }).populate(
      "jobPost"
    );

    return NextResponse.json(applicants, { status: 200 });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
