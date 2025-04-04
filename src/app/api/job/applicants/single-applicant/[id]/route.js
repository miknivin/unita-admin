import { NextResponse } from "next/server";
import { Applicant } from "@/models/Applicant";
import dbConnect from "@/utils/dbConnect";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Applicant ID is required" },
        { status: 400 }
      );
    }

    const applicant = await Applicant.findById(id).populate("jobPost");

    if (!applicant) {
      return NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(applicant, { status: 200 });
  } catch (error) {
    console.error("Error fetching applicant:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE an applicant by ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Applicant ID is required" },
        { status: 400 }
      );
    }

    const deletedApplicant = await Applicant.findByIdAndDelete(id);

    if (!deletedApplicant) {
      return NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Applicant deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting applicant:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Applicant ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await req.json();

    // Validate required fields (optional, adjust as needed)
    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Full name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Update the applicant
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      id,
      { $set: body }, // Use $set to update only provided fields
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedApplicant) {
      return NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Applicant updated successfully", data: updatedApplicant },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating applicant:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
