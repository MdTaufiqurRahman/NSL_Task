import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Main from "./components/Main/Main";

export const BaseAPIUrl = "http://182.163.101.173:49029/product-crud/";
export const APIKey = "ABAd/fIIrrYfdoXQ1SQgYCkh18CDiOSMjPYsJ3tJdDQ=";

function App() {
  return (
    <>
      <Main />
      <div>
        <ToastContainer
          position="bottom-right"
          newestOnTop={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={1}
          autoClose={1500}
        />
      </div>
    </>
  );
}

export default App;
