import { NextResponse } from "next/server";
import { Company } from "@/models/Company";
import dbConnect from "@/utils/dbConnect";
import { JobPost } from "@/models/Jobpost";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const company = await Company.findById(id);
    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: company }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const company = await Company.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: company }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// app/api/company/[id]/route.js

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params; 

    const company = await Company.findById(id);
    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    const deleteJobsResult = await JobPost.deleteMany({ company: id });
    console.log(
      `Deleted ${deleteJobsResult.deletedCount} job(s) associated with company ${id}`
    );

    // Delete the company
    await Company.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Company and associated jobs deleted successfully",
        deletedJobsCount: deleteJobsResult.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting company and jobs:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
