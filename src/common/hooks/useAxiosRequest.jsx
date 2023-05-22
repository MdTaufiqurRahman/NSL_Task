import axios from "axios";
import { apiPath } from "../apiPath/apiPath";
import { toast } from "react-toastify";
import { useState } from "react";

export const useAxiosRequest = (initData) => {
  const [reqResponse, setReqResponse] = useState({
    error: "",
    resData: initData || "",
    isLoading: false,
    success: "",
  });
  const resetData = () => {
    setReqResponse({
      error: "",
      resData: initData || "",
      isLoading: false,
      success: "",
    });
  };
  const apiAction = ({
    method,
    urlObjKey,
    params,
    headers,
    payload,
    cb,
    isToast,
    successMessage,
    errorMessage,
  }) => {
    const url = apiPath[urlObjKey];

    setReqResponse({
      error: "",
      resData: initData || "",
      isLoading: true,
      success: "",
    });
    axios({
      method: method ? method : "get",
      url: url,
      data: payload && payload,
      params: params,
      headers: headers,
    })
      .then((res) => {
        setReqResponse((prv) => ({
          ...prv,
          error: "",
          resData: res?.data || initData,
          isLoading: false,
          success: res?.data?.message,
        }));
        cb && cb(res.data);
        if (isToast) {
          toast.success(
            successMessage || res?.data?.message || "Submitted Successfully"
          );
        }
      })
      .catch((error) => {
        setReqResponse((prv) => ({
          ...prv,
          error: error,
          resData: initData || "",
          isLoading: false,
          success: "",
        }));
        if (isToast) {
          toast.error(
            errorMessage ||
              error?.response?.data?.message ||
              error?.response?.data?.Message ||
              "Failed, try again"
          );
        }
      });
  };

  const { error, resData, isLoading, success } = reqResponse;
  return { apiAction, resData, isLoading, error, success, resetData };
};

// ======== example ========

// Products?.apiAction({
//   urlObjKey: 'Products',
//   method: 'GET',
//   headers: {
//     apiKey: 'ABAd/fIIrrYfdoXQ1SQgYCkh18CDiOSMjPYsJ3tJdDQ=',
//   },
//   cb: (resData) => {
//     console.log(resData); // Handle the response data here
//   },
// });
