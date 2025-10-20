import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
  faCalendar,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";
import "./Banner.css";

function Banner({ item, index }) {
  const { language } = useLanguage();
  return (
    <section className="spotlight w-full h-full relative">
      <img
        src={`${item.poster}`}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="spotlight-overlay"></div>
      
      {/* Episode Indicator Badge */}
      <div className="absolute top-8 left-8 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-md z-10 max-md:top-6 max-md:left-6">
        <span className="text-white text-xs font-bold">
          Ep {item.tvInfo?.episodeInfo?.sub || '3'} in 2d 6h
        </span>
      </div>
      
      <div className="absolute flex flex-col left-8 bottom-20 w-[50%] z-10 max-[1390px]:w-[60%] max-[1300px]:w-[70%] max-[1120px]:w-[75%] max-md:w-[90%] max-md:left-6 max-md:bottom-12 max-[300px]:w-full">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 text-xs font-bold rounded">
            <FontAwesomeIcon icon={faPlay} className="text-[8px] mr-1" />
            {item.tvInfo?.showType || 'TV'}
          </span>
          <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 text-xs font-bold rounded flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="text-[8px]" />
            {item.tvInfo?.episodeInfo?.sub || '13'}
          </span>
          <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 text-xs font-bold rounded flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="text-[8px]" />
            {item.tvInfo?.duration || '89'}
          </span>
        </div>
        <h3 className="text-white line-clamp-2 text-5xl font-bold text-left leading-tight mb-4 max-[1390px]:text-4xl max-[1300px]:text-3xl max-md:text-2xl max-[575px]:text-xl">
          {language === "EN" ? item.title : item.japanese_title}
        </h3>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {item.genres && item.genres.slice(0, 3).map((genre, idx) => (
            <span key={genre} className="text-white/90 text-sm">
              {genre}{idx < Math.min(item.genres.length - 1, 2) ? ' \u2022' : ''}
            </span>
          ))}
        </div>
        <p className="text-gray-300 text-sm mt-3 text-left line-clamp-2 leading-relaxed max-md:hidden">
          {item.description}
        </p>
        <div className="flex gap-x-3 mt-6 max-md:mt-4 max-sm:w-full max-[320px]:flex-col max-[320px]:space-y-3">
          <Link
            to={`/${item.id}`}
            className="flex bg-white text-black justify-center items-center px-6 py-2.5 rounded-full gap-x-2 font-semibold hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-out max-[320px]:w-fit"
          >
            <span className="text-sm">DETAILS</span>
          </Link>
          <Link
            to={`/watch/${item.id}`}
            className="flex bg-white/20 backdrop-blur-sm border border-white/30 text-white justify-center items-center px-6 py-2.5 rounded-full gap-x-2 font-semibold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 ease-out max-[320px]:w-fit"
          >
            <span className="text-sm">WATCH NOW</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Banner;
