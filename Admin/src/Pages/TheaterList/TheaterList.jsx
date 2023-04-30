import "./TheaterList";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import TheaterTable from "../../components/TheaterTable/TheaterTable";

const Singles = () => {
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="bottom">
        <h1 className="title">THEATER LIST</h1>
          <TheaterTable/>
        </div>
      </div>
    </div>
  );
};

export default Singles;
