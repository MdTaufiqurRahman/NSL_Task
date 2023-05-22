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
        {/* <form action=""> */}
        <div className="flex justify-end pb-5 pr-6">
          <NSLButton onClick={closeModal} type={"cancel"} className={"mr-2"}>
            No
          </NSLButton>
          <NSLButton
            onClick={() => deleteById(selectedProduct?.id)}
            type={"delete"}
          >
            Yes
          </NSLButton>
        </div>
        {/* </form> */}
      </NSLModal>
    </>
  );
}
