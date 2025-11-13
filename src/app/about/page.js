import '../styles/about.css';

export default function AboutPage() {
    return (
        <main>
            <div className="section">
                <div className="container">
                    <h1 className="about-main-title">About This App</h1>

                    <div className="about-section">
                        <h2 className="about-section-heading">Key Features</h2>
                        <ul className="about-features-list">
                            <li>✨ <span className="about-highlight">Create Profiles</span> - Add new profiles with images and details</li>
                            <li>🔍 <span className="about-highlight">Search & Filter</span> - Find profiles by title or name</li>
                            <li>📱 <span className="about-highlight">Responsive Design</span> - Works on all devices</li>
                            <li>🎨 <span className="about-highlight">Modern UI</span> - Clean and intuitive interface</li>
                            <li>⚡ <span className="about-highlight">Fast Performance</span> - Built with Next.js and Prisma</li>
                        </ul>
                    </div>

                    <div className="about-section">
                        <h2 className="about-section-heading">Getting Started</h2>
                        <ol className="about-getting-started">
                            <li>Navigate to the <span className="about-highlight">Add a Profile</span> page</li>
                            <li>Fill in your profile information and upload an image</li>
                            <li>Click submit to create your profile</li>
                            <li>View all profiles on the <span className="about-highlight">home page</span></li>
                            <li>Use filters to search by title</li>
                        </ol>
                    </div>

                    <div className="about-cta">
                        <h3>Ready to create your profile?</h3>
                        <p>Head over to the "Add a Profile" page and get started!</p>
                    </div>
                </div>
            </div>
        </main>
    );
}