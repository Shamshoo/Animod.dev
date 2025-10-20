import website_name from "@/src/config/website.js";
import Spotlight from "@/src/components/spotlight/Spotlight.jsx";
import GenrePills from "@/src/components/genrepills/GenrePills.jsx";
import TabbedContent from "@/src/components/tabbedcontent/TabbedContent.jsx";
import TopAiringSidebar from "@/src/components/topairingsidebar/TopAiringSidebar.jsx";
import Loader from "@/src/components/Loader/Loader.jsx";
import Error from "@/src/components/error/Error.jsx";
import { useHomeInfo } from "@/src/context/HomeInfoContext.jsx";
import ContinueWatching from "@/src/components/continue/ContinueWatching";

function Home() {
  const { homeInfo, homeInfoLoading, error } = useHomeInfo();
  if (homeInfoLoading) return <Loader type="home" />;
  if (error) return <Error />;
  if (!homeInfo) return <Error error="404" />;


  return (
    <>
      <div className="w-full">
        <Spotlight spotlights={homeInfo.spotlights} />
        
        <div className="w-full">
          <div className="max-w-[1600px] mx-auto">
            <GenrePills genres={homeInfo.genres} />
          </div>
          
          <div className="max-w-[1600px] mx-auto px-4 max-[1200px]:px-4">
            <ContinueWatching />
          </div>
          
          <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 pr-4 mt-8 max-[1200px]:px-4">
            <div>
              <TabbedContent 
                newest={homeInfo.recently_added}
                popular={homeInfo.most_popular}
                topRated={homeInfo.most_favorite}
              />
            </div>
            
            <div className="max-lg:hidden">
              <TopAiringSidebar data={homeInfo.top_airing} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
