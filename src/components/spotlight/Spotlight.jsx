import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "./Spotlight.css";
import Banner from "../banner/Banner";

const Spotlight = ({ spotlights }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  
  return (
    <>
      <div className="relative h-[700px] max-[1390px]:h-[600px] max-[1300px]:h-[500px] max-md:h-[420px] w-full">
        {/* Page Indicator */}
        <div className="absolute top-12 right-12 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full z-10 max-md:top-6 max-md:right-6">
          <span className="text-white text-sm font-bold">
            {currentSlide} / {spotlights?.length || 0}
          </span>
        </div>
        
        <div className="absolute right-[20px] top-[50%] translate-y-[-50%] flex gap-2 z-10 max-[575px]:hidden">
          <div className="button-prev"></div>
          <div className="button-next"></div>
        </div>
        {spotlights && spotlights.length > 0 ? (
          <>
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              allowTouchMove={false}
              speed={800}
              navigation={{
                nextEl: ".button-next",
                prevEl: ".button-prev",
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
              modules={[Navigation, Autoplay]}
              className="h-[700px] max-[1390px]:h-full"
              style={{
                "--swiper-pagination-bullet-inactive-color": "#ffffff",
                "--swiper-pagination-bullet-inactive-opacity": "1",
              }}
            >
              {spotlights.map((item, index) => (
                <SwiperSlide className="text-black relative" key={index}>
                  <Banner item={item} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <p>No spotlights to show.</p>
        )}
      </div>
    </>
  );
};

export default Spotlight;
