import "./PaymentList";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import PaymentManage from "./PaymentManage";

const PaymentList = () => {
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="bottom">
        <h1 className="title">PAYMENT  LIST</h1>
          <PaymentManage/>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;
