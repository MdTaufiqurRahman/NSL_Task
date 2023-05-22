/* eslint-disable react/prop-types */
import NSLButton from "../../../common/components/Buttons/Button";
import NSLModal from "../../../common/components/modal/NSLModal";

export default function DeleteInventory({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedProduct,
  deleteById,
}) {
  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <NSLModal isOpen={isDeleteModalOpen} onClose={closeModal} title={""}>
        <div className="flex justify-end mr-[52px] mt-[27px] mb-[30px]">
          <NSLButton
            onClick={closeModal}
            type={"cancel"}
            className={"mr-[10px] w-[83px] h-[42px] border-[2px] rounded-[4px]"}
          >
            No
          </NSLButton>
          <NSLButton
            onClick={() => deleteById(selectedProduct?.id)}
            type={"delete"}
            className={"w-[83px] h-[42px] rounded-[4px]"}
          >
            Yes
          </NSLButton>
        </div>
      </NSLModal>
    </>
  );
}
