"use client"
import { useRouter } from "next/navigation"

export default function ProfileActions({ id }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this profile? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/profiles/${id}`, { method: 'DELETE' })
      if (res.status === 204) {
        router.push('/')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to delete')
    }
  }

  const goEdit = () => router.push(`/profile/${id}/edit`)

  return (
    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
      <button onClick={goEdit} style={{ padding: '0.5rem 1rem' }}>Edit</button>
      <button onClick={handleDelete} style={{ padding: '0.5rem 1rem', background: '#c00', color: '#fff' }}>Delete</button>
    </div>
  )
}
