// eslint-disable-next-line react/prop-types
const NSLButton = ({ onClick, className, children, type }) => {
  return (
    <>
      {type === "main" && (
        <button
          className={` bg-customColor text-[#FFFFFF] text-[16px] font-semibold py-[7px] px-[10px] ${className}`}
          onClick={onClick}
        >
          {children}
        </button>
      )}
      {type === "submit" && (
        <button
          className={` bg-customSaveColor text-[#FFFFFF] text-[14px] font-semibold py-[10.5px] px-[20px] ${className}`}
          onClick={onClick}
        >
          {children}
        </button>
      )}
      {type === "delete" && (
        <button
          className={` bg-customDeleteColor text-[#FFFFFF] text-sm font-semibold py-[10.5px] px-5 ${className}`}
          onClick={onClick}
        >
          {children}
        </button>
      )}
      {type === "cancel" && (
        <button
          className={` text-[#EB5757] text-[14px] font-semibold border  border-customDeleteColor py-[9.5px] px-[20px] ${className} `}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </>
  );
};

export default NSLButton;
