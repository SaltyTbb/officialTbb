import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/games/SchulteGrid.scss';

const SchulteGrid = () => {
  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bestTime, setBestTime] = useState(null);
  const [showError, setShowError] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const gridSize = 5; // 5x5 grid
  const totalNumbers = gridSize * gridSize;
  
  // Load best time from localStorage
  useEffect(() => {
    const savedBestTime = localStorage.getItem('schulteBestTime');
    if (savedBestTime && savedBestTime !== '0') {
      setBestTime(Number(savedBestTime));
    }
  }, []);

  // Initialize or reset the game
  const initializeGame = () => {
    // Create an array of numbers from 1 to 25 (5x5 grid)
    const numbersArray = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    
    // Shuffle the array using Fisher-Yates algorithm
    for (let i = numbersArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbersArray[i], numbersArray[j]] = [numbersArray[j], numbersArray[i]];
    }
    
    setNumbers(numbersArray);
    setCurrentNumber(1);
    setStartTime(null);
    setElapsedTime(0);
    setIsPlaying(false);
    setIsCompleted(false);
    setShowError(false);
    setIsNewRecord(false);
  };

  // Reset the best time
  const resetBestTime = () => {
    localStorage.removeItem('schulteBestTime');
    setBestTime(null);
    setIsNewRecord(false);
  };

  // Start the game
  const startGame = () => {
    setStartTime(Date.now());
    setIsPlaying(true);
    setIsCompleted(false);
  };

  // Handle timer
  useEffect(() => {
    let timer;
    if (isPlaying && !isCompleted) {
      timer = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10); // Update more frequently for milliseconds
    }
    return () => clearInterval(timer);
  }, [isPlaying, startTime, isCompleted]);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Reset error message after a short delay
  useEffect(() => {
    let errorTimer;
    if (showError) {
      errorTimer = setTimeout(() => {
        setShowError(false);
      }, 1500);
    }
    return () => clearTimeout(errorTimer);
  }, [showError]);
  
  // Update best time
  const updateBestTime = useCallback((newTime) => {
    console.log('Updating best time:', { newTime, bestTime });
    if (bestTime === null) {
      // First time completing the game
      console.log('First completion, setting best time');
      setBestTime(newTime);
      localStorage.setItem('schulteBestTime', newTime.toString());
      setIsNewRecord(true);
      return;
    }
    
    if (newTime < bestTime) {
      console.log('New record achieved');
      setBestTime(newTime);
      localStorage.setItem('schulteBestTime', newTime.toString());
      setIsNewRecord(true);
    } else {
      console.log('No new record');
      setIsNewRecord(false);
    }
  }, [bestTime]);

  // Handle number click
  const handleNumberClick = (number) => {
    if (isCompleted) return; // Prevent clicks after completion
    
    if (!isPlaying) {
      startGame();
    }

    if (number === currentNumber) {
      setShowError(false);
      if (number === totalNumbers) {
        // Game completed
        const finalTime = Date.now() - startTime;
        setIsPlaying(false);
        setIsCompleted(true);
        
        // Update best time if this attempt is better
        console.log('Game completed with time:', finalTime);
        updateBestTime(finalTime);
      } else {
        // Move to next number
        setCurrentNumber(number + 1);
      }
    } else {
      // Wrong number clicked
      setShowError(true);
    }
  };

  // Format time display as MM:SS.mmm
  const formatTime = (timeInMs) => {
    if (timeInMs === null || timeInMs === undefined) return "00:00.00";
    
    const totalSeconds = timeInMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((timeInMs % 1000) / 10); // Get only the first 2 digits of milliseconds
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="schulte-container">
      <div className="game-header">
        <h1>Schulte Grid</h1>
        <p>Find numbers in sequence from 1 to {totalNumbers} as quickly as possible.</p>
      </div>

      <div className={`schulte-grid size-${gridSize} ${isCompleted ? 'completed' : ''}`}>
        {numbers.map((number, index) => (
          <div 
            key={index}
            className={`grid-cell ${showError && number === currentNumber ? 'highlight' : ''}`}
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </div>
        ))}
      </div>
      
      <div className="game-controls">
        <div className="timer-container">
          <div className="timer">{formatTime(elapsedTime)}</div>
          {bestTime !== null && (
            <div className="best-time">Best: {formatTime(bestTime)}</div>
          )}
        </div>

        {showError && (
          <div className="error-message">
            Wrong number! Look for {currentNumber}
          </div>
        )}

        <div className="button-container">
          <button 
            className="reset-button"
            onClick={initializeGame}
          >
            Reset Game
          </button>
          <button 
            className="reset-best-button"
            onClick={resetBestTime}
            disabled={bestTime === null}
          >
            Reset Best Time
          </button>
        </div>
      </div>

      {isCompleted && (
        <div className="completion-message">
          <h2>Congratulations!</h2>
          <p>You completed the grid in {formatTime(elapsedTime)}!</p>
          {bestTime === null ? (
            <p>That's a new best time!</p>
          ) : isNewRecord ? (
            <p>That's a new best time!</p>
          ) : (
            <p>Your best time is {formatTime(bestTime)}.</p>
          )}
          <button onClick={initializeGame}>Play Again</button>
        </div>
      )}

      <div className="game-footer">
        <p>
        </p>
        <Link to="/playground" className="back-link">Return to Playground</Link>
      </div>
    </div>
  );
};

export default SchulteGrid; 