import "./TheaterList";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import ViewList from "../../components/ViewList/ViewList";

const TheaterView = () => {
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="bottom">
        <h1 className="title">THEATER LIST</h1>
          <ViewList/>
        </div>
      </div>
    </div>
  );
};

export default TheaterView;
