import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SplashScreen.css";
import logoTitle from "@/src/config/logoTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import getTopSearch from "@/src/utils/getTopSearch.utils";

// Static data moved outside the component
const NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/movie", label: "Movies" },
  { to: "/tv", label: "TV Series" },
  { to: "/most-popular", label: "Most Popular" },
  { to: "/top-airing", label: "Top Airing" },
];

const useTopSearch = () => {
  const [topSearch, setTopSearch] = useState([]);
  useEffect(() => {
    const fetchTopSearch = async () => {
      const data = await getTopSearch();
      if (data) setTopSearch(data);
    };
    fetchTopSearch();
  }, []);
  return topSearch;
};

function SplashScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const topSearch = useTopSearch();

  const handleSearchSubmit = useCallback(() => {
    const trimmedSearch = search.trim();
    if (!trimmedSearch) return;
    const queryParam = encodeURIComponent(trimmedSearch);
    navigate(`/search?keyword=${queryParam}`);
  }, [search, navigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  const testProxy = () => {
    // 1. Get the BASE URL of your proxy from the .env file
    const proxyBaseUrl = import.meta.env.VITE_PROXY_URL;

    // Check if the variable is set
    if (!proxyBaseUrl) {
      alert("Proxy URL is not configured. Please set VITE_PROXY_URL in your .env.local file.");
      console.error("VITE_PROXY_URL is not set.");
      return;
    }

    // 2. The external website you want to fetch
    const targetUrl = 'https://www.google.com';

    // 3. Construct the full URL correctly
    const fullProxyRequestUrl = `${proxyBaseUrl}/?url=${encodeURIComponent(targetUrl)}`;

    console.log("Making request to:", fullProxyRequestUrl);

    // 4. Make the fetch request
    fetch(fullProxyRequestUrl)
      .then(response => {
        if (!response.ok) {
          // Try to get more details from the error response
          return response.text().then(text => {
            throw new Error(`Network response was not ok: ${text}`);
          });
        }
        return response.text();
      })
      .then(html => {
        console.log('Successfully fetched content via proxy!');
        alert('Proxy test successful! Check console for details.');
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Proxy test failed: ' + error.message);
      });
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col">
      <div className="w-full px-8 pt-6">
        <nav className="flex items-center justify-between max-w-[1400px] mx-auto">
          <Link to="/home" className="text-2xl font-bold">
            <span className="text-[#888888]">Ani</span>
            <span className="text-white">mod</span>
          </Link>
          <div className="flex items-center gap-x-8 font-medium text-sm max-[780px]:hidden">
            <Link to="/home" className="hover:text-white transition-colors text-gray-400">
              Home
            </Link>
            <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all">
              Sign In
            </button>
          </div>

        </nav>

      </div>
      
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-[900px] text-center">
          <h1 className="text-6xl font-bold text-white leading-tight mb-6 max-[780px]:text-4xl">
            An anime streaming<br />app built using Nextjs<br />Server Components.
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-[780px]:text-base">
            This ad-free app aims to provide a seamless experience for users who<br className="max-[780px]:hidden" />
            want to utilize Anilist without the need for additional browser extensions.
          </p>
          <Link
            to="/home"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-all hover:scale-105 duration-300"
          >
            Start Watching
          </Link>
        </div>
      </div>
      
      <div className="text-center pb-8 text-gray-500 text-sm">
        © Animod All rights reserved.
      </div>
    </div>
  );
}

export default SplashScreen;
