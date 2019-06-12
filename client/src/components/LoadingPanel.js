import React from 'react';

const panelStyle = {
  alignItems: 'center',
  background: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  display: 'flex',
  fontSize: '1.3rem',
  height: '25vh',
  justifyContent: 'center',
  left: '35vw',
  position: 'fixed',
  top: '35vh',
  width: '25vw',
};

const LoadingPanel = () => {
  return (
    <div className="loading-panel" style={panelStyle}>
      <h2>Loading...</h2>
    </div>
  );
};

export default LoadingPanel;
