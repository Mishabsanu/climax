import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addShow,
  editSreenShow,
  getscreens,
  postScreenInfo,
} from "../../utils/Constants";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getMovies } from "../../utils/Constants";
import { useCallback } from "react";
import { setTheater } from "../../Redux/store";
import Selects from "react-select";

const AddScreen = () => {
  const { id: show } = useParams();

  const token = useSelector((state) => state.token);
  const theaterinfo = useSelector((state) => state.theater);

  let screenDetails = null;

  for (let scr of theaterinfo.screen) {
    if (scr.screenname == show) {
      screenDetails = scr;
      break;
    }
  }

  const moviName = screenDetails.show[0].moviename;

  const [moviename, setMoviename] = useState(screenDetails.show[0].moviename);
  const [ticketPrice, setTicketPrice] = useState(
    theaterinfo.screen[0].ticketPrice
  );
  // const [ShowTimes, setShowTimes] = useState(screenDetails.show[0].time);
  const allTimes = screenDetails?.show[0]?.time || [];

  const [ShowTimes, setShowTimes] = useState(allTimes);

  const { id } = useParams();
  const screenName = id;

  const handleTimingsChange = (selectedOptions) => {
    const selectedTimes = selectedOptions.map((option) => option.value);
    setShowTimes(selectedTimes);
  };
  const timeOptions = [
    { value: "10.00 AM", label: "10.00 AM" },
    { value: "12.35 PM", label: "12.35 PM" },
    { value: "4.00 PM", label: "4.00 PM" },
    { value: "7.30 PM", label: "7.30 PM" },
    { value: "10.30 PM", label: "10.30 PM" },
  ];

  const [movies, getAllMovie] = useState([]);
  useEffect((key) => {
    getAllMovieList();
  }, []);

  const getAllMovieList = () => {
    axios
      .get(getMovies, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
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

  const [screen, setScreen] = useState([]);

  useEffect(() => {
    getscreen();
  }, []);

  const getscreen = useCallback(async () => {
    const theatreId = theater._id;

    axios.get(`${getscreens}/${theatreId}`).then((response) => {
      setScreen(response.data.screen);
    });
  });

  const dispatch = useDispatch();

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const theater = useSelector((state) => state.theater);
  const theaterId = theater._id;
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    data.ShowTimes = ShowTimes;
    const formData = new FormData();
    const datas = {
      moviename: data.moviename,
      ticketPrice: data.ticketPrice,
      time: ShowTimes,
    };
    setRefresh(data.moviename);
    reset();

    axios
      .post(
        editSreenShow + `/${theaterId}/${screenName}/${moviName}`,
        {
          datas,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        dispatch(setTheater({ theater: response.data }));

        if (response.data) {
          toast.success(
            `Screen info added Succsessfully`,
            { theme: "light" },
            {
              position: "top-right",
            }
          );
          navigate("/screen");
        } else {
          generateError(response.error.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };

  const handleSelectChange = (event) => {
    handleChange(event);
    setMoviename(event.target.value);
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>ADD SCREEN DETAILS</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit(onSubmit)} id="form">
              <div className="formInput">
                <label>MOVIE NAME</label>
                <br />
                <Box sx={{ minWidth: 50 }}>
                  <FormControl fullWidth>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue={screenDetails?.show[0].moviename}
                      {...register("moviename", {
                        required: true,
                        maxLength: 20,
                        pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
                      })}
                      label="Age"
                      onChange={handleSelectChange}
                    >
                      {movies.map((obj, i) => {
                        return (
                          <MenuItem value={obj.title}>{obj.title}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div className="formInput">
                <div className="formInput">
                  <label>TICKET PRICE</label>
                  <input
                    type="number"
                    className="formInput"
                    placeholder="TICKET PERICE"
                    value={ticketPrice}
                    defaultValue={screenDetails?.show[0].ticketPrice}
                    onChange={(event) => setTicketPrice(event.target.value)}
                    {...register("ticketPrice", {
                      required: true,
                    })}
                  />
                  <span className="text-danger">
                    {errors.rows?.type === "required" && (
                      <span>TICKET PRICE is required</span>
                    )}
                  </span>
                </div>
                <div className="w-full">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="movie-timing"
                  >
                    Movie timings
                  </label>
                  <Selects
                    defaultValue={allTimes?.map((time) => ({ time }))}
                    onChange={handleTimingsChange}
                    isMulti
                    name="timings"
                    options={timeOptions}
                    value={ShowTimes?.map((time) => ({
                      value: time,
                      label: time,
                    }))}
                    className="w-full text-black"
                    classNamePrefix="select"
                  />
                  {ShowTimes.length === 0 ? (
                    <div style={{ color: "red" }} className="text-red-500">
                      Please select at least one timing
                    </div>
                  ) : null}
                </div>
                <button type="submit">Send</button>
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AddScreen;
