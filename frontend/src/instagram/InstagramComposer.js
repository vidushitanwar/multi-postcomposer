import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Service Client class wrapping HTTP requests to the backend API,
 * structured similar to a Java API client class (e.g., Spring RestTemplate client).
 */
class PostComposerServiceClient {
  constructor() {
    this.basePath = '/api/composer-posts';
  }

  /**
   * Retrieve all posts
   */
  async getPosts() {
    const response = await fetch(this.basePath);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Unable to retrieve composer posts');
    }
    return await response.json();
  }

  /**
   * Create a new composer post
   */
  async createPost(formData) {
    const response = await fetch(this.basePath, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to submit post creation request');
    }
    return await response.json();
  }

  /**
   * Delete a composer post by ID
   */
  async deletePost(id) {
    const response = await fetch(`${this.basePath}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to request post deletion');
    }
    return true;
  }
}

// Instantiate API service client
const apiServiceClient = new PostComposerServiceClient();

// Side navigation SVG icons for Instagram branding
const SidebarIcons = {
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Explore: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  Messages: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Create: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  Profile: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
};

// Feed outline action SVGs
const FeedIcons = {
  Heart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Comment: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Share: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Bookmark: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
};

function InstagramComposer() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ title: '', description: '', scheduleAt: '' });
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const data = await apiServiceClient.getPosts();
      setPosts(data);
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function handleMediaChange(event) {
    const file = event.target.files?.[0] || null;
    setMediaFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(file ? URL.createObjectURL(file) : '');
  }

  function handleCancel() {
    setFormState({ title: '', description: '', scheduleAt: '' });
    setMediaFile(null);
    setPreviewUrl('');
    setStatusMessage('');
  }

  async function deletePost(id) {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      await apiServiceClient.deletePost(id);
      setStatusMessage('Post deleted successfully.');
      await loadPosts();
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  async function submitComposer(status) {
    if (!formState.title.trim() || !formState.description.trim()) {
      setStatusMessage('Title and description are required.');
      return;
    }

    if (status === 'scheduled' && !formState.scheduleAt) {
      setStatusMessage('Choose a schedule time before scheduling the post.');
      return;
    }

    const payload = new FormData();
    payload.append('platform', 'instagram');
    payload.append('title', formState.title);
    payload.append('description', formState.description);
    payload.append('status', status);

    if (formState.scheduleAt) {
      payload.append('scheduleAt', new Date(formState.scheduleAt).toISOString());
    }

    if (mediaFile) {
      payload.append('media', mediaFile);
    }

    try {
      setSaving(true);
      setStatusMessage('');

      await apiServiceClient.createPost(payload);

      setFormState({ title: '', description: '', scheduleAt: '' });
      setMediaFile(null);
      setPreviewUrl('');
      setStatusMessage(status === 'scheduled' ? 'Post scheduled successfully.' : 'Post shared successfully.');
      await loadPosts();
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="instagram-shell">
      {/* Side Navigation Bar */}
      <aside className="ig-sidebar">
        <div className="ig-logo" onClick={() => navigate('/')}>
          Instagram
        </div>
        <nav>
          <ul className="ig-nav-list">
            <li>
              <div className="ig-nav-item" onClick={() => navigate('/')}>
                <SidebarIcons.Home />
                <span>Dashboard</span>
              </div>
            </li>
            <li>
              <div className="ig-nav-item">
                <SidebarIcons.Search />
                <span>Search</span>
              </div>
            </li>
            <li>
              <div className="ig-nav-item">
                <SidebarIcons.Explore />
                <span>Explore</span>
              </div>
            </li>
            <li>
              <div className="ig-nav-item">
                <SidebarIcons.Messages />
                <span>Messages</span>
              </div>
            </li>
            <li>
              <div className="ig-nav-item active">
                <SidebarIcons.Create />
                <span>Create Post</span>
              </div>
            </li>
            <li>
              <div className="ig-nav-item">
                <SidebarIcons.Profile />
                <span>Profile</span>
              </div>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Workspace Content */}
      <main className="ig-main-content">
        <div className="ig-page-container">
          <header className="ig-header-row">
            <h1>Create New Post</h1>
            <button
              type="button"
              className="secondary-button"
              onClick={loadPosts}
              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
            >
              Refresh Feed
            </button>
          </header>

          {/* Split Post Composer Component */}
          <section className="ig-composer-modal">
            {/* Left Box: Media Uploader */}
            <div className="ig-composer-media-section">
              {previewUrl ? (
                <div className="ig-media-preview-container">
                  {mediaFile && mediaFile.type.startsWith('video') ? (
                    <video src={previewUrl} controls />
                  ) : (
                    <img src={previewUrl} alt="Upload Preview" />
                  )}
                  <div className="ig-media-change-badge">Click to Change Media</div>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    disabled={saving}
                  />
                </div>
              ) : (
                <div className="ig-media-empty-state">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p>Drag photos and videos here</p>
                  <button type="button" className="ig-select-file-btn">
                    Select from computer
                  </button>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    disabled={saving}
                  />
                </div>
              )}
            </div>

            {/* Right Box: Composer details form */}
            <div className="ig-composer-details-section">
              <div className="ig-composer-user-badge">
                <div className="ig-avatar">
                  <div className="ig-avatar-inner">IC</div>
                </div>
                <div className="ig-username">instagram_composer</div>
              </div>

              <div className="ig-composer-inputs">
                <input
                  type="text"
                  name="title"
                  className="ig-borderless-input"
                  placeholder="Write a title..."
                  value={formState.title}
                  onChange={updateField}
                  disabled={saving}
                />

                <textarea
                  name="description"
                  className="ig-borderless-textarea"
                  placeholder="Write a caption..."
                  value={formState.description}
                  onChange={updateField}
                  disabled={saving}
                />

                <div className="ig-scheduler-row">
                  <label htmlFor="scheduleAt">Schedule publication</label>
                  <input
                    id="scheduleAt"
                    type="datetime-local"
                    name="scheduleAt"
                    className="ig-scheduler-input"
                    value={formState.scheduleAt}
                    onChange={updateField}
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Status Message Display */}
              {statusMessage && <p className="ig-status-msg">{statusMessage}</p>}

              {/* Action Buttons Footer */}
              <footer className="ig-composer-footer">
                <button
                  type="button"
                  className="ig-share-secondary-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ig-share-btn"
                  onClick={() => submitComposer('scheduled')}
                  disabled={saving}
                >
                  Schedule
                </button>
                <button
                  type="button"
                  className="ig-share-btn"
                  style={{ fontWeight: '700' }}
                  onClick={() => submitComposer('posted')}
                  disabled={saving}
                >
                  Share
                </button>
              </footer>
            </div>
          </section>

          {/* Instagram Post Feed List */}
          <h2 className="ig-feed-title">Posts</h2>
          <section className="ig-feed-grid">
            {posts.length === 0 ? (
              <div className="ig-feed-empty">
                No posts shared yet. Start creating your first post above!
              </div>
            ) : (
              posts.map((post) => (
                <article key={post._id} className="ig-post-card">
                  {/* Header */}
                  <header className="ig-post-header">
                    <div className="ig-avatar">
                      <div className="ig-avatar-inner">IC</div>
                    </div>
                    <span className="ig-username-label">instagram_composer</span>
                    <span className={`ig-post-status status-${post.status}`}>
                      {post.status}
                    </span>
                  </header>

                  {/* Media */}
                  <div className="ig-post-image-container">
                    {post.mediaUrl ? (
                      post.mediaUrl.endsWith('.mp4') || post.mediaUrl.endsWith('.webm') ? (
                        <video src={post.mediaUrl} controls />
                      ) : (
                        <img src={post.mediaUrl} alt={post.title} />
                      )
                    ) : (
                      <div className="ig-post-placeholder-media" />
                    )}
                  </div>

                  {/* Icon Actions Bar */}
                  <div className="ig-post-actions-bar">
                    <FeedIcons.Heart />
                    <FeedIcons.Comment />
                    <FeedIcons.Share />
                    <FeedIcons.Bookmark className="ig-action-bookmark" />
                  </div>

                  {/* Likes Info */}
                  <div className="ig-post-likes">
                    Liked by <strong>post_composer</strong> and others
                  </div>

                  {/* Caption Section */}
                  <div className="ig-post-caption-box">
                    <span className="ig-post-caption-title">{post.title}</span>
                    <p className="ig-post-caption-text">
                      <strong>instagram_composer</strong> {post.description}
                    </p>
                    {post.scheduleAt && (
                      <div className="ig-post-schedule-info">
                        Scheduled for: {new Date(post.scheduleAt).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Footer Delete Action */}
                  <footer className="ig-post-footer">
                    <button
                      type="button"
                      className="ig-delete-post-btn"
                      onClick={() => deletePost(post._id)}
                    >
                      Delete Post
                    </button>
                  </footer>
                </article>
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default InstagramComposer;
