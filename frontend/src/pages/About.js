import React from 'react';
import '../styles/pages/About.scss';

// Import logo
import shopeeLogo from '../assets/shopee-logo.png';
import antGroupLogo from '../assets/ant-icon.png';
import igloohomeLogo from '../assets/igloo-icon.png';

import ProjectCard from '../components/ProjectCard';
import SkillsCard from '../components/SkillsCard';

// Import skill icons
import pythonIcon from '../assets/icons/python.svg';
import golangIcon from '../assets/icons/golang.svg';
import reactIcon from '../assets/icons/react.svg';
import nodejsIcon from '../assets/icons/nodejs.svg';
import postgresqlIcon from '../assets/icons/postgresql.svg';
import redisIcon from '../assets/icons/redis.svg';
import dockerIcon from '../assets/icons/docker.svg';
import javaIcon from '../assets/icons/java.svg';

// Import project images
import radarChartImg from '../assets/radarChart.jpg';
import reverseGeocodingImg from '../assets/reverseGeocoding.jpg';
import kenkenImg from '../assets/kenken.png';
import iglooImg from '../assets/igloo.jpg';

function About() {
  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.src = '/avatar-placeholder.svg';
  };

  // Project data with imported images
  const projects = [
    
    {
      title: "Student Performance Tracking",
      description: "A system to visualize student's performance.",
      technologies: ["Python", "Excel", "PyQt", "Plotly"],
      imageUrl: radarChartImg,
      projectUrl: "#"
    },
    {
      title: "Reverse Geocoding",
      description: "A system to convert latitude and longitude to address",
      technologies: ["Golang", "Geo-hash", "Redis", "PostgreSQL"],
      imageUrl: reverseGeocodingImg,
      projectUrl: "#"
    },
    {
      title: "KenKen",
      description: "A game to solve KenKen puzzles",
      technologies: ["Python", "PyQt"],
      imageUrl: kenkenImg,
      projectUrl: "https://github.com/SaltyTbb/KenKen",
      displayLink: true
    },
    {
      title: "Locker Automation Testing",
      description: "An android system that performs automation testing on locker panel unlock",
      technologies: ["Kotlin", "RxKotlin", "Raspberry Pi"],
      imageUrl: iglooImg,
      projectUrl: "#"
    }
  ];

  // Skills data
  const skills = [
    { icon: golangIcon, alt: "Go" },
    { icon: javaIcon, alt: "Java" },
    { icon: pythonIcon, alt: "Python" },
    { icon: reactIcon, alt: "React" },
    { icon: nodejsIcon, alt: "Node.js" },
    { icon: postgresqlIcon, alt: "PostgreSQL" },
    { icon: redisIcon, alt: "Redis" },
    { icon: dockerIcon, alt: "Docker" },
  ];

  return (
    <div className="container">
      <div className="profile-card">
        <div className="avatar">
          <img
            src="/avatar-tbb.jpg"
            alt="Tbb"
            onError={handleImageError}
          />
        </div>
        <h1 className="name">Tbb</h1>
        <p className="subtitle">Software Engineer</p>
        <p className="email">yuanbo1996@gmail.com</p>

        <div className="section">
          <h2 className="section-title">About Me</h2>
          <p className="section-text">
            Hello, nice to meet you! I'm a passionate software engineer with 5 years of experience in backend development.
            I love creating beautiful and functional services that provide great user experiences.
          </p>
          <div className="contact-buttons">
            <a href="mailto:yuanbo1996@gmail.com" className="contact-button">
              {/* TODO: Add resume */}
              Resume
            </a>
            <a href="https://www.linkedin.com/in/tang-yuanbo/" target="_blank" rel="noopener noreferrer" className="contact-button">
              LinkedIn
            </a>
            <a href="https://github.com/SaltyTbb" target="_blank" rel="noopener noreferrer" className="contact-button">
              GitHub
            </a>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Work Experience</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">2020 - 2024</div>
              <div className="timeline-content">
                <h3>Software Engineer</h3>
                <p>Shopee Singapore <img src={shopeeLogo} alt="Shopee Logo" className="shopee-logo" /></p>
                <ul>
                  <li>Developed voucher & item recommendation system</li>
                  <li>Developed geospatial data calculation system</li>
                  <li>Developed data pipeline for daily report</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2019</div>
              <div className="timeline-content">
                <h3>Java Developer Intern</h3>
                <p>Ant Group <img src={antGroupLogo} alt="Ant Group Logo" className="shopee-logo" /></p>
                <ul>
                  <li>Built scalable microservices architecture</li>
                  <li>Implemented real-time data processing system</li>
                  <li>Optimized database queries and improved performance</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2018</div>
              <div className="timeline-content">
                <h3>Software Developer Intern</h3>
                <p>Igloohome <img src={igloohomeLogo} alt="Igloohome Logo" className="shopee-logo" /></p>
                <ul>
                  <li>Developed RESTful APIs for mobile applications</li>
                  <li>Created automated testing framework</li>
                  <li>Implemented CI/CD pipeline using Jenkins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                imageUrl={project.imageUrl}
                projectUrl={project.projectUrl}
                displayLink={project.displayLink || false}
              />
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <SkillsCard
                key={index}
                icon={skill.icon}
                alt={skill.alt}
              />
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Education</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">2016 - 2020</div>
              <div className="timeline-content">
                <h3>Bachelor's Degree in Information Systems and Management</h3>
                <p>Singapore Management University</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 