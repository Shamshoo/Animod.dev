import { useLanguage } from "@/src/context/LanguageContext";
import {
  faAngleDown,
  faCirclePlay,
  faList,
  faCheck,
  faImage,
  faFont,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import "./Episodelist.css";

function Episodelist({
  episodes,
  onEpisodeClick,
  currentEpisode,
  totalEpisodes,
  animeTitle,
}) {
  const [activeEpisodeId, setActiveEpisodeId] = useState(currentEpisode);
  const { language } = useLanguage();
  const listContainerRef = useRef(null);
  const activeEpisodeRef = useRef(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedRange, setSelectedRange] = useState([1, 100]);
  const [activeRange, setActiveRange] = useState("1-100");
  const [episodeNum, setEpisodeNum] = useState(currentEpisode);
  const dropDownRef = useRef(null);
  const [searchedEpisode, setSearchedEpisode] = useState(null);
  const [viewMode, setViewMode] = useState("numbers"); // thumbnail, name, numbers
  const [episodeThumbnails, setEpisodeThumbnails] = useState({});

  // Fetch TMDB episode thumbnails
  useEffect(() => {
    const fetchTMDBThumbnails = async () => {
      if (!animeTitle) {
        console.log('No anime title provided for TMDB fetch');
        return;
      }
      
      try {
        const TMDB_API_KEY = 'c7a51b4c64b938c993f179f867f2f7b3';
        console.log('Searching TMDB for:', animeTitle);
        
        // Try searching with original title first
        let searchResponse = await fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(animeTitle)}`
        );
        let searchData = await searchResponse.json();
        console.log('TMDB search results (original):', searchData);
        
        // Filter results to find animation/anime (genre_ids: 16 is Animation)
        let selectedShow = null;
        
        if (searchData.results && searchData.results.length > 0) {
          // Try to find a show with Animation genre (genre_id: 16)
          selectedShow = searchData.results.find(show => 
            show.genre_ids && show.genre_ids.includes(16)
          );
          
          // If no animation found, use first result
          if (!selectedShow) {
            selectedShow = searchData.results[0];
          }
        }
        
        // If no results, try with 'anime' keyword
        if (!selectedShow) {
          console.log('No results found, trying with "anime" keyword...');
          searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(animeTitle + ' anime')}`
          );
          searchData = await searchResponse.json();
          console.log('TMDB search results (with anime):', searchData);
          
          if (searchData.results && searchData.results.length > 0) {
            selectedShow = searchData.results.find(show => 
              show.genre_ids && show.genre_ids.includes(16)
            ) || searchData.results[0];
          }
        }
        
        if (selectedShow) {
          const tvId = selectedShow.id;
          console.log('Found TV show ID:', tvId, 'Name:', selectedShow.name, 'Genres:', selectedShow.genre_ids);
          
          // Fetch all seasons to get episode count
          const tvDetailsResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${tvId}?api_key=${TMDB_API_KEY}`
          );
          const tvDetails = await tvDetailsResponse.json();
          const seasonCount = tvDetails.number_of_seasons || 1;
          console.log('Total seasons:', seasonCount);
          
          // Fetch episodes from seasons (limit to first 30 seasons to avoid rate limits)
          const thumbnails = {};
          let episodeCounter = 1;
          const maxSeasons = Math.min(seasonCount, 30);
          
          for (let season = 1; season <= maxSeasons; season++) {
            try {
              const episodesResponse = await fetch(
                `https://api.themoviedb.org/3/tv/${tvId}/season/${season}?api_key=${TMDB_API_KEY}`
              );
              const episodesData = await episodesResponse.json();
              
              if (episodesData.episodes) {
                episodesData.episodes.forEach((ep) => {
                  if (ep.still_path) {
                    thumbnails[episodeCounter] = `https://image.tmdb.org/t/p/w300${ep.still_path}`;
                  }
                  episodeCounter++;
                });
              }
            } catch (seasonError) {
              console.error(`Error fetching season ${season}:`, seasonError);
            }
          }
          
          console.log('Fetched thumbnails for', Object.keys(thumbnails).length, 'episodes out of', episodeCounter - 1, 'total');
          setEpisodeThumbnails(thumbnails);
        } else {
          console.log('No TMDB results found for:', animeTitle);
        }
      } catch (error) {
        console.error('Error fetching TMDB thumbnails:', error);
      }
    };
    
    if (viewMode === 'thumbnail' && animeTitle) {
      fetchTMDBThumbnails();
    }
  }, [animeTitle, viewMode]);

  const scrollToActiveEpisode = () => {
    if (activeEpisodeRef.current && listContainerRef.current) {
      const container = listContainerRef.current;
      const activeEpisode = activeEpisodeRef.current;
      const containerTop = container.getBoundingClientRect().top;
      const containerHeight = container.clientHeight;
      const activeEpisodeTop = activeEpisode.getBoundingClientRect().top;
      const activeEpisodeHeight = activeEpisode.clientHeight;
      const offset = activeEpisodeTop - containerTop;
      container.scrollTop =
        container.scrollTop +
        offset -
        containerHeight / 2 +
        activeEpisodeHeight / 2;
    }
  };
  useEffect(() => {
    setActiveEpisodeId(episodeNum);
  }, [episodeNum]);
  useEffect(() => {
    scrollToActiveEpisode();
  }, [activeEpisodeId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setShowDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    if (value.trim() === "") {
      const newRange = findRangeForEpisode(1);
      setSelectedRange(newRange);
      setActiveRange(`${newRange[0]}-${newRange[1]}`);
      setSearchedEpisode(null);
    } else if (!value || isNaN(value)) {
      setSearchedEpisode(null);
    } else if (
      !isNaN(value) &&
      parseInt(value, 10) > totalEpisodes &&
      episodeNum !== null
    ) {
      const newRange = findRangeForEpisode(episodeNum);
      setSelectedRange(newRange);
      setActiveRange(`${newRange[0]}-${newRange[1]}`);
      setSearchedEpisode(null);
    } else if (!isNaN(value) && value.trim() !== "") {
      const num = parseInt(value, 10);
      const foundEpisode = episodes.find((item) => item?.episode_no === num);
      if (foundEpisode) {
        const newRange = findRangeForEpisode(num);
        setSelectedRange(newRange);
        setActiveRange(`${newRange[0]}-${newRange[1]}`);
        setSearchedEpisode(foundEpisode?.id);
      }
    } else {
      setSearchedEpisode(null);
    }
  }

  function findRangeForEpisode(episodeNumber) {
    const step = 100;
    const start = Math.floor((episodeNumber - 1) / step) * step + 1;
    const end = Math.min(start + step - 1, totalEpisodes);
    return [start, end];
  }

  function generateRangeOptions(totalEpisodes) {
    const ranges = [];
    const step = 100;

    for (let i = 0; i < totalEpisodes; i += step) {
      const start = i + 1;
      const end = Math.min(i + step, totalEpisodes);
      ranges.push(`${start}-${end}`);
    }
    return ranges;
  }
  useEffect(() => {
    if (currentEpisode && episodeNum) {
      if (episodeNum < selectedRange[0] || episodeNum > selectedRange[1]) {
        const newRange = findRangeForEpisode(episodeNum);
        setSelectedRange(newRange);
        setActiveRange(`${newRange[0]}-${newRange[1]}`);
      }
    }
  }, [currentEpisode, totalEpisodes, episodeNum]);

  const handleRangeSelect = (range) => {
    const [start, end] = range.split("-").map(Number);
    setSelectedRange([start, end]);
  };

  useEffect(() => {
    const activeEpisode = episodes.find(
      (item) => item?.id.match(/ep=(\d+)/)?.[1] === activeEpisodeId
    );
    if (activeEpisode) {
      setEpisodeNum(activeEpisode?.episode_no);
    }
  }, [activeEpisodeId, episodes]);

  return (
    <div className="relative flex flex-col w-full h-full max-[1200px]:max-h-[500px]">
      <div className="sticky top-0 z-10 flex flex-col gap-y-[5px] justify-start px-3 py-4 bg-[#0D0D15]">
        <div className="flex items-center justify-between">
          <h1 className="text-[13px] font-bold">List of episodes:</h1>
          <div className="flex gap-x-1">
            <button
              onClick={() => setViewMode("thumbnail")}
              className={`p-1.5 rounded ${viewMode === "thumbnail" ? "bg-[#888888]" : "bg-[#1a1a1a]"} hover:bg-[#888888] transition-colors`}
              title="Thumbnail view"
            >
              <FontAwesomeIcon icon={faImage} className="text-[10px]" />
            </button>
            <button
              onClick={() => setViewMode("name")}
              className={`p-1.5 rounded ${viewMode === "name" ? "bg-[#888888]" : "bg-[#1a1a1a]"} hover:bg-[#888888] transition-colors`}
              title="Name view"
            >
              <FontAwesomeIcon icon={faFont} className="text-[10px]" />
            </button>
            <button
              onClick={() => setViewMode("numbers")}
              className={`p-1.5 rounded ${viewMode === "numbers" ? "bg-[#888888]" : "bg-[#1a1a1a]"} hover:bg-[#888888] transition-colors`}
              title="Numbers view"
            >
              <FontAwesomeIcon icon={faHashtag} className="text-[10px]" />
            </button>
          </div>
        </div>
        {totalEpisodes > 100 && (
          <div className="w-full flex gap-x-4 items-center max-[1200px]:justify-between">
            <div className="min-w-fit flex text-[13px]">
              <div
                onClick={() => setShowDropDown((prev) => !prev)}
                className="text-white w-fit mt-1 text-[13px] relative cursor-pointer bg-[#0D0D15] flex justify-center items-center"
                ref={dropDownRef}
              >
                <FontAwesomeIcon icon={faList} />
                <div className="w-fit flex justify-center items-center gap-x-2 ml-4">
                  <p className="text-white text-[12px]">
                    EPS:&nbsp;{selectedRange[0]}-{selectedRange[1]}
                  </p>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="mt-[2px] text-[10px]"
                  />
                </div>
                {showDropDown && (
                  <div className="absolute flex flex-col top-full mt-[10px] left-0 z-30 bg-white w-[150px] max-h-[200px] overflow-y-auto rounded-l-[8px]">
                    {generateRangeOptions(totalEpisodes).map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          handleRangeSelect(item);
                          setActiveRange(item);
                        }}
                        className={`hover:bg-gray-200 cursor-pointer text-black ${
                          item === activeRange ? "bg-[#EFF0F4]" : ""
                        }`}
                      >
                        <p className="font-semibold text-[12px] p-3 flex justify-between items-center">
                          EPS:&nbsp;{item}
                          {item === activeRange ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : null}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="border-[1px] border-[#ffffff34] rounded-sm py-[4px] px-[8px] flex items-center gap-x-[10px]">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-[11px]"
              />
              <input
                type="text"
                className="w-full bg-transparent focus:outline-none rounded-sm text-[13px] font-bold placeholder:text-[12px] placeholder:font-medium"
                placeholder="Number of Ep"
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>
      <div ref={listContainerRef} className="w-full h-full overflow-y-auto">
        <div
          className={`${
            viewMode === "numbers"
              ? "p-3 grid grid-cols-5 gap-1 max-[1200px]:grid-cols-12 max-[860px]:grid-cols-10 max-[575px]:grid-cols-8 max-[478px]:grid-cols-6 max-[350px]:grid-cols-5"
              : viewMode === "thumbnail"
              ? "p-3 flex flex-col gap-2"
              : ""
          }`}
        >
          {totalEpisodes > 30
            ? episodes
                .slice(selectedRange[0] - 1, selectedRange[1])
                .map((item, index) => {
                  const episodeNumber = item?.id.match(/ep=(\d+)/)?.[1];
                  const isActive =
                    activeEpisodeId === episodeNumber ||
                    currentEpisode === episodeNumber;
                  const isSearched = searchedEpisode === item?.id;

                  // Thumbnail View
                  if (viewMode === "thumbnail") {
                    const sequentialEpNum = item?.episode_no || (index + selectedRange[0]);
                    const thumbnail = episodeThumbnails[sequentialEpNum];
                    return (
                      <div
                        key={item?.id}
                        ref={isActive ? activeEpisodeRef : null}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                          item?.filler ? "border-2 border-yellow-500" : ""
                        } ${
                          isActive ? "bg-[#888888]" : "bg-[#1a1a1a] hover:bg-[#2a2a2a]"
                        } transition-colors`}
                        onClick={() => {
                          if (episodeNumber) {
                            onEpisodeClick(episodeNumber);
                            setActiveEpisodeId(episodeNumber);
                            setSearchedEpisode(null);
                          }
                        }}
                      >
                        {thumbnail ? (
                          <img 
                            src={thumbnail} 
                            alt={`Episode ${sequentialEpNum}`} 
                            className="w-24 h-14 object-cover rounded flex-shrink-0 bg-[#2a2a2a]"
                            onError={(e) => {
                              console.log('Image load error for episode', sequentialEpNum);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-24 h-14 bg-[#2a2a2a] rounded flex-shrink-0 flex items-center justify-center">
                            <span className="text-[10px] text-gray-500">No Image</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">Episode {sequentialEpNum}</p>
                          <p className="text-[11px] text-gray-400 line-clamp-2">{item?.title || 'No title available'}</p>
                        </div>
                      </div>
                    );
                  }
                  
                  // Name View
                  if (viewMode === "name") {
                    const sequentialEpNum = index + selectedRange[0];
                    return (
                      <div
                        key={item?.id}
                        ref={isActive ? activeEpisodeRef : null}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                          item?.filler ? "bg-yellow-700 text-white" : ""
                        } ${
                          isActive && !item?.filler ? "bg-[#888888] text-white" : !item?.filler ? "bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-300" : ""
                        } transition-colors`}
                        onClick={() => {
                          if (episodeNumber) {
                            onEpisodeClick(episodeNumber);
                            setActiveEpisodeId(episodeNumber);
                            setSearchedEpisode(null);
                          }
                        }}
                      >
                        <span className="text-xs font-bold min-w-[30px]">{sequentialEpNum}</span>
                        <p className="text-xs line-clamp-1 flex-1">{item?.title || `Episode ${sequentialEpNum}`}</p>
                      </div>
                    );
                  }
                  
                  // Numbers View (default)
                  return (
                    <div
                      key={item?.id}
                      ref={isActive ? activeEpisodeRef : null}
                      className={`flex items-center justify-center rounded-[3px] h-[30px] text-[13.5px] font-medium cursor-pointer group ${
                        item?.filler
                          ? isActive
                            ? "bg-yellow-600"
                            : "bg-yellow-700"
                          : ""
                      } md:hover:bg-[#67686F] 
                          md:hover:text-white
                       ${
                         isActive && !item?.filler
                           ? "bg-[#888888] text-white"
                           : !item?.filler ? "bg-[#35373D] text-gray-400" : "text-white"
                       } ${isSearched ? "glow-animation" : ""} `}
                      onClick={() => {
                        if (episodeNumber) {
                          onEpisodeClick(episodeNumber);
                          setActiveEpisodeId(episodeNumber);
                          setSearchedEpisode(null);
                        }
                      }}
                    >
                      <span
                        className={`${
                          item?.filler
                            ? "text-white md:group-hover:text-white"
                            : ""
                        }`}
                      >
                        {index + selectedRange[0]}
                      </span>
                    </div>
                  );
                })
            : episodes?.map((item, index) => {
                const episodeNumber = item?.id.match(/ep=(\d+)/)?.[1];
                const isActive =
                  activeEpisodeId === episodeNumber ||
                  currentEpisode === episodeNumber;
                const isSearched = searchedEpisode === item?.id;

                // Thumbnail View
                if (viewMode === "thumbnail") {
                  const sequentialEpNum = item?.episode_no || (index + 1);
                  const thumbnail = episodeThumbnails[sequentialEpNum];
                  return (
                    <div
                      key={item?.id}
                      ref={isActive ? activeEpisodeRef : null}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                        item?.filler ? "border-2 border-yellow-500" : ""
                      } ${
                        isActive ? "bg-[#888888]" : "bg-[#1a1a1a] hover:bg-[#2a2a2a]"
                      } transition-colors`}
                      onClick={() => {
                        if (episodeNumber) {
                          onEpisodeClick(episodeNumber);
                          setActiveEpisodeId(episodeNumber);
                          setSearchedEpisode(null);
                        }
                      }}
                    >
                      {thumbnail ? (
                        <img 
                          src={thumbnail} 
                          alt={`Episode ${sequentialEpNum}`} 
                          className="w-24 h-14 object-cover rounded flex-shrink-0 bg-[#2a2a2a]"
                          onError={(e) => {
                            console.log('Image load error for episode', sequentialEpNum);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-24 h-14 bg-[#2a2a2a] rounded flex-shrink-0 flex items-center justify-center">
                          <span className="text-[10px] text-gray-500">No Image</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">Episode {sequentialEpNum}</p>
                        <p className="text-[11px] text-gray-400 line-clamp-2">{item?.title || 'No title available'}</p>
                      </div>
                    </div>
                  );
                }
                
                // Numbers View
                if (viewMode === "numbers") {
                  return (
                    <div
                      key={item?.id}
                      ref={isActive ? activeEpisodeRef : null}
                      className={`flex items-center justify-center rounded-[3px] h-[30px] text-[13.5px] font-medium cursor-pointer group ${
                        item?.filler
                          ? isActive
                            ? "bg-yellow-600"
                            : "bg-yellow-700"
                          : ""
                      } md:hover:bg-[#67686F] 
                          md:hover:text-white
                       ${
                         isActive && !item?.filler
                           ? "bg-[#888888] text-white"
                           : !item?.filler ? "bg-[#35373D] text-gray-400" : "text-white"
                       } ${isSearched ? "glow-animation" : ""} `}
                      onClick={() => {
                        if (episodeNumber) {
                          onEpisodeClick(episodeNumber);
                          setActiveEpisodeId(episodeNumber);
                          setSearchedEpisode(null);
                        }
                      }}
                    >
                      <span
                        className={`${
                          item?.filler
                            ? "text-white md:group-hover:text-white"
                            : ""
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>
                  );
                }

                // Name View (default)
                return (
                  <div
                    key={item?.id}
                    ref={isActive ? activeEpisodeRef : null}
                    className={`w-full pl-5 pr-2 py-3 flex items-center justify-start gap-x-8 cursor-pointer ${
                      (index + 1) % 2 && !isActive
                        ? "bg-[#201F2D] text-gray-400"
                        : "bg-none"
                    } group md:hover:bg-[#2B2A42] ${
                      isActive ? "text-[#888888] bg-[#2B2A42]" : ""
                    } ${isSearched ? "glow-animation" : ""}`}
                    onClick={() => {
                      if (episodeNumber) {
                        onEpisodeClick(episodeNumber);
                        setActiveEpisodeId(episodeNumber);
                        setSearchedEpisode(null);
                      }
                    }}
                  >
                    <p className="text-[14px] font-medium">{index + 1}</p>
                    <div className="w-full flex items-center justify-between gap-x-[5px]">
                      <h1 className="line-clamp-1 text-[15px] font-light group-hover:text-white">
                        {language === "EN" ? item?.title : item?.japanese_title}
                      </h1>
                      {isActive && (
                        <FontAwesomeIcon
                          icon={faCirclePlay}
                          className="w-[20px] h-[20px] text-white"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default Episodelist;
