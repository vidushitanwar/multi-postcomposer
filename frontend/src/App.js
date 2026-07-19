import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import TwitterApp from './twitter/App';
import InstagramComposer from './instagram/InstagramComposer';

const platforms = [
  {
    value: 'instagram',
    label: 'Instagram',
    description: 'Visual posts, media uploads, and scheduled publishing.',
    icon: '📸',
    active: true,
  },
  {
    value: 'twitter',
    label: 'Twitter',
    description: 'Short-form updates, threads, and realtime posting.',
    icon: '🐦',
    active: false,
  },
  {
    value: 'reddit',
    label: 'Reddit',
    description: 'Community-focused posts and discussion threads.',
    icon: '🤖',
    active: false,
  },
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<PlatformPicker />} />
      <Route path="/instagram" element={<InstagramComposer />} />
      <Route path="/reddit" element={<RedditWorkspace />} />
      
      {/* Fallback to Twitter Clone routes */}
      <Route path="*" element={<TwitterApp />} />
    </Routes>
  );
}

function PlatformPicker() {
  const navigate = useNavigate();

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Post Composer Dashboard</p>
          <h1>Select a platform to start composing</h1>
          <p className="hero-copy">
            Create, manage, and schedule posts from a single dashboard. Choose a platform below to begin.
          </p>
        </div>

        <div className="platform-grid">
          {platforms.map((item) => (
            <div
              key={item.value}
              className={`platform-card ${item.value} ${!item.active && item.value === 'reddit' ? 'disabled' : ''}`}
              onClick={() => navigate(`/${item.value}`)}
            >
              <div className="platform-icon-wrapper">
                {item.icon}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <h3>{item.label}</h3>
                <span className="platform-badge">{item.active || item.value === 'twitter' ? 'Active' : 'Soon'}</span>
              </div>
              <p>{item.description}</p>
              <button type="button" className="platform-card-btn">
                {item.active || item.value === 'twitter' ? 'Open Composer' : 'View Demo Workspace'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function RedditWorkspace() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Reddit</p>
          <h1 className="coming-soon-title">Reddit workspace is ready.</h1>
          <p className="coming-soon-copy">Community-focused posts and discussion threads.</p>
        </div>
        <div className="composer-card narrow">
          <p className="coming-soon-title">Composer coming soon</p>
          <p className="coming-soon-copy">
            The same create flow will be wired here next, starting from the shared platform picker.
          </p>
          <button
            type="button"
            className="primary-button"
            onClick={() => window.location.href = '/'}
          >
            Go to Dashboard
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
