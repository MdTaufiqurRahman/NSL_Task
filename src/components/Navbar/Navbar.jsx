import NSLLogo from "../../assets/NSLLogo.png";

export default function Navbar() {
  return (
    <>
      <nav className="customStyleNavbar">
        <div className="max-w-7xl pl-[25px]">
          <div className="flex items-center justify-between h-[62px]">
            <div className="flex-shrink-0">
              <span className="text-white text-lg font-bold">
                <img src={NSLLogo} alt="NSL Logo" />
              </span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
