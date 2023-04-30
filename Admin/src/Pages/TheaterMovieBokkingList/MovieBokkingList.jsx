import "./MovieBokkingList.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import TheaterBooking from "../../components/TheaterBooking/TheaterBooking";

const MovieBokkingList = () => {
  return (

        <div className="single">
        <Sidebar />
        <div className="singleContainer">
          <Navbar />
          <div className="bottom">
          <h1 className="title">THEATER BOOKING MANAGE </h1>
          <TheaterBooking/>
          </div>
        </div>
      </div>
  )
}

export default MovieBokkingList