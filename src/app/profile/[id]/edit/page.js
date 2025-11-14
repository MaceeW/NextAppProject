import EditProfileForm from './EditProfileForm'

export default function EditPage({ params }) {
  const { id } = params
  return (
    <main>
      <div className="section">
        <div className="container">
          <h1>Edit Profile</h1>
          <EditProfileForm id={id} />
        </div>
      </div>
    </main>
  )
}
