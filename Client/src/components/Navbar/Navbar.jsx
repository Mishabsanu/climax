import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.scss";
import { useDispatch } from "react-redux";
import { setLogout } from "../../Redux/store";
import { setSearchKey } from "../../Redux/store";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import {
  getAllCitys,
  getAllTheater,
  getMovies,
  searchMovie,
} from "../../utils/Constants";

import { toast, ToastContainer } from "react-toastify";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import Swal from "sweetalert2";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "50ch",
      },
    },
  },
}));

const headerNav = [
  {
    display: "Home",
    path: "/",
  },
];

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const user = useSelector((state) => state.user);
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const active = headerNav.findIndex((e) => e.path === pathname);
  const [movies, setMovies] = useState([]);

  const [searchKey, setSearchKeyy] = useState("");
  const [Theater, setTheater] = useState([]);
  const [citys, setCity] = useState([]);

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  useEffect(() => {
    try {
      async function getAllTheaters() {
        await axios
          .get(getAllTheater)
          .then(({ data }) => {
            setTheater(data);
          })
          .catch((error) => {
            if (error.response) {
              generateError(error.response.data.message);
            } else {
              generateError("Network error. Please try again later.");
            }
          });
      }
      getAllTheaters();
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        generateError(error.response.data.message);
      }
    }
  }, []);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");

  const handleCityChange = (event, value) => {
    setSelectedCity(value);
  };

  const handleMovieChange = (event, value) => {
    setSelectedMovie(value);
  };

  const searchBy = (e) => {
    let key = e.target.value;
    if (!key) {
      getMovieList();
    } else {
      axios
        .get(`${searchMovie}/${key}`)
        .then((response) => {
          setMovies(response.data.movie);
        })
        .catch((error) => {
          if (error.response) {
            generateError(error.response.data.message);
          } else {
            generateError("Network error. Please try again later.");
          }
        });
    }
  };

  const dispatch = useDispatch();
  function handleLogout() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Logout this page!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      background: "black",
      color: "white",
      customClass: {
        popup: "my-swal-popup",
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(setLogout());
        }
      })
      .catch((error) => {});
  }

  const navigate = useNavigate();

  useEffect(() => {}, [searchKey]);
  let ss = { sso: "jdjd" };

  dispatch(setSearchKey({ searchKey: searchKey }));

  const getMovieList = () => {
    axios
      .get(getMovies)
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };
  useEffect(() => {
    const getAllCity = () => {
      axios
        .get(getAllCitys)
        .then((response) => {
          setCity(response.data);
        })
        .catch((error) => {
          if (error.response) {
            generateError(error.response.data.message);
          } else {
            generateError("Network error. Please try again later.");
          }
        });
    };
    getAllCity();
  }, []);

  const [movie, getAllMovie] = useState([]);
  const movieTitles = movie.map((m) => m.title);

  useEffect(() => {
    getAllMovieList();
  }, []);

  const getAllMovieList = () => {
    axios
      .get(getMovies)
      .then((response) => {
        getAllMovie(response.data);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };

  useEffect(() => {
    const shrinkHeader = () => {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        headerRef.current.classList.add("shrink");
      } else {
        headerRef.current.classList.remove("shrink");
      }
    };
    window.addEventListener("scroll", shrinkHeader);
    return () => {
      window.removeEventListener("scroll", shrinkHeader);
    };
  }, []);

  return (
    <div ref={headerRef} className="header">
      <div className="header__wrap container">
        <div className="logo">
          <Link style={{ textDecoration: "none", color: "white" }} to="/">
            CLI <span style={{ color: "red" }}>MAX</span>
          </Link>
        </div>
        <ul className="header__nav">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(e) => setSearchKeyy(e.target.value)}
              value={searchKey}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          {headerNav.map((e, i) => (
            <li
              style={{ textDecoration: "none" }}
              key={i}
              className={`${i === active ? "active" : ""}`}
            >
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={e.path}
              >
                {e.display}
              </Link>
            </li>
          ))}
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={citys.citys}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="CITY" />}
          />
          <div>
            <Button
              id="fade-button"
              aria-controls={open ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <h3 className="username">{user?.username}</h3>
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={open}
              TransitionComponent={Fade}
            >
              <MenuItem style={{ backgroundColor: "black" }}>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/profile"
                >
                  <h4>PROFILE</h4>
                </Link>
              </MenuItem>
              <MenuItem style={{ backgroundColor: "black", color: "white" }}>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/booking"
                >
                  <h4>BOOKING</h4>
                </Link>
              </MenuItem>
              <MenuItem
                style={{ backgroundColor: "black", color: "white" }}
                onClick={handleClose}
              >
                <h4>CLOSE</h4>
              </MenuItem>
            </Menu>
          </div>

          {user ? (
            <Button onClick={handleLogout} variant="contained" color="error">
              {" "}
              <span style={{ color: "white", paddingLeft: "10px" }}>
                Logout
              </span>
            </Button>
          ) : (
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/login"
            >
              <h2>Signup</h2>
            </Link>
          )}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Header;
