import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const GenrePills = ({ genres }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const genreList = [
    "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo", 
    "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", 
    "Slice of Life", "Sports", "Supernatural", "Thriller"
  ];

  return (
    <div className="relative w-full pr-4 mt-10 mb-2 max-[1200px]:px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex bg-[#2a2a2a] p-2.5 rounded-full hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 ease-out"
        >
          <FaChevronLeft className="text-sm" />
        </button>
        
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {genreList.map((genre, index) => (
            <button
              key={index}
              className="px-4 py-1.5 bg-[#1a1a1a] text-white rounded-full whitespace-nowrap text-xs font-medium hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 ease-out flex-shrink-0"
            >
              {genre}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex bg-[#2a2a2a] p-2.5 rounded-full hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 ease-out"
        >
          <FaChevronRight className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default GenrePills;
