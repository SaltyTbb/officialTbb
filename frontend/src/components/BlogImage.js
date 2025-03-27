import React, { useState } from 'react';

function BlogImage({ src, alt }) {
  const [error, setError] = useState(false);
  const placeholderImage = '/placeholder.svg';

  const handleError = () => {
    setError(true);
  };

  return (
    <div 
      className="blog-image" 
      style={{ 
        backgroundImage: `url(${error ? placeholderImage : src})`,
        backgroundColor: error ? '#1c4d33' : 'transparent'
      }}
    >
      <img 
        src={src} 
        alt={alt}
        style={{ display: 'none' }}
        onError={handleError}
      />
    </div>
  );
}

export default BlogImage; 