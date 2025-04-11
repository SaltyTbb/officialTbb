import React from 'react';
import '../styles/components/ProjectCard.scss';

const ProjectCard = ({ 
  title, 
  description, 
  technologies, 
  imageUrl, 
  projectUrl,
  displayLink
}) => {
  const handleImageError = (e) => {
    e.target.src = '/placeholder.svg';
  };

  return (
    <div className="project-card">
      <div className="project-image">
        <img 
          src={imageUrl} 
          alt={title} 
          onError={handleImageError}
        />
      </div>
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        <div className="project-tech">
          {technologies.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>
        {displayLink && ( 
          <a href={projectUrl} className="project-link" target="_blank" rel="noopener noreferrer">
            View Project →
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard; 