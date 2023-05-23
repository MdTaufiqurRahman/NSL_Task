import Delete from "../../../assets/trash.svg";
import CrossIcon from "../../../assets/CrossIcon.svg";

const NSLModal = ({ isOpen, onClose, children, title }) => {
  const closeModal = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div className="inline-block align-bottom bg-[#F7F7FA] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[582px] sm:w-full">
              {title ? (
                <div className="flex justify-between px-4">
                  <div></div>
                  <div className="font-semibold text-xl mt-[17px] mb-[29px]">
                    {title}
                  </div>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="inline-flex p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                  >
                    <img className="mt-1" src={CrossIcon} alt="cross" />
                  </button>
                </div>
              ) : (
                <div className="pt-5 flex align-center flex-col">
                  <img
                    src={Delete}
                    alt=""
                    className="w-[73px] bg-[#EB57571A] border rounded-full p-2 mx-auto"
                  />
                  <div className="text-center mt-[17px] font-semibold text-[16px] px-4">
                    Are you sure you want to delete this Product ?
                  </div>
                </div>
              )}
              <div className="bg-[#F7F7FA]">{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NSLModal;
