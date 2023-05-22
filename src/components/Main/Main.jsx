import Navbar from "../Navbar/Navbar";
import InventoryLandingPage from "../SmartInventory/InventoryLandingPage";

export default function Main() {
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen">
        <div className="mx-auto max-w-full pl-[25px] pr-[25px]">
          <InventoryLandingPage />
        </div>
      </div>
    </>
  );
}
