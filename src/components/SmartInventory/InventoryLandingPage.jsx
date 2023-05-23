import axios from "axios";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { APIKey, BaseAPIUrl } from "../../App";
import DeleteIcon from "../../assets/DeleteIcon.svg";
import EditIcon from "../../assets/EditIcon.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import NSLButton from "../../common/components/Buttons/Button";
import DeleteInventory from "./Create/DeleteInventory";
import InventoryCreate from "./Create/InventoryCreate";
import "./style.css";

export default function InventoryLandingPage() {
  const [productList, setProductList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [product, setProduct] = useState(null);

  const headerData = [
    "SL",
    "Asset No.",
    "Category",
    "Image",
    "Product Name",
    "Serial No.",
    "Price",
    "Warranty",
    "Purchase Date",
    "Action",
  ];

  // Read all product
  const productLanding = () => {
    const config = {
      headers: {
        apiKey: APIKey,
      },
    };
    axios
      .get(`${BaseAPIUrl}products`, config)
      .then((response) => {
        setProductList(response?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // Category DDL
  const getCategory = () => {
    axios
      .get(`${BaseAPIUrl}products/category-name-wise-product-names`)
      .then((response) => {
        setCategoryList(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    productLanding();
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delete Function
  const deleteById = async (productId) => {
    try {
      const apiUrl = `${BaseAPIUrl}products/${productId}`;
      const headers = {
        apiKey: APIKey,
      };

      await axios.delete(apiUrl, { headers });
      toast.success("Delete Successfully!");
      setIsDeleteModalOpen(false);
      productLanding();
    } catch (error) {
      toast.warning("Error Deleting the Product!", error?.message);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleClick = () => {
    openModal();
  };

  // Edit handler
  const editHandler = (id) => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BaseAPIUrl}products/${id}`, {
          headers: {
            apiKey: APIKey,
          },
        });
        setProduct(response?.data);
        setIsModalOpen(true);
      } catch (error) {
        toast.warning("Error fetching product!", error?.message);
      }
    };
    if (id) {
      fetchData();
    }
  };

  const deleteHandler = (item) => {
    setSelectedProduct(item);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-between mt-[23px] mb-[29px]">
        <NSLButton onClick={handleClick} type={"main"}>
          Add Inventory
        </NSLButton>
        <div className="responsive-search">
          <div className="flex justify-center items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search here"
                className="w-[285px] h-[42px] pl-[21px] pr-4 py-[11px] border text-[16px] font-[400] border-gray-300 rounded-[4px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <img
                src={SearchIcon}
                alt="Search Icon"
                className="absolute right-[14px] top-[13px] h-[17px] w-[17px] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      {/* table */}
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="w-full inline-block align-middle">
            <div className="overflow-hidden table_wrapper">
              <div className="table-responsive">
                <table className="min-w-full divide-y divide-gray-200 table-auto">
                  <thead className="bg-[#CFD5DB]">
                    <tr>
                      {headerData?.map((item, index) => {
                        return (
                          <th
                            key={index}
                            scope="col"
                            className="px-5 py-[10px] text-[14px] text-[#333333] font-bold text-center "
                          >
                            {item}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productList?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-5 py-[15px] text-[14px] font-normal text-center text-[#333333]">
                          {index + 1}
                        </td>
                        <td className="px-5 py-[15px] text-[14px] font-normal text-center text-[#333333]">
                          {item?.assetNumber}
                        </td>
                        <td className="px-5 py-[15px] text-[14px] font-normal text-center text-[#333333]">
                          {item?.categoryName}
                        </td>
                        <td className="px-5 py-[15px] text-[14px] font-normal text-center text-[#333333]">
                          {item.productPhoto ? (
                            <img
                              className="w-[29px] h-[29px] m-[auto] rounded-full text-center"
                              src={BaseAPIUrl + item?.productPhoto?.v50x50Path}
                              alt="Product Photo"
                            />
                          ) : null}
                        </td>
                        <td className="px-5 py-[15px] text-[14px] font-normal text-center text-[#333333]">
                          {item?.productName}
                        </td>
                        <td className="px-5 py-[15px] text-[14px] font-normal text-center text-[#333333]">
                          {item?.serialNumber}
                        </td>
                        <td className="px-5 py-[15px] text-[14px] font-normal text-center text-[#333333]">
                          {item?.purchasePrice}
                        </td>
                        <td className="px-5 py-[15px] text-[14px] font-normal text-center text-[#333333]">
                          {item?.warrantyInYears
                            ? item?.warrantyInYears + " Year"
                            : "N/A"}
                        </td>
                        <td className="px-5 py-[15px] text-[14px] font-normal text-center text-[#333333]">
                          {moment(item?.purchaseDate)?.format("DD MMM,YYYY")}
                        </td>
                        <td className="px-5 py-[15px] text-[14px] font-normal">
                          <div className="flex justify-center items-center">
                            <img
                              className="icon-image cursor-pointer mr-[7px] p-[5px] w-[22px] h-[22px] bg-[#F6E7EA]"
                              src={EditIcon}
                              alt=""
                              onClick={() => {
                                editHandler(item?.id);
                              }}
                            />
                            <img
                              className="icon-image cursor-pointer"
                              src={DeleteIcon}
                              alt=""
                              onClick={() => {
                                deleteHandler(item);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Create Modal */}
      <InventoryCreate
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editProductRow={product}
        setProduct={setProduct}
        getCategory={getCategory}
        categoryList={categoryList}
        productLanding={productLanding}
      />
      {/* Delete Modal */}
      <DeleteInventory
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedProduct={selectedProduct}
        deleteById={deleteById}
      />
    </>
  );
}
