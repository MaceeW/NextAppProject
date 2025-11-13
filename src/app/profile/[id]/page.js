async function fetchProfileData(id) {
    const response = await fetch(`https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-id.php?id=${id}`, {
        next: { revalidate: 60 },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch profile data');
    }
    return response.json();
}

export default async function ProfilePage({ params }) {
    const { id } = await params;
    const profileData = await fetchProfileData(id);

    return (
        <main>
        <div className="section">
            <div className="container">
            <h1>Profile {id}</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <img src={profileData.image_url} alt={`Profile picture of ${profileData.name}`} className="rounded-full w-24 h-24 mb-4" />
                <p className="text-gray-600 mb-2">User ID: {id}</p>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    <p className="text-gray-700">Name: {profileData.name}</p>
                    <p className="text-gray-700">Email: {profileData.email}</p>
                </div>
            </div>
            </div>
        </div>
        </main>
    );
}