import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import '../styles/pages/AdminDashboard.scss';

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
  });

  useEffect(() => {
    // Here you would typically fetch posts from your backend
    // For now, we'll use dummy data
    const dummyPosts = [
      {
        id: 1,
        title: 'Getting Started with React',
        content: 'Learn the basics of React...',
        image: 'https://via.placeholder.com/400x200',
        date: '2024-02-20',
      },
      // Add more dummy posts
    ];
    setPosts(dummyPosts);
  }, []);

  const handleOpenDialog = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        image: post.image,
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        image: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPost(null);
    setFormData({
      title: '',
      content: '',
      image: '',
    });
  };

  const handleSubmit = () => {
    if (editingPost) {
      // Update existing post
      setPosts(posts.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...formData }
          : post
      ));
    } else {
      // Add new post
      setPosts([
        ...posts,
        {
          id: Date.now(),
          ...formData,
          date: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <Container maxWidth="lg">
      <Card className="admin__card">
        <Typography variant="h4" gutterBottom className="admin__title">
          Admin Dashboard
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          className="admin__add-button"
        >
          Add New Post
        </Button>

        <TableContainer component={Paper} className="admin__table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell>
                    <div className="admin__actions">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(post)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(post.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingPost ? 'Edit Post' : 'Add New Post'}
          </DialogTitle>
          <DialogContent className="admin__dialog-content">
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="admin__dialog-field"
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="admin__dialog-field"
            />
            <TextField
              label="Image URL"
              fullWidth
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="admin__dialog-field"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingPost ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Container>
  );
}

export default AdminDashboard; 