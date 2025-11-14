"use client"
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../../add-profile/AddProfile.module.css'

const stripTags = (s) => String(s ?? '').replace(/<\/?[^>]+>/g, '')
const trimCollapse = (s) =>
  String(s ?? '')
    .trim()
    .replace(/\s+/g, ' ')

export default function EditProfileForm({ id }) {
  const router = useRouter()
  const nameRef = useRef(null)
  const [values, setValues] = useState({ name: '', title: '', email: '', bio: '', img: null })
  const [errors, setErrors] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/profiles/${id}`)
        const data = await res.json()
        if (res.ok && data.data) {
          setValues({
            name: data.data.name || '',
            title: data.data.title || '',
            email: data.data.email || '',
            bio: data.data.bio || '',
            img: null,
          })
        } else {
          setErrors(data.error || 'Failed to load')
        }
      } catch (err) {
        console.error(err)
        setErrors('Failed to load')
      }
    }
    fetchData()
  }, [id])

  useEffect(() => { if (nameRef.current) nameRef.current.focus() }, [])

  const onChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'img') {
      const file = files[0]
      if (file && file.size < 1024 * 1024) {
        setValues((p) => ({ ...p, img: file }))
      } else {
        setErrors('Image size should be less than 1MB')
      }
    } else {
      setValues((p) => ({ ...p, [name]: value }))
      setErrors('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors('')
    try {
      const formData = new FormData()
      formData.append('name', stripTags(trimCollapse(values.name)))
      formData.append('title', stripTags(trimCollapse(values.title)))
      formData.append('email', stripTags(trimCollapse(values.email)))
      formData.append('bio', stripTags(values.bio).trim())
      if (values.img) formData.append('img', values.img)

      const res = await fetch(`/api/profiles/${id}`, { method: 'PUT', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')

      setSuccess('Profile updated! Redirecting...')
      setTimeout(() => router.push(`/profile/${id}`), 1200)
    } catch (err) {
      setErrors(err.message || 'Failed to update')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.addProfile}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input ref={nameRef} type="text" name="name" id="name" required value={values.name} onChange={onChange} />

        <label htmlFor="title">Title:</label>
        <input type="text" name="title" id="title" required value={values.title} onChange={onChange} />

        <label htmlFor="email">Email:</label>
        <input type="email" name="email" id="email" required value={values.email} onChange={onChange} />

        <label htmlFor="bio">Bio:</label>
        <textarea name="bio" id="bio" placeholder="Add Bio..." required value={values.bio} onChange={onChange}></textarea>

        <label htmlFor="img">Image (optional to replace):</label>
        <input type="file" name="img" id="img" accept="image/png, image/jpeg, image/jpg, image/gif" onChange={onChange} />

        {errors && <p className={styles.errorMessage}>{errors}</p>}
        <button type="submit" disabled={isSubmitting || !stripTags(trimCollapse(values.name)) || !stripTags(trimCollapse(values.title)) || !stripTags(trimCollapse(values.email)) || !stripTags(values.bio).trim()}>
          Update Profile
        </button>
        {success && <p className={styles.successMessage}>{success}</p>}
      </form>
    </div>
  )
}
