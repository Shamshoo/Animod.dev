import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning, faMicrophone } from "@fortawesome/free-solid-svg-icons";

const TabbedContent = ({ newest, popular, topRated }) => {
  const [activeTab, setActiveTab] = useState("NEWEST");
  const { language } = useLanguage();

  const tabs = [
    { name: "NEWEST", data: newest },
    { name: "POPULAR", data: popular },
    { name: "TOP RATED", data: topRated },
  ];

  const currentData = tabs.find((tab) => tab.name === activeTab)?.data || [];

  return (
    <div className="w-full mt-8">
      {/* Love the Site Section */}
      <div className="flex items-center justify-between mb-8 max-md:flex-col max-md:items-start max-md:gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <span className="text-xl">❤️</span>
          </div>
          <div>
            <h2 className="text-white text-lg font-bold">Love the Site?</h2>
            <p className="text-gray-400 text-xs">Share it with your Friends!</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-[#1a1a1a] p-1 rounded-full">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                activeTab === tab.name
                  ? "bg-white text-black"
                  : "text-white hover:bg-[#2a2a2a]"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {currentData.slice(0, 21).map((item, index) => (
          <Link
            key={index}
            to={`/${item.id}`}
            className="group relative overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300 ease-out"
          >
            <div className="relative pb-[140%]">
              <img
                src={item.poster}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              {/* Episode Info - Top */}
              {item.tvInfo && (
                <div className="absolute top-2 left-2 right-2 flex gap-1.5">
                  {item.tvInfo.episodeInfo?.sub && (
                    <div className="flex items-center gap-1 bg-[#B0E3AF] px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <FontAwesomeIcon icon={faClosedCaptioning} className="text-[8px]" />
                      <span>{item.tvInfo.episodeInfo.sub}</span>
                    </div>
                  )}
                  {item.tvInfo.episodeInfo?.dub && (
                    <div className="flex items-center gap-1 bg-[#B9E7FF] px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <FontAwesomeIcon icon={faMicrophone} className="text-[8px]" />
                      <span>{item.tvInfo.episodeInfo.dub}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Title Overlay - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <h3 className="text-white text-xs font-semibold line-clamp-2 leading-tight group-hover:text-gray-300 transition-colors duration-300">
                  {language === "EN" ? item.title : item.japanese_title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400">
                  <span>{item.tvInfo?.showType || 'TV'}</span>
                  <span>•</span>
                  <span>{new Date().getFullYear()}</span>
                  <span>•</span>
                  <span>{item.tvInfo?.episodeInfo?.sub || '12'}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TabbedContent;
