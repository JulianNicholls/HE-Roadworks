import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <h1>Roadworks</h1>
      <nav>
        <a href="https://reallybigshoe.co.uk">Home</a>
        <a href="https://reallybigshoe.co.uk/visualiser">Palette Visualiser</a>
        <a href="http://spacex.reallybigshoe.co.uk">SpaceX Info</a>
        <a href="http://countdown.reallybigshoe.co.uk">Countdown Magician</a>
        <a
          href="https://github.com/JulianNicholls"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://twitter.com/ReallyBigShoeUK"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      </nav>
    </header>
  );
};

export default Header;
