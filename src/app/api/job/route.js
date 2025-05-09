import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/app/middlewares/adminAuth";
import { JobPost } from "@/models/Jobpost.js";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import NextCors from "nextjs-cors";

export async function GET(request) {
  try {
    await dbConnect();
    const jobPosts = await JobPost.find().populate("company");

    return NextResponse.json(
      {
        success: true,
        data: jobPosts,
        count: jobPosts.length,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // or restrict to your frontend URL
          "Access-Control-Allow-Methods": "GET,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error retrieving job posts",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

// Handle OPTIONS preflight request
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // or your frontend domain
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect();
    const user = await isAuthenticatedUser(req);

    authorizeRoles(user, "admin");
    const jobPost = new JobPost(body);
    const savedJobPost = await jobPost.save();
    return NextResponse.json(
      {
        success: true,
        data: savedJobPost,
        message: "Job post created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error creating job post",
      },
      { status: 400 }
    );
  }
}
