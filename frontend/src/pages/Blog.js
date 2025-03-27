import React, { useState, useEffect } from 'react';
import BlogImage from '../components/BlogImage';
import '../styles/pages/Blog.scss';

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Here you would typically fetch posts from your backend
    // For now, we'll use dummy data
    const dummyPosts = [
      {
        id: 1,
        title: 'Getting Started with React',
        excerpt: 'Learn the basics of React and how to create your first component...',
        image: 'https://via.placeholder.com/400x200',
        date: '2024-02-20',
      },
      {
        id: 2,
        title: 'Spring Boot Best Practices',
        excerpt: 'Discover the best practices for building robust Spring Boot applications...',
        image: 'https://via.placeholder.com/400x200',
        date: '2024-02-19',
      },
      {
        id: 3,
        title: 'Modern CSS Techniques',
        excerpt: 'Explore modern CSS features that can enhance your web development workflow...',
        image: 'https://non-existent-image.jpg', // This will use the placeholder
        date: '2024-02-18',
      },
    ];
    setPosts(dummyPosts);
  }, []);

  return (
    <div className="container">
      <h1 className="blog-title">Blog Posts</h1>

      <div className="blog-grid">
        {posts.map((post) => (
          <div className="blog-card" key={post.id}>
            <BlogImage src={post.image} alt={post.title} />
            <div className="blog-content">
              <h2 className="blog-post-title">{post.title}</h2>
              <p className="blog-excerpt">{post.excerpt}</p>
              <div className="blog-meta">
                <p className="blog-date">Published on {new Date(post.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="blog-actions">
              <button className="btn btn-primary">Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog; 