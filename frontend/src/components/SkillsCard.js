import React from 'react';
import '../styles/components/SkillsCard.scss';

const SkillsCard = ({ icon, alt }) => {
  return (
    <div className="skills-card">
      <img src={icon} alt={alt} className="skills-icon" />
    </div>
  );
};

export default SkillsCard; 