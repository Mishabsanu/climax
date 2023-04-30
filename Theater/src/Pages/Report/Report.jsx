import SaleDetails from "../../components/SaleDetails/SaleDetails";



const Report = () => {
  return (
    <div className="single">
      {/* <Sidebar /> */}
      <div className="singleContainer">
        {/* <Navbar /> */}
        <div className="bottom">
        <h1 className="title">SALES REPORT</h1>
        <SaleDetails/>
        </div>
      </div>
    </div>
  );
};

export default Report;
