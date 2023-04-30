import "./BookingList";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import BookingDetails from "./BookingDetails";

const BookingList = () => {
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="bottom">
        <h1 className="title">BOOKING  LIST</h1>
          <BookingDetails/>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
