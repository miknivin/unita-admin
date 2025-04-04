// app/api/jobPosts/[id]/route.js
import { authorizeRoles, isAuthenticatedUser } from "@/app/middlewares/adminAuth";
import { JobPost } from "@/models/Jobpost";
import { NextResponse } from "next/server";

// GET: Retrieve a job post by ID
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const jobPost = await JobPost.findById(id).populate("company");
    if (!jobPost) {
      return NextResponse.json(
        {
          success: false,
          message: "Job post not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: jobPost,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error retrieving job post",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const user = await isAuthenticatedUser(req);

    // Authorize admin
    authorizeRoles(user, "admin");
    const jobPost = await JobPost.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate("company");
    if (!jobPost) {
      return NextResponse.json(
        {
          success: false,
          message: "Job post not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: jobPost,
      message: "Job post updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error updating job post",
      },
      { status: 400 }
    );
  }
}

// DELETE: Delete a job post by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const jobPost = await JobPost.findByIdAndDelete(id);
    const user = await isAuthenticatedUser(req);

    // Authorize admin
    authorizeRoles(user, "admin");

    if (!jobPost) {
      return NextResponse.json(
        {
          success: false,
          message: "Job post not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Job post deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error deleting job post",
      },
      { status: 500 }
    );
  }
}
