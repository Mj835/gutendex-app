import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import BackIcon from "../assets/Back.svg";
import SearchIcon from "../assets/Search.svg";
import CancelIcon from "../assets/Cancel.svg";
import "./Genre.css";

const Genre = () => {
  const { genre } = useParams();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  const observer = useRef();

  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const searchParam = query ? `&search=${encodeURIComponent(query)}` : "";
      const response = await fetch(
        `http://skunkworks.ignitesol.com:8000/books/?topic=${genre}&page=${page}${searchParam}`
      );

      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();

      if (data.results.length > 0) {
        setBooks((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setHasMore(data.next !== null);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching books", err);
      setError("Something went wrong while fetching books.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [page, genre, query]);

  useEffect(() => {
    setPage(1);
    setBooks([]);
    setHasMore(true);
  }, [query]);

  const filteredBooks = books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(query.toLowerCase());
    const authorMatch = book.authors.some((author) =>
      author.name.toLowerCase().includes(query.toLowerCase())
    );
    return titleMatch || authorMatch;
  });

  const handleOpenBook = (book) => {
    const formats = book.formats;

    const preferredFormats = [
      "text/html; charset=utf-8",
      "application/pdf",
      "text/plain; charset=utf-8",
    ];

    for (let format of preferredFormats) {
      const url = formats[format];
      if (url) {
        window.open(url, "_blank");
        return;
      }
    }

    alert("No viewable version available");
  };

  return (
    <>
      <div className="genreContainer">
        <div className="genreHeader">
          <span onClick={() => navigate(-1)}>
            <img src={BackIcon} alt="Back" className="backIcon" />
          </span>
          <h2 className="genreTitle">{genre}</h2>
        </div>

        <div className="searchContainer">
          <img src={SearchIcon} className="searchIcon" alt="search" />
          <input
            type="text"
            className="searchBox"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="clearButton"
              onClick={() => setQuery("")}
              aria-label="Clear"
            >
              <img src={CancelIcon} alt="cancelIcon" />
            </button>
          )}
        </div>
      </div>

      <div className="bookSection">
        <div className="bookGrid">
          {(query ? filteredBooks : books).map((book, index) => {
            const isLastBook = index === books.length - 1;
            return (
              <div
                className="bookCard"
                key={book.id}
                ref={isLastBook ? lastBookElementRef : null}
                onClick={() => handleOpenBook(book)}
              >
                <img
                  src={`https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.cover.medium.jpg`}
                  alt={book.title}
                  className="bookImage"
                />
                <p className="bookTitle">{book.title}</p>
                <p className="bookAuthor">
                  {book.authors.map((author) => author.name).join(", ")}
                </p>
              </div>
            );
          })}
          {loading && (
            <>
              {[...Array(12)].map((_, i) => (
                <div className="shimmerCard" key={i}></div>
              ))}
            </>
          )}
        </div>
      </div>

      {error && (
        <div style={{ textAlign: "center", color: "red" }}>{error}</div>
      )}
    </>
  );
};

export default Genre;
