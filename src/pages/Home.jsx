import { useNavigate } from "react-router-dom";

import NextArrow from "../assets/Next.svg";
import fictionIcon from "../assets/Fiction.svg";
import dramaIcon from "../assets/Drama.svg";
import humorIcon from "../assets/Humour.svg";
import politicsIcon from "../assets/Politics.svg";
import philosophyIcon from "../assets/Philosophy.svg";
import historyIcon from "../assets/History.svg";
import adventureIcon from "../assets/Adventure.svg";

import "./Home.css";

const genres = [
  { name: "Fiction", icon: fictionIcon },
  { name: "Drama", icon: dramaIcon },
  { name: "Humor", icon: humorIcon },
  { name: "Politics", icon: politicsIcon },
  { name: "Philosophy", icon: philosophyIcon },
  { name: "History", icon: historyIcon },
  { name: "Adventure", icon: adventureIcon },
];

const Home = () => {
  const navigate = useNavigate();

  const handleGenreClick = (genre) => {
    navigate(`/genre/${genre.toLowerCase()}`);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="title">Gutenberg Project</h1>
        <h2 className="description">
          A social cataloging website that allows you to freely search its
          database of books, annotations, and reviews.
        </h2>
      </div>

      <div className="genre-grid">
        {genres.map((genre) => (
          <button
            key={genre.name}
            onClick={() => handleGenreClick(genre.name)}
            className="genre-button"
          >
            <div className="genre-content">
              <img
                src={genre.icon}
                alt={`${genre.name} icon`}
                className="genre-icon"
              />
              {genre.name.toUpperCase()}
            </div>
            <div onClick={() => handleGenreClick(genre.name)}>
              <img src={NextArrow} alt="next-arrow" className="arrow-icon" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
