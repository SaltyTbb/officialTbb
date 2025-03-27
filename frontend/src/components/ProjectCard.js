import React from 'react';
import '../styles/components/ProjectCard.scss';

const ProjectCard = ({ 
  title, 
  description, 
  technologies, 
  imageUrl, 
  projectUrl,
  displayLink = false
}) => {
  const handleImageError = (e) => {
    e.target.src = '/placeholder.svg';
  };

  return (
    <div className="project-card">
      <img 
        src={imageUrl} 
        alt={title} 
        className="project-image" 
        onError={handleImageError}
      />
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="project-tech">
        {technologies.map((tech, index) => (
          <span key={index}>{tech}</span>
        ))}
      </div>
      {displayLink && ( 
        <a href={projectUrl} className="project-link" target="_blank" rel="noopener noreferrer">
          View Project →
        </a>
      )}
    </div>
  );
};

export default ProjectCard; 