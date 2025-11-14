import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)
    const profile = await prisma.profiles.findUnique({ where: { id } })
    if (!profile) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ data: profile }, { status: 200 })
  } catch (error) {
    console.error('GET /api/profiles/[id] error', error)
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const formData = await request.formData()
    const name = formData.get('name')
    const title = formData.get('title')
    const email = formData.get('email')
    const bio = formData.get('bio')
    const imgFile = formData.get('img')

    const updateData = {}
    if (name) updateData.name = name.trim()
    if (title) updateData.title = title.trim()
    if (email) updateData.email = email.trim()
    if (bio) updateData.bio = bio.trim()

    if (imgFile && imgFile.size && imgFile.size > 0) {
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN
      if (!blobToken) {
        return Response.json({ error: 'Blob storage token not configured (BLOB_READ_WRITE_TOKEN)' }, { status: 500 })
      }
      const blob = await put(imgFile.name, imgFile, {
        access: 'public',
        token: blobToken,
      })
      updateData.image_url = blob.url
    }

    const updated = await prisma.profiles.update({ where: { id }, data: updateData })
    return Response.json({ data: updated }, { status: 200 })
  } catch (error) {
    console.error('PUT /api/profiles/[id] error', error)
    if (error.code === 'P2025') {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }
    return Response.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    await prisma.profiles.delete({ where: { id } })
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/profiles/[id] error', error)
    if (error.code === 'P2025') {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }
    return Response.json({ error: 'Failed to delete profile' }, { status: 500 })
  }
}
