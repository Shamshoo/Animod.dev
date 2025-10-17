import website_name from "@/src/config/website.js";
import Spotlight from "@/src/components/spotlight/Spotlight.jsx";
import Trending from "@/src/components/trending/Trending.jsx";
import Cart from "@/src/components/cart/Cart.jsx";
import CategoryCard from "@/src/components/categorycard/CategoryCard.jsx";
import Genre from "@/src/components/genres/Genre.jsx";
import Topten from "@/src/components/topten/Topten.jsx";
import Loader from "@/src/components/Loader/Loader.jsx";
import Error from "@/src/components/error/Error.jsx";
import { useHomeInfo } from "@/src/context/HomeInfoContext.jsx";
import Schedule from "@/src/components/schedule/Schedule";
import ContinueWatching from "@/src/components/continue/ContinueWatching";

function Home() {
  const { homeInfo, homeInfoLoading, error } = useHomeInfo();
  if (homeInfoLoading) return <Loader type="home" />;
  if (error) return <Error />;
  if (!homeInfo) return <Error error="404" />;

  const testProxy = () => {
    // 1. The URL of your deployed proxy on Vercel
    const proxyUrl = 'https://your-proxyapi-name.vercel.app'; // <--- REPLACE THIS

    // 2. The external website you want to fetch
    const targetUrl = 'https://www.google.com';

    // 3. Make the request to your proxy, passing the target as a query parameter
    fetch(`${proxyUrl}/?url=${encodeURIComponent(targetUrl)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Get the HTML as text
      })
      .then(html => {
        console.log('Successfully fetched content via proxy!');
        // You can now do something with the fetched HTML
        // For example, display it in a div (though this can be risky - use with caution)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  return (
    <>
      <div className="px-4 w-full max-[1200px]:px-0">
        <div className="App" style={{ margin: '20px' }}>
          <h1>Proxy Test</h1>
          <button onClick={testProxy} style={{ backgroundColor: 'white', color: 'black', padding: '10px', borderRadius: '5px' }}>Test the Proxy</button>
        </div>
        <Spotlight spotlights={homeInfo.spotlights} />
        <ContinueWatching />
        <Trending trending={homeInfo.trending} />
        <div className="mt-10 flex gap-6 max-[1200px]:px-4 max-[1200px]:grid max-[1200px]:grid-cols-2 max-[1200px]:mt-12 max-[1200px]:gap-y-10 max-[680px]:grid-cols-1">
          <Cart
            label="Top Airing"
            data={homeInfo.top_airing}
            path="top-airing"
          />
          <Cart
            label="Most Popular"
            data={homeInfo.most_popular}
            path="most-popular"
          />
          <Cart
            label="Most Favorite"
            data={homeInfo.most_favorite}
            path="most-favorite"
          />
          <Cart
            label="Latest Completed"
            data={homeInfo.latest_completed}
            path="completed"
          />
        </div>
        <div className="w-full grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex flex-col max-[1200px]:px-4">
          <div>
            <CategoryCard
              label="Latest Episode"
              data={homeInfo.latest_episode}
              className={"mt-[60px]"}
              path="recently-updated"
              limit={12}
            />
            <CategoryCard
              label={`New On ${website_name}`}
              data={homeInfo.recently_added}
              className={"mt-[60px]"}
              path="recently-added"
              limit={12}
            />
            <Schedule />
            <CategoryCard
              label="Top Upcoming"
              data={homeInfo.top_upcoming}
              className={"mt-[30px]"}
              path="top-upcoming"
              limit={12}
            />
          </div>
          <div className="w-full mt-[60px]">
            <Genre data={homeInfo.genres} />
            <Topten data={homeInfo.topten} className={"mt-12"} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
