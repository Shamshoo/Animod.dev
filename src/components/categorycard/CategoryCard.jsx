import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FaChevronRight } from "react-icons/fa";
import "./CategoryCard.css";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import Qtip from "../qtip/Qtip";
import useToolTipPosition from "@/src/hooks/useToolTipPosition";

const CategoryCard = React.memo(
  ({
    label,
    data,
    showViewMore = true,
    className,
    categoryPage = false,
    cardStyle,
    path,
    limit,
  }) => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [showPlay, setShowPlay] = useState(false);
    if (limit) {
      data = data.slice(0, limit);
    }

    const [itemsToRender, setItemsToRender] = useState({
      firstRow: [],
      remainingItems: [],
    });

    const getItemsToRender = useCallback(() => {
      if (categoryPage) {
        const firstRow =
          window.innerWidth > 758 && data.length > 4 ? data.slice(0, 4) : [];
        const remainingItems =
          window.innerWidth > 758 && data.length > 4
            ? data.slice(4)
            : data.slice(0);
        return { firstRow, remainingItems };
      }
      return { firstRow: [], remainingItems: data.slice(0) };
    }, [categoryPage, data]);

    useEffect(() => {
      const handleResize = () => {
        setItemsToRender(getItemsToRender());
      };
      const newItems = getItemsToRender();
      setItemsToRender((prev) => {
        if (
          JSON.stringify(prev.firstRow) !== JSON.stringify(newItems.firstRow) ||
          JSON.stringify(prev.remainingItems) !==
            JSON.stringify(newItems.remainingItems)
        ) {
          return newItems;
        }
        return prev;
      });

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [getItemsToRender]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
      useToolTipPosition(hoveredItem, data);
    const handleMouseEnter = (item, index) => {
      const timeout = setTimeout(() => {
        setHoveredItem(item.id + index);
        setShowPlay(true);
      }, 400);
      setHoverTimeout(timeout);
    };
    const handleMouseLeave = () => {
      clearTimeout(hoverTimeout);
      setHoveredItem(null);
      setShowPlay(false);
    };
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl text-white max-[478px]:text-[18px] capitalize">
            {label}
          </h1>
          {showViewMore && (
            <Link
              to={`/${path}`}
              className="flex w-fit items-baseline h-fit rounded-3xl gap-x-1 group"
            >
              <p className="text-gray-400 text-[12px] font-semibold h-fit leading-0 group-hover:text-white transition-all ease-out">
                View more
              </p>
              <FaChevronRight className="text-gray-400 text-[10px] group-hover:text-white transition-all ease-out" />
            </Link>
          )}
        </div>
        <>
          {categoryPage && (
            <div
              className={`grid grid-cols-4 gap-x-3 gap-y-8 transition-all duration-300 ease-in-out ${
                categoryPage && itemsToRender.firstRow.length > 0
                  ? "mt-8 max-[758px]:hidden"
                  : ""
              }`}
            >
              {itemsToRender.firstRow.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col transition-transform duration-300 ease-in-out"
                  style={{ height: "fit-content" }}
                  ref={(el) => (cardRefs.current[index] = el)}
                >
                  <div
                    className="w-full relative group hover:cursor-pointer rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 ease-out"
                    onClick={() =>
                      navigate(
                        `${
                          path === "top-upcoming"
                            ? `/${item.id}`
                            : `/watch/${item.id}`
                        }`
                      )
                    }
                  >

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <img
                      src={`${item.poster}`}
                      alt={item.title}
                      className={`w-full h-[320px] object-cover max-[1200px]:h-[35vw] max-[758px]:h-[45vw] max-[478px]:h-[60vw] ultra-wide:h-[400px] ${cardStyle}`}
                    />
                    {(item.tvInfo?.rating === "18+" ||
                      item?.adultContent === true) && (
                      <div className="text-white px-2 rounded-md bg-[#FF5700] absolute top-2 left-2 flex items-center justify-center text-[14px] font-bold">
                        18+
                      </div>
                    )}
                    <div className="absolute left-2 top-2 flex items-center justify-center w-fit space-x-1 z-[100] max-[270px]:flex-col max-[270px]:gap-y-[3px]">
                      {item.tvInfo?.sub && (
                        <div className="flex space-x-1 justify-center items-center bg-[#B0E3AF] rounded-full px-2 text-black py-0.5">
                          <FontAwesomeIcon
                            icon={faClosedCaptioning}
                            className="text-[12px]"
                          />
                          <p className="text-[12px] font-bold">
                            {item.tvInfo.sub}
                          </p>
                        </div>
                      )}
                      {item.tvInfo?.dub && (
                        <div className="flex space-x-1 justify-center items-center bg-[#B9E7FF] rounded-full px-2 text-black py-0.5">
                          <FontAwesomeIcon
                            icon={faMicrophone}
                            className="text-[12px]"
                          />
                          <p className="text-[12px] font-bold">
                            {item.tvInfo.dub}
                          </p>
                        </div>
                      )}
                      {item.tvInfo?.eps && (
                        <div className="flex space-x-1 justify-center items-center bg-[#a9a6b16f] rounded-full px-2 text-white py-0.5">
                          <p className="text-[12px] font-extrabold">
                            {item.tvInfo.eps}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm font-semibold line-clamp-2 leading-tight">
                        {language === "EN" ? item.title : item.japanese_title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400">
                        <span>{item.tvInfo?.showType?.split(" ").shift() || 'TV'}</span>
                        <span>•</span>
                        <span>{item.tvInfo?.duration || '24m'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-7 gap-x-3 gap-y-8 mt-6 transition-all duration-300 ease-in-out max-[1400px]:grid-cols-5 max-[758px]:grid-cols-3 max-[478px]:grid-cols-2">
            {itemsToRender.remainingItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col transition-transform duration-300 ease-in-out"
                style={{ height: "fit-content" }}
                ref={(el) => (cardRefs.current[index] = el)}
              >
                <div
                  className="w-full relative group hover:cursor-pointer rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 ease-out"
                  onClick={() =>
                    navigate(
                      `${
                        path === "top-upcoming"
                          ? `/${item.id}`
                          : `/watch/${item.id}`
                      }`
                    )
                  }
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <img
                    src={`${item.poster}`}
                    alt={item.title}
                    className={`w-full h-[250px] object-cover max-[1200px]:h-[35vw] max-[758px]:h-[45vw] max-[478px]:h-[60vw] ${cardStyle}`}
                  />
                  {(item.tvInfo?.rating === "18+" ||
                    item?.adultContent === true) && (
                    <div className="text-white px-2 rounded-md bg-[#FF5700] absolute top-2 left-2 flex items-center justify-center text-[14px] font-bold">
                      18+
                    </div>
                  )}
                  <div className="absolute left-2 top-2 flex items-center justify-center w-fit space-x-1 z-[100] max-[270px]:flex-col max-[270px]:gap-y-[3px]">
                    {item.tvInfo?.sub && (
                      <div className="flex space-x-1 justify-center items-center bg-[#B0E3AF] rounded-full px-2 text-black py-0.5">
                        <FontAwesomeIcon
                          icon={faClosedCaptioning}
                          className="text-[12px]"
                        />
                        <p className="text-[12px] font-bold">
                          {item.tvInfo.sub}
                        </p>
                      </div>
                    )}
                    {item.tvInfo?.dub && (
                      <div className="flex space-x-1 justify-center items-center bg-[#B9E7FF] rounded-full px-2 text-black py-0.5">
                        <FontAwesomeIcon
                          icon={faMicrophone}
                          className="text-[12px]"
                        />
                        <p className="text-[12px] font-bold">
                          {item.tvInfo.dub}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-semibold line-clamp-2 leading-tight">
                      {language === "EN" ? item.title : item.japanese_title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400">
                      <span>{item.tvInfo?.showType?.split(" ").shift() || 'TV'}</span>
                      <span>•</span>
                      <span>{item.tvInfo?.duration || '24m'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </div>
    );
  }
);

CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
