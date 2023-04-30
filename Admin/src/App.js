import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Single from "./Pages/userList/Single";
import New from "./Pages/ADDMOVIE/New";
import { Routes, Route, Navigate } from "react-router-dom";
import "./style/dark.scss";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { DarkModeContext } from "./context/darkModeContext";
import Singles from "./Pages/TheaterList/TheaterList";
import AddPoster from "./Pages/AddPoster/Poster";
import MovieList from "./Pages/MovieList/MovieList";
import TheaterView from "./Pages/TheaterList/TheaterView";
import EditMovie from "./components/EditMovie/EditMovie";
import "react-toastify/dist/ReactToastify.css";
import MovieBokkingList from "./Pages/TheaterMovieBokkingList/MovieBokkingList";
import PageNotFound from "./PageNotFound";
import BookingViewList from "./components/UserBookingViewList/BookingViewList";
import BookingDetails from "./components/UserBookingMnage/BookingList";
import Chat from "./Pages/Chat/Chat";
import Report from "./Pages/Report/Report";
import EditPoster from "./components/EditPoster/EditPoster";
import PosterList from "./components/list/list";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const token = useSelector((state) => state.token);
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/">
          <Route index element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/users-list" element={<Single />} />
          <Route path="/theater-list" element={<Singles />} />
          <Route path="/addMovies" element={<New />} />
          <Route path="/editMovie/:id" element={<EditMovie />} />
          <Route path="/editPoster/:id" element={<EditPoster />} />
          <Route path="/addPoster" element={<AddPoster />} />
          <Route path="/movieList" element={<MovieList />} />
          <Route path="/view/:id" element={<TheaterView />} />
          <Route path="/Bookingview/:id" element={<BookingViewList />} />
          <Route path="/userBooking" element={<BookingDetails />} />
          <Route path="/theaterBooking" element={<MovieBokkingList />} />
          <Route path="/Admin/chat" element={<Chat />} />
          <Route path="/salesreport" element={<Report />} />
          <Route path="/listPoster" element={<PosterList />} />

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
