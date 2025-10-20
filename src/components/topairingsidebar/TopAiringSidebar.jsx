import { Link } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning, faMicrophone } from "@fortawesome/free-solid-svg-icons";

const TopAiringSidebar = ({ data }) => {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-[#1a1a1a] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-bold flex items-center gap-2">
          <span className="text-[#888888]">▶</span>
          TOP AIRING
        </h2>
      </div>

      <div className="space-y-3">
        {data && data.slice(0, 9).map((item, index) => (
          <Link
            key={index}
            to={`/${item.id}`}
            className="flex gap-3 group hover:bg-[#2a2a2a] p-2 rounded-lg transition-all duration-300 ease-out -m-2"
          >
            <div className="relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
              />
              <div className="absolute top-1 left-1 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {index + 1}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-[#888888] transition-colors">
                {language === "EN" ? item.title : item.japanese_title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {item.tvInfo?.episodeInfo?.sub && (
                  <div className="flex items-center gap-1 bg-[#B0E3AF] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                    <FontAwesomeIcon icon={faClosedCaptioning} className="text-[8px]" />
                    <span>{item.tvInfo.episodeInfo.sub}</span>
                  </div>
                )}
                {item.tvInfo?.episodeInfo?.dub && (
                  <div className="flex items-center gap-1 bg-[#B9E7FF] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                    <FontAwesomeIcon icon={faMicrophone} className="text-[8px]" />
                    <span>{item.tvInfo.episodeInfo.dub}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-1">{item.tvInfo?.showType || 'TV'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopAiringSidebar;
