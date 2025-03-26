import { getStores } from "../app/lib/getStores";
import StoreList from "../app/component/StoreList";
import Sidebar from "../app/component/SideBar"; // Import Sidebar

export default async function Home() {
  const stores = await getStores(); // Fetch stores on the server side

  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar Added */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 p-6">
        <div className="bg-gray-100 px-6 py-8 mt-11 rounded-lg shadow-md">
          {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Store Category</h2> */}
          <StoreList stores={stores} />
        </div>
      </div>
    </div>
  );
}
