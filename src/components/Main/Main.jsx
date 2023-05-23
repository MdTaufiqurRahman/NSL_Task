import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import InventoryLandingPage from "../SmartInventory/InventoryLandingPage";

export default function Main() {
  return (
    <>
      <Navbar />
      <div
        className=""
        style={{
          minHeight: "calc(100vh - 115px)",
        }}
      >
        <div className="mx-auto max-w-full pl-[25px] pr-[25px]">
          <InventoryLandingPage />
        </div>
      </div>
      <Footer />
    </>
  );
}
