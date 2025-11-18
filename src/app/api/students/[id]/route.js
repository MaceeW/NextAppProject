import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const { id } = await params
  const parsedId = parseInt(id)
  if (isNaN(parsedId)) {
    return Response.json({ error: 'Valid id is required' }, { status: 400 })
  }
  const profile = await prisma.students.findUnique({ where: { id: parsedId } })
  if (!profile) {
    return Response.json({ error: 'Profile not found' }, { status: 404 })
  }
  return Response.json(profile, { status: 200 })
}

export async function PUT(request, { params }) {
  const body = await request.json()
  const { id } = await params
  const parsedId = parseInt(id)
  if (isNaN(parsedId)) {
    return Response.json({ error: 'Valid id is required' }, { status: 400 })
  }
  try {
    if (!body.name || body.name.trim() === '') {
      return Response.json({ error: 'Name is required' }, { status: 400 })
    } else if (!body.major || body.major.trim() === '') {
      return Response.json({ error: 'Major is required' }, { status: 400 })
    } else if (
      body.year === undefined ||
      body.year === null ||
      isNaN(body.year) ||
      body.year < 1 ||
      body.year > 4
    ) {
      return Response.json({ error: 'Valid year is required' }, { status: 400 })
    } else if (
      body.gpa === undefined ||
      body.gpa === null ||
      isNaN(body.gpa) ||
      body.gpa < 0 ||
      body.gpa > 4
    ) {
      return Response.json({ error: 'Valid GPA is required' }, { status: 400 })
    }

    const updated = await prisma.students.update({
      where: { id: parsedId },
      data: {
        name: body.name.trim(),
        major: body.major.trim(),
        year: parseInt(body.year),
        gpa: parseFloat(body.gpa),
      },
    })
    return Response.json(updated, { status: 200 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }
    return Response.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params
  const parsedId = parseInt(id)
  if (isNaN(parsedId)) {
    return Response.json({ error: 'Valid id is required' }, { status: 400 })
  }
  try {
    await prisma.students.delete({ where: { id: parsedId } })
    return Response.json({ message: 'Profile deleted' }, { status: 200 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }
    return Response.json({ error: 'Failed to delete profile' }, { status: 500 })
  }
}
