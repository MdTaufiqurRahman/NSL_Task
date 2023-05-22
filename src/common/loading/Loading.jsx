import loaderGit from "./loader.gif";
import "./loading.css";

function Loading() {
  return (
    <div className='global-loading-css'>
      <img width='80' height='80' src={loaderGit} alt='Loading' />
    </div>
  );
}

export default Loading;
