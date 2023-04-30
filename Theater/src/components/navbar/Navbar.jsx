import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import {useSelector} from 'react-redux'


const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const theater = useSelector(state=>state.theater);
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div>
        <div className="items">

          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <img
              src={theater?.application?.imageUrl}
              alt=""
              className="avatar"
            />
          </div>
          <h1>{theater?.Name}</h1>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
