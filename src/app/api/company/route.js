import { NextResponse } from "next/server";
import { Company } from "@/models/Company";
import dbConnect from "@/lib/db/connection";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "@/app/middlewares/adminAuth";

export async function GET(req) {
  try {
    await dbConnect();

    // Authenticate user
    const user = await isAuthenticatedUser(req);

    // Authorize admin
    authorizeRoles(user, "admin");

    const companies = await Company.find({});
    return NextResponse.json(
      { success: true, data: companies },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 403 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    // Authenticate user
    const user = await isAuthenticatedUser(req);
    console.log(user, "user");

    // Authorize admin
    authorizeRoles(user, "admin");

    const body = await req.json();
    const company = new Company(body);
    const savedCompany = await company.save();

    return NextResponse.json(
      { success: true, data: savedCompany },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 403 }
    );
  }
}
