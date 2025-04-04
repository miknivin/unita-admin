import Contact from "@/models/Contacts";
import dbConnect from "@/utils/dbConnect";

export async function GET() {
  await dbConnect();

  try {
    const contacts = await Contact.find({});
    return Response.json({ success: true, data: contacts });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
