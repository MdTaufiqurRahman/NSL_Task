/* eslint-disable react/prop-types */
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { APIKey, BaseAPIUrl } from "../../../App";
import CameraIcon from "../../../assets/CameraIcon.svg";
import ImageCross from "../../../assets/ImageCross.svg";
import PlusIcon from "../../../assets/PlusIcon.svg";
import NSLButton from "../../../common/components/Buttons/Button";
import Required from "../../../common/components/Required";
import NSLModal from "../../../common/components/modal/NSLModal";

export default function InventoryCreate({
  isModalOpen,
  setIsModalOpen,
  editProductRow,
  setProduct,
  getCategory,
  categoryList,
  productLanding,
}) {
  const [warranty, setWarranty] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [imageError, setImageError] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState({
    day: moment()?.format("D"),
    month: moment()?.format("M"),
    year: moment()?.format("YYYY"),
  });
  const [warrantyDate, setWarrantDate] = useState({
    warrantyDay: moment()?.format("D"),
    warrantyMonth: moment()?.format("M"),
    warrantyYear: moment()?.format("YYYY"),
  });
  // eslint-disable-next-line no-unused-vars
  const [month, setMonth] = useState("jun");
  const [year, setYear] = useState();
  // eslint-disable-next-line no-unused-vars
  const [day, setDay] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const categories = categoryList;

  useEffect(() => {
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //  when edit button is clicked, the current row data is set to the state
  useEffect(() => {
    if (editProductRow) {
      setWarranty(editProductRow?.warrantyInYears);
      setPurchasePrice(editProductRow?.purchasePrice);
      setSerialNumber(editProductRow?.serialNumber);
      setSelectedCategory(editProductRow?.categoryName);
      setSelectedProduct(editProductRow?.productName);
      setDay(moment(editProductRow?.warrantyExpireDate)?.format("D"));
      setYear(moment(editProductRow?.warrantyExpireDate)?.format("YYYY"));
      setPurchaseDate({
        day: moment(editProductRow?.purchaseDate)?.format("D"),
        month: moment(editProductRow?.purchaseDate)?.format("M"),
        year: moment(editProductRow?.purchaseDate)?.format("YYYY"),
      });
      if (editProductRow?.warrantyInYears) {
        setChecked(true);
        setWarrantDate({
          warrantyDay: moment(editProductRow?.warrantyExpireDate)?.format("D"),
          warrantyMonth: moment(editProductRow?.warrantyExpireDate)?.format(
            "M"
          ),
          warrantyYear: moment(editProductRow?.warrantyExpireDate)?.format(
            "YYYY"
          ),
        });
      }
      setPreviewImage(
        `${BaseAPIUrl}${editProductRow?.productPhoto?.originalPath}`
      );
      setSelectedImage(editProductRow?.productPhoto?.photoName || "Demo.jpg");
    }
  }, [editProductRow]);

  // form validation
  const validateForm = () => {
    const errors = {};
    if (!selectedCategory) {
      errors.selectedCategory = "Category is required";
    }
    if (!selectedProduct) {
      errors.selectedProduct = "Product Name is required";
    }
    if (!purchasePrice) {
      errors.purchasePrice = "Purchase Price is required";
    }
    if (!Number(warranty) && checked) {
      errors.warranty = "Warranty is required";
    }
    if (!selectedImage) {
      setImageError(true);
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Image Upload Handler
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(imageFile);
  };

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editProductRow) {
        const url = `${BaseAPIUrl}products/${
          editProductRow && editProductRow?.id
        }`;
        const headers = {
          apiKey: APIKey,
          "Content-Type": "application/json",
        };
        const editData = {
          id: editProductRow && editProductRow?.id,
          categoryName: selectedCategory,
          productName: selectedProduct,
          serialNumber: serialNumber,
          purchasePrice: Number(purchasePrice),
          purchaseDate: `${purchaseDate?.year}-${purchaseDate?.month}-${purchaseDate?.day}`,
          warrantyInYears: checked ? Number(warranty) : null,
          warrantyExpireDate: checked
            ? `${warrantyDate?.warrantyYear}-${warrantyDate?.warrantyMonth}-${warrantyDate?.warrantyDay}`
            : null,
        };
        axios
          .put(url, editData, { headers })
          .then((response) => {
            console.log(response.data);
            toast.success("Product Edited successfully!");
            closeModal();
            productLanding();
          })
          .catch((error) => {
            console.log("error", error);
            toast.error("Error Editing product.");
          });

        const ImageURL = `${BaseAPIUrl}products/${
          editProductRow && editProductRow?.id
        }/upload-product-photo`;

        const formData = new FormData();
        formData.append(
          "productPhoto",
          selectedImage,
          `Image_${moment()?.format("DD-MM-YYYY HH:mm:ss")}.jpg`
        );
        const config = {
          headers: {
            apiKey: APIKey,
            "Content-Type": "multipart/form-data",
          },
        };
        axios
          .put(ImageURL, formData, config)
          .then((response) => {
            console.log(response.data);
            closeModal();
            productLanding();
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else {
        const product = {
          categoryName: selectedCategory,
          productName: selectedProduct,
          serialNumber: serialNumber,
          purchasePrice: Number(purchasePrice),
          purchaseDate: `${purchaseDate?.year}-${purchaseDate?.month}-${purchaseDate?.day}`,
          warrantyInYears: checked ? Number(warranty) : null,
          warrantyExpireDate: checked
            ? `${warrantyDate?.warrantyYear}-${warrantyDate?.warrantyMonth}-${warrantyDate?.warrantyDay}`
            : null,
        };
        const json = JSON.stringify(product);
        const blob = new Blob([json], {
          type: "application/json",
        });
        const data = new FormData();
        data.append("product", blob);
        data.append(
          "productPhoto",
          selectedImage,
          `Image_${moment()?.format("DD-MM-YYYY HH:mm:ss")}.jpg`
        );
        try {
          const response = await axios({
            method: "post",
            url: `${BaseAPIUrl}products`,
            headers: {
              "Content-Type": "multipart/form-data",
              apiKey: APIKey,
            },
            data: data,
            // redirect: "follow",
          });
          console.log(response, "response");
          toast.success("Product added successfully!");
          closeModal();
          productLanding();
        } catch (error) {
          console.log("error ", error);
          toast.error("Error adding product.");
        }
      }
    }
  };

  // modal close handler
  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
    setSelectedCategory("");
    setSelectedProduct("");
    setPurchasePrice("");
    setSerialNumber("");
    setWarranty("");
    setPreviewImage(null);
    setChecked(false);
    setSelectedImage(null);
    setProduct(null);
    setPurchaseDate({
      day: moment()?.format("D"),
      month: moment()?.format("M"),
      year: moment()?.format("YYYY"),
    });
    setWarrantDate({
      warrantyDay: moment()?.format("D"),
      warrantyMonth: moment()?.format("M"),
      warrantyYear: moment()?.format("YYYY"),
    });
  };

  const saveHandler = (data) => {
    console.log(data);
  };

  const handleChange = () => {
    setChecked(!checked);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedProduct("");
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const categoryOptions = categories.map((category, index) => (
    <option key={index} value={category.name}>
      {category.name}
    </option>
  ));

  const productOptions = categories
    .find((category) => category.name === selectedCategory)
    ?.products.map((product, index) => (
      <option key={index} value={product.name}>
        {product.name}
      </option>
    ));

  // Date selector code
  const months = [
    { id: 1, name: "Jan", days: 31 },
    { id: 2, name: "Feb", days: isLeapYear(year) ? 29 : 28 },
    { id: 3, name: "Mar", days: 31 },
    { id: 4, name: "Apr", days: 30 },
    { id: 5, name: "May", days: 31 },
    { id: 6, name: "Jun", days: 30 },
    { id: 7, name: "Jul", days: 31 },
    { id: 8, name: "Aug", days: 31 },
    { id: 9, name: "Sep", days: 30 },
    { id: 10, name: "Oct", days: 31 },
    { id: 11, name: "Nov", days: 30 },
    { id: 12, name: "Dec", days: 31 },
  ];
  const years = Array.from({ length: 46 }, (_, i) => 2021 + i);
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // Image First and Last Three Characters Function
  function getFirstAndLastThreeCharacters(str) {
    if (str && str?.length < 13) {
      return str;
    }
    const firstThree = str?.slice(0, 5);
    const lastThree = str?.slice(-5);
    return firstThree + "..." + lastThree;
  }

  return (
    <>
      <NSLModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editProductRow ? "Edit This Product" : "Add New Product"}
      >
        <form
          className="flex items-center justify-center flex-col"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex">
            <div className="left-part w-[120px] text-end mr-[17px]">
              <label
                htmlFor="category"
                className="inline-block mr-1 font-normal text-sm text-[#4F4F4F]"
              >
                Category
              </label>
              <Required />
            </div>
            <div className="right-part flex w-[350px] flex-col">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="block w-full px-[12px] py-[7px] text-[13px] font-[400] text-[#333333] border border-gray-300"
              >
                <option value="">Select Category</option>
                {categoryOptions}
              </select>
              <div>
                {errors.selectedCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.selectedCategory}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mb-4 flex ">
            <div className="left-part w-[120px] text-end mr-[17px]">
              <label
                htmlFor="productName"
                className="inline-block mr-1 font-normal text-sm text-[#4F4F4F]"
              >
                Product Name
              </label>
              <Required />{" "}
            </div>
            <div className="right-part flex w-[350px] flex-col">
              <select
                value={selectedProduct}
                onChange={handleProductChange}
                className="block w-full px-[12px] py-[7px] text-[13px] font-[400] text-[#333333] border border-gray-300"
                disabled={!selectedCategory}
              >
                <option value="">Select Product</option>
                {productOptions}
              </select>
              <div>
                {errors.selectedProduct && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.selectedProduct}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mb-4 flex">
            <div className="left-part w-[120px] text-end mr-[17px]">
              <label
                htmlFor="serialNumber"
                className="inline-block mr-1 font-normal text-sm text-[#4F4F4F]"
              >
                Serial Number
              </label>
            </div>
            <div className="right-part flex w-[350px]">
              <input
                type="text"
                id="serialNumber"
                className={`w-full px-[12px] py-[7px] border text-[13px] font-[400] text-[#333333] ${
                  errors.serialNumber ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                value={serialNumber}
                placeholder="Enter Serial Number"
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4 flex">
            <div className="left-part w-[120px] text-end mr-[17px]">
              <label
                htmlFor="purchasePrice"
                className="inline-block mr-1 font-normal text-sm text-[#4F4F4F]"
              >
                Purchase Price
              </label>
              <Required />
            </div>
            <div className="right-part flex w-[350px] flex-col">
              <input
                type="number"
                id="purchasePrice"
                className={`w-full px-[12px] py-[7px] text-[13px] font-[400] text-[#333333] border ${
                  errors.purchasePrice ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                value={purchasePrice}
                placeholder="Enter Purchase Price"
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
              <div>
                {errors.purchasePrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.purchasePrice}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mb-4 flex">
            <div className="left-part w-[120px] text-end mr-[17px]">
              <label
                htmlFor="Purchase-date"
                className="mr-1 text-sm text-[#4F4F4F]"
              >
                Purchase Date <Required />
              </label>
            </div>
            <div className="right-part w-[350px] flex">
              <div className="w-[32%] mr-[2%]">
                <label htmlFor="day" className="sr-only">
                  Day
                </label>
                <select
                  id="day"
                  name="day"
                  className="px-[9px] py-[7px] text-[13px] font-[400] text-[#333333] border border-gray-300 w-full"
                  value={purchaseDate?.day}
                  onChange={(e) => {
                    const getPurchaseDate = { ...purchaseDate };
                    const getWarrantyDate = { ...warrantyDate };
                    getPurchaseDate.day = e?.target?.value;
                    getWarrantyDate.warrantyDay = e?.target?.value;
                    setWarrantDate(getWarrantyDate);
                    setPurchaseDate(getPurchaseDate);
                  }}
                >
                  {Array.from(
                    {
                      length: months.find((m) => m.id === month)?.days || 31,
                    },
                    (_, i) => i + 1
                  ).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-[32%]  mr-[2%]">
                <label htmlFor="month" className="sr-only">
                  Month
                </label>
                <select
                  id="month"
                  name="month"
                  value={purchaseDate.month}
                  className="px-[14px] py-[7px] text-[13px] font-[400] text-[#333333] border border-gray-300 w-full"
                  onChange={(e) => {
                    const getPurchaseDate = { ...purchaseDate };
                    const getWarrantyDate = { ...warrantyDate };
                    getPurchaseDate.month = e?.target?.value;
                    getWarrantyDate.warrantyMonth = e?.target?.value;
                    setPurchaseDate(getPurchaseDate);
                    setWarrantDate(getWarrantyDate);
                  }}
                >
                  {months.map((month) => (
                    <option key={month.id} value={month.id}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-[32%] ">
                <label htmlFor="year" className="sr-only">
                  Year
                </label>
                <select
                  value={purchaseDate.year}
                  id="year"
                  name="year"
                  className="px-[12px] py-[7px] text-[13px] font-[400] text-[#333333] border border-gray-300 w-full"
                  onChange={(e) => {
                    const getPurchaseDate = { ...purchaseDate };
                    setWarrantDate({
                      ...warrantyDate,
                      warrantyYear: Number(e.target.value) + Number(warranty),
                    });
                    getPurchaseDate.year = e?.target?.value;
                    setPurchaseDate(getPurchaseDate);
                  }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mb-4 flex">
            <div className="left-part w-[120px] mr-[17px]"></div>
            <div className="right-part w-[350px] flex">
              <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                className="form-checkbox h-4 text-indigo-600 transition duration-150 ease-in-out mt-[2px]"
              />
              <label className="ml-[5px] text-[14px] font-[400]">
                {"Has Warranty"}
              </label>
            </div>
          </div>
          {checked ? (
            <>
              <div className="mb-4 flex">
                <div className="left-part w-[120px] text-end mr-[17px]">
                  <label
                    htmlFor="warranty"
                    className="inline-block mr-1 font-normal text-sm text-[#4F4F4F]"
                  >
                    Warranty
                  </label>
                  <Required />
                </div>
                <div className="right-part flex w-[350px] flex-col">
                  <select
                    id="warranty"
                    className={`w-full px-[12px] py-[7px] text-[13px] font-[400] text-[#333333] border ${
                      errors.warranty ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    value={warranty}
                    onChange={(e) => {
                      setWarranty(e.target.value);
                      const getWarrantyDate = { ...warrantyDate };
                      getWarrantyDate.warrantyYear =
                        Number(e?.target?.value) + Number(purchaseDate?.year);
                      setWarrantDate(getWarrantyDate);
                    }}
                  >
                    <option value="">Select Year</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                  </select>
                  <div>
                    {checked && errors.warranty && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.warranty}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-4 flex">
                <div className="left-part w-[120px] text-end mr-[17px]">
                  <label
                    htmlFor="warranty-date"
                    className="mr-1 text-sm text-[#4F4F4F]"
                  >
                    Warranty Expire Date <Required />
                  </label>
                </div>
                <div className="right-part w-[350px] flex">
                  <div className="w-[32%] mr-[2%]">
                    <label htmlFor="warrantyDay" className="sr-only">
                      Day
                    </label>
                    <select
                      id="warrantyDay"
                      disabled={true}
                      name="warrantyDay"
                      className="px-[9px] py-[7px] text-[13px] font-[400] text-[#333333] border border-gray-300 w-full"
                      value={warrantyDate?.warrantyDay}
                      onChange={(e) => {
                        const getWarrantyDate = { ...warrantyDate };
                        getWarrantyDate.warrantyDay = e?.target?.value;
                        setWarrantDate(getWarrantyDate);
                      }}
                    >
                      {Array.from(
                        {
                          length:
                            months.find((m) => m.id === month)?.days || 31,
                        },
                        (_, i) => i + 1
                      ).map((warrantyDay) => (
                        <option key={warrantyDay} value={warrantyDay}>
                          {warrantyDay}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-[32%]  mr-[2%]">
                    <label htmlFor="month" className="sr-only">
                      Month
                    </label>
                    <select
                      id="warrantyMonth"
                      disabled={true}
                      name="warrantyMonth"
                      className="px-[14px] py-[7px] text-[13px] font-[400] text-[#333333] border border-gray-300 w-full"
                      value={warrantyDate?.warrantyMonth}
                      onChange={(e) => {
                        const getWarrantyDate = { ...warrantyDate };
                        getWarrantyDate.warrantyMonth = e?.target?.value;
                        setWarrantDate(getWarrantyDate);
                      }}
                    >
                      {months.map((warrantyMonth) => (
                        <option key={warrantyMonth.id} value={warrantyMonth.id}>
                          {warrantyMonth.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-[32%] ">
                    <label htmlFor="year" className="sr-only">
                      Year
                    </label>
                    <select
                      disabled={true}
                      id="warrantyYear"
                      name="warrantyYear"
                      className="px-[12px] py-[7px] text-[13px] font-[400] text-[#333333] border border-gray-300 w-full"
                      value={warrantyDate?.warrantyYear}
                      onChange={(e) => {
                        const getWarrantyDate = { ...warrantyDate };
                        getWarrantyDate.warrantyYear = e?.target?.value;
                        setWarrantDate(getWarrantyDate);
                      }}
                    >
                      {years.map((warrantyYear) => (
                        <option key={warrantyYear} value={warrantyYear}>
                          {warrantyYear}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <div className="mb-4 flex">
            <div className="left-part w-[120px] mr-[17px]"></div>
            <div className="right-part flex w-[350px] justify-between">
              <div>
                <button
                  type="button"
                  className="flex mt-[37px] h-[42px] items-center gap-2 w-[149px] pl-3 py-2 text-[#333333] bg-white border border-[#BDBDBD] rounded"
                  onClick={handleButtonClick}
                >
                  <img
                    className="bg-[#E0E0E0] p-[3px] rounded-full w-[24px] h-[24px]"
                    src={CameraIcon}
                    alt="camera icon"
                  />
                  <span>
                    Add Image <Required />
                  </span>
                </button>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </div>
                <div>
                  {selectedImage && (
                    <p className="text-[14px] text-[#0F75BC] font-semibold flex mt-[8px]">
                      {getFirstAndLastThreeCharacters(
                        selectedImage?.name || selectedImage
                      )}
                      <img
                        src={ImageCross}
                        className="ml-2 cursor-pointer"
                        alt="image cross"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewImage(null);
                        }}
                      />
                    </p>
                  )}
                  {imageError && (
                    <p className="text-red-500 mt-1">Please select an image.</p>
                  )}
                </div>
              </div>
              <div>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ width: "134px", height: "134px" }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="footer-part mt-7 w-full flex justify-end pr-7 mb-[12px]">
            <button
              type="button"
              className="flex align-middle gap-1 text-[#0F75BC] font-semibold text-sm"
            >
              <img src={PlusIcon} alt="plus icon" />
              <span>Add more Product</span>
            </button>
          </div>
          <div className="footer-part flex w-full justify-end my-[35px] pr-7">
            <NSLButton onClick={closeModal} type={"cancel"} className={"mr-2"}>
              Cancel
            </NSLButton>
            <NSLButton onClick={saveHandler} type={"submit"}>
              Save
            </NSLButton>
          </div>
        </form>
      </NSLModal>
    </>
  );
}
