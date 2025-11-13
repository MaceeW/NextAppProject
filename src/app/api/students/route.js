// Use the generated Prisma Client from your configured output path
// Note: When using a custom Prisma client output, import from the 'client' entry file
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Ensure this route runs on the Node.js runtime (not Edge),
// so Prisma can use a direct database connection (postgresql://)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year") || "";
    const name = searchParams.get("name") || "";
    const major = searchParams.get("major") || "";
 
  const students = await prisma.students.findMany();
  let filteredProfiles = students;

  if (year) {
    filteredProfiles = filteredProfiles.filter(
      (profile) => profile.year.toString() === year
    );
  }
  if (name) {
    filteredProfiles = filteredProfiles.filter(
      (profile) => profile.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (major) {
    filteredProfiles = filteredProfiles.filter(
      (profile) => profile.major.toLowerCase() === major.toLowerCase()
    );
  }
  return Response.json({ data: filteredProfiles }, { status: 200 });
}
export async function POST(request) {
  const newProfile = await request.json();
  try {
    if (!newProfile.name || newProfile.name.trim() === "") {
      return Response.json({ error: "Name is required" }, { status: 400 });
    } else if (!newProfile.major || newProfile.major.trim() === "") {
      return Response.json({ error: "Major is required" }, { status: 400 });
    } else if (
      !newProfile.year ||
      isNaN(newProfile.year) ||
      newProfile.year < 1 ||
      newProfile.year > 4
    ) {
      return Response.json({ error: "Valid year is required" }, { status: 400 });
    } else if (
      newProfile.gpa === undefined ||
      newProfile.gpa === null ||
      isNaN(newProfile.gpa) ||
      newProfile.gpa < 0 ||
      newProfile.gpa > 4
    ) {
      return Response.json({ error: "Valid GPA is required" }, { status: 400 });
    }

    const created = await prisma.students.create({
      data: {
        name: newProfile.name.trim(),
        major: newProfile.major.trim(),
        year: parseInt(newProfile.year),
        gpa: parseFloat(newProfile.gpa),
      },
    });
    return Response.json(created, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Invalid data format" }, { status: 400 });
  }
}
export async function DELETE(request) {
  const searchParams = request.nextUrl.searchParams;
  const idParam = searchParams.get("id");
  const id = idParam ? parseInt(idParam) : NaN;
  if (isNaN(id)) {
    return Response.json({ error: "Valid id is required" }, { status: 400 });
  }
  try {
    await prisma.students.delete({ where: { id } });
    return Response.json({ message: "Profile deleted" }, { status: 200 });
  } catch (e) {
    // Prisma P2025: Record to delete does not exist.
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }
}
