import React from 'react';
import {
  Container,
  Typography,
  Card,
  Box,
  Grid,
  Avatar,
} from '@mui/material';
import '../styles/pages/About.scss';

function About() {
  return (
    <Container maxWidth="md">
      <Card className="about__profile-card">
        <Avatar alt="Your Name" src="/path-to-your-photo.jpg" className="about__avatar" />
        <Typography variant="h4" gutterBottom className="about__name">
          Your Name
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Web Developer & Designer
        </Typography>

        <Box className="about__section">
          <Typography variant="h6" gutterBottom className="about__section-title">
            About Me
          </Typography>
          <Typography variant="body1" paragraph>
            Hello! I'm a passionate web developer with expertise in modern web technologies.
            I love creating beautiful and functional websites that provide great user experiences.
          </Typography>
        </Box>

        <Box className="about__section">
          <Typography variant="h6" gutterBottom className="about__section-title">
            Skills
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Card className="about__skill-card">
                <Typography variant="body1">Frontend Development</Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card className="about__skill-card">
                <Typography variant="body1">Backend Development</Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card className="about__skill-card">
                <Typography variant="body1">UI/UX Design</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box className="about__section">
          <Typography variant="h6" gutterBottom className="about__section-title">
            Contact
          </Typography>
          <Typography variant="body1" className="about__contact-info">
            Email: your.email@example.com
          </Typography>
          <Typography variant="body1" className="about__contact-info">
            LinkedIn: linkedin.com/in/yourprofile
          </Typography>
          <Typography variant="body1" className="about__contact-info">
            GitHub: github.com/yourusername
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}

export default About; 