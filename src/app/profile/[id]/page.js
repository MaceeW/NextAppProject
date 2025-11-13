import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchProfileData(id) {
    const profile = await prisma.profiles.findUnique({
        where: { id: parseInt(id) },
    });
    if (!profile) {
        throw new Error('Profile not found');
    }
    return profile;
}

export default async function ProfilePage({ params }) {
    const { id } = await params;
    const profileData = await fetchProfileData(id);

    return (
        <main>
            <div className="section">
                <div className="container">
                    <h1>{profileData.name}</h1>
                    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', background: '#f9f9f9', borderRadius: '8px' }}>
                        {profileData.image_url && (
                            <img 
                                src={profileData.image_url} 
                                alt={`Profile picture of ${profileData.name}`}
                                style={{ width: '200px', height: '200px', borderRadius: '50%', margin: '0 auto 2rem', display: 'block', objectFit: 'cover' }}
                            />
                        )}
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 'bold' }}>Title:</h2>
                            <p style={{ margin: 0 }}>{profileData.title || 'N/A'}</p>
                        </div>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 'bold' }}>Email:</h2>
                            <p style={{ margin: 0 }}>{profileData.email || 'N/A'}</p>
                        </div>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 'bold' }}>Bio:</h2>
                            <p style={{ margin: 0, textAlign: 'right', maxWidth: '300px' }}>{profileData.bio || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}