import axios from "axios";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { APIKey, BaseAPIUrl } from "../../App";
import DeleteIcon from "../../assets/DeleteIcon.svg";
import EditIcon from "../../assets/EditIcon.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import NSLButton from "../../common/components/Buttons/Button";
import { useAxiosRequest } from "../../common/hooks/useAxiosRequest";
import DeleteInventory from "./Create/DeleteInventory";
import InventoryCreate from "./Create/InventoryCreate";
import "./style.css";

export default function InventoryLandingPage() {
  const [productList, setProductList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const readProducts = useAxiosRequest([]);
  const getCategoryNameWiseProductNames = useAxiosRequest([]);

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

  // Landing Api
  const productLanding = () => {
    readProducts?.apiAction({
      urlObjKey: "readProducts",
      method: "GET",
      headers: {
        apiKey: APIKey,
      },
      cb: (resData) => {
        setProductList(resData);
      },
    });
  };

  // Category DDL
  const getCategory = () => {
    getCategoryNameWiseProductNames?.apiAction({
      urlObjKey: "getCategoryNameWiseProductNames",
      headers: {
        apiKey: APIKey,
      },
      cb: (resData) => {
        setCategoryList(resData);
      },
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
        console.error("Error fetching product:", error);
        toast.warning("Error fetching product!", error?.message);
      } finally {
        setIsLoading(false);
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
                className="w-[285px] h-[42px] pl-[21px] pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <img
                src={SearchIcon}
                alt="Search Icon"
                className="absolute right-3 top-2.5 h-6 w-6 cursor-pointer"
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
                            className="px-6 py-3 text-xs font-bold text-center"
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
                        <td className="px-6 py-4 text-[14px] font-normal text-center">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-normal text-center">
                          {item?.assetNumber}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-normal text-center">
                          {item?.categoryName}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-normal text-center">
                          {item.productPhoto ? (
                            <img
                              className="w-[29px] h-[29px] rounded-full text-center"
                              src={BaseAPIUrl + item?.productPhoto?.v50x50Path}
                              alt="Product Photo"
                            />
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-normal text-center">
                          {item?.productName}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-normal text-center">
                          {item?.serialNumber}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-normal text-center">
                          {item?.purchasePrice}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-normal text-center">
                          {item?.warrantyInYears
                            ? item?.warrantyInYears + " Year"
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-normal text-center">
                          {moment(item?.purchaseDate)?.format("DD MMM,YYYY")}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-normal">
                          <div className="flex justify-center">
                            <img
                              className="icon-image cursor-pointer mr-2 p-[5px] w-[22px] bg-[#F6E7EA]"
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
