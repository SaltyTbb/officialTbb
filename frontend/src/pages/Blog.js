import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import styled from 'styled-components';

const BlogCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
  }
`;

const BlogImage = styled(CardMedia)`
  height: 200px;
`;

const BlogContent = styled(CardContent)`
  flex-grow: 1;
`;

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
      // Add more dummy posts as needed
    ];
    setPosts(dummyPosts);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
        Blog Posts
      </Typography>

      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <BlogCard>
              <BlogImage
                image={post.image}
                title={post.title}
              />
              <BlogContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.excerpt}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Published on {new Date(post.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </BlogContent>
              <CardActions>
                <Button size="small" color="primary">
                  Read More
                </Button>
              </CardActions>
            </BlogCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Blog; 