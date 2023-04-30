import "./AddScreen.scss";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addscreenpost, deletScreen, getscreen } from "../../utils/Constants";
import { experimentalStyled as styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { setTheater } from "../../Redux/store";
import Swal from "sweetalert2";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const AddScreen = () => {
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const theater = useSelector((state) => state.theater);
  const [screen, setScreen] = useState([]);

  useEffect(() => {
    getOnescreen();
  }, []);

  const getOnescreen = useCallback(async () => {
    const theatreId = theater._id;

    axios
      .get(`${getscreen}/${theatreId}`)
      .then((response) => {
        setScreen(response.data.screeninfo);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  });

  const [err, setErr] = useState(false);

  const userId = theater?._id;
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
    const formData = new FormData();
    const datas = {
      screenname: data.screenname,
      rows: data.rows,
      column: data.column,
    };
    setRefresh(data.screenname);
    reset();

    axios
      .post(
        addscreenpost,
        { datas, userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        setScreen(response.data.updated);

        if (response.data.status) {
          toast.success(
            `Screen Add successful!`,
            { theme: "light" },
            {
              position: "top-right",
            }
          );
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

  const handleDelete = (screenname) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete screen !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${deletScreen}/${userId}/${screenname}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setScreen(response.data);
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          })
          .catch((error) => {
            // handle error
            console.log(error);
          });
      }
    });
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>ADD SCREEN</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit(onSubmit)} id="form">
              <div className="formInput">
                <label>Screen Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Screen Name"
                  {...register("screenname", {
                    required: true,
                    maxLength: 10,
                    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
                  })}
                />
                <span style={{ color: "red" }} className="text-danger">
                  {errors.screenname?.type === "required" && (
                    <span>Screen Name is required</span>
                  )}
                  {errors.screenname?.type === "maxLength" && (
                    <span>Screen Name must less than 10 Character</span>
                  )}
                  {errors.screenname?.type === "pattern" && (
                    <span>Should not have spaces</span>
                  )}
                </span>
              </div>
              <div className="formInput">
                <div className="formInput">
                  <label>Number of rows</label>
                  <input
                    type="number"
                    className="formInput"
                    placeholder="Rows"
                    {...register("rows", {
                      required: true,
                    })}
                  />
                  <span style={{ color: "red" }} className="text-danger">
                    {errors.rows?.type === "required" && (
                      <span>rows is required</span>
                    )}
                  </span>
                </div>
                <div className="formInput">
                  <label>Number of columns</label>
                  <input
                    type="number"
                    className="form-formInput"
                    placeholder="Column"
                    {...register("column", {
                      required: true,
                    })}
                  />
                  <span style={{ color: "red" }} className="text-danger">
                    {errors.column?.type === "required" && (
                      <span>column is required</span>
                    )}
                  </span>
                </div>
                <button type="submit">SAVE</button>
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
        <div className="top">
          <h1>LIST SCREEN</h1>
        </div>
        {screen?.screen?.map((screenObj) => (
          <div className="bottom" key={screenObj.screenname}>
            <div className="left">
              {screenObj.show ? (
                <Grid
                  container
                  spacing={2}
                  columns={12}
                  style={{ paddingLeft: "10px" }}
                >
                  <Grid item xs={2} sm={2} md={2}>
                    <Item style={{ backgroundColor: "wheat", color: "black" }}>
                      {screenObj.screenname}
                    </Item>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1}>
                    <Item style={{ backgroundColor: "wheat", color: "red" }}>
                      <Link>
                        <DeleteIcon
                          onClick={() => handleDelete(screenObj.screenname)}
                        />
                      </Link>
                    </Item>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1}>
                    <Link to={`/editSreen/${screenObj.screenname}`}>
                      <Item
                        style={{ backgroundColor: "wheat", color: "green" }}
                      >
                        <EditIcon />
                      </Item>
                    </Link>
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  spacing={2}
                  columns={12}
                  style={{ paddingLeft: "10px" }}
                >
                  <Grid item xs={2} sm={2} md={2}>
                    <Item style={{ backgroundColor: "wheat", color: "black" }}>
                      {screenObj.screenname}
                    </Item>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1}>
                    <Item style={{ backgroundColor: "wheat", color: "red" }}>
                      <DeleteIcon
                        onClick={() => handleDelete(screenObj.screenname)}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1}>
                    <Link to={`/editSreen/${screenObj.screenname}`}>
                      <Item
                        style={{ backgroundColor: "wheat", color: "green" }}
                      >
                        <EditIcon />
                      </Item>
                    </Link>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1}>
                    <Item style={{ backgroundColor: "wheat", color: "blue" }}>
                      <Link to={`/addTheaterDetails/${screenObj.screenname}`}>
                        <AddCircleRoundedIcon />
                      </Link>
                    </Item>
                  </Grid>
                </Grid>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddScreen;
