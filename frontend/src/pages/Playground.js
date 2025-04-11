import React from 'react';
import '../styles/pages/Playground.scss';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';

// Note: You'll need to add these images to your assets folder
// If images are not available, the component will fallback to placeholders
// Example paths, replace with actual image paths when available
const tetrisPlaceholder = '/game-placeholders/tetris.jpg';
const snakePlaceholder = '/game-placeholders/snake.jpg';
const schultePlaceholder = '/game-placeholders/schulte.jpg';

function Playground() {
  // Game data
  const games = [
    {
      title: "Tetris",
      description: "A classic block-stacking puzzle game. Arrange falling tetrominoes to create complete rows and score points.",
      technologies: [],
      imageUrl: tetrisPlaceholder,
      projectUrl: "/games/tetris",
      displayLink: true
    },
    {
      title: "Snake",
      description: "Control a growing snake to eat food while avoiding walls and your own tail. How long can you survive?",
      technologies: [],
      imageUrl: snakePlaceholder,
      projectUrl: "/games/snake",
      displayLink: true
    },
    {
      title: "Schulte Grid",
      description: "A visual attention training exercise. Find the numbers in order as quickly as possible to improve concentration.",
      technologies: [],
      imageUrl: schultePlaceholder,
      projectUrl: "/games/schulte",
      displayLink: true
    }
  ];

  return (
    <div className="playground-container">
      <div className="playground-header">
        <h1>Game Playground</h1>
        <p>Take a break and enjoy some classic games. Click on any game card to start playing!</p>
      </div>
      
      <div className="games-grid">
        {games.map((game, index) => (
          <ProjectCard
            key={index}
            title={game.title}
            description={game.description}
            technologies={game.technologies}
            imageUrl={game.imageUrl}
            projectUrl={game.projectUrl}
            displayLink={game.displayLink}
          />
        ))}
      </div>
      
      <div className="playground-footer">
        <p>Hope you like these stuff! Contact me if you have more game ideas.</p>
      </div>
    </div>
  );
}

export default Playground;
