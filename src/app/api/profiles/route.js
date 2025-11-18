
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient()

 
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name") || "";
    const title = searchParams.get("title") || "";
    const profiles = await prisma.profiles.findMany();
    let filteredProfiles = profiles;
    if (name) {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (title) {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    return Response.json({ data: filteredProfiles }, { status: 200 });
}



export async function POST(request) {
  try {
    const formData = await request.formData();
    console.log("Form Data Received");
    
    const name = formData.get("name");
    const title = formData.get("title");
    const email = formData.get("email");
    const bio = formData.get("bio");
    const imgFile = formData.get("img");
    
    
    if (!name || name.trim() === "") {
      return Response.json({ error: "Name is required" }, { status: 400 });
    } else if (!title || title.trim() === "") {
      return Response.json({ error: "Title is required" }, { status: 400 });
    } else if (!email || email.trim() === "") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    } else if (!bio || bio.trim() === "") {
      return Response.json({ error: "Bio is required" }, { status: 400 });
    } else if (imgFile && imgFile.size > 1024 * 1024) {
      return Response.json({ error: "Image is required and must be less than 1MB" }, { status: 400 });
    }

    

    // Cloudinary setup
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Read file as base64
    const arrayBuffer = await imgFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${imgFile.type};base64,${base64}`;
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "profiles",
    });
    const imageUrl = uploadResult.secure_url;

    

    const created = await prisma.profiles.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        bio: bio.trim(),
        image_url: imageUrl,
      },
    });
    
    return Response.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    if (error.code === 'P2002') {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }
    return Response.json({ error: "Failed to create profile" }, { status: 500 });
  }
} 