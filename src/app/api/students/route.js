// Use the generated Prisma Client from your configured output path
// Note: When using a custom Prisma client output, import from the 'client' entry file
import { prisma } from '@/lib/prisma'

// Ensure this route runs on the Node.js runtime (not Edge),
// so Prisma can use a direct database connection (postgresql://)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : undefined;
    const name = searchParams.get("name") || "";
    const major = searchParams.get("major") || "";
 
  const students = await prisma.students.findMany({
    where: {
      AND: [
        year && !isNaN(year) ? { year: year } : {},
        name ? { name: { contains: name, mode: 'insensitive' } } : {},
        major ? { major: { contains: major, mode: 'insensitive' } } : {},
      ],
    },
  });
  return Response.json({ data: students }, { status: 200 });
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
