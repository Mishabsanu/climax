import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import { useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editScreen } from "../../utils/Constants";
import { experimentalStyled as styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { setTheater } from "../../Redux/store";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const EditSreen = () => {
  const { id: screen } = useParams();
  const dispatch = useDispatch();

  const theater = useSelector((state) => state.theater);
  let screenDetails = null;

  for (let scr of theater.screen) {
    if (scr.screenname == screen) {
      screenDetails = scr;
      break;
    }
  }

  const [screenname, setScreenname] = useState(theater.screen[0].screenname);
  const [rows, setRows] = useState(theater.screen[0].rows);
  const [column, setColum] = useState(theater.screen[0].column);

  const token = useSelector((state) => state.token);
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
        editScreen,
        { datas, screen, theaterId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        dispatch(setTheater({ theater: response.data.screeninfo }));

        if (response.data.status) {
          toast.success("Screen Edit successful!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          setTimeout(() => {
            navigate("/addscreens");
          }, 2000);
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

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>EDIT SCREEN</h1>
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
                  defaultValue={screenDetails?.screenname}
                  onChange={(event) => setScreenname(event.target.value)}
                  {...register("screenname", {
                    maxLength: 20,
                    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
                  })}
                />
                <span className="text-danger">
                  {errors.name?.type === "required" && (
                    <span>Screen Name is required</span>
                  )}
                  {errors.name?.type === "maxLength" && (
                    <span>Screen Name must less than 20 Character</span>
                  )}
                  {errors.name?.type === "pattern" && (
                    <span>Should not have spaces</span>
                  )}
                </span>
              </div>
              <div className="formInput">
                <div className="formInput">
                  <label>Number of rows</label>
                  <input
                    type="number"
                    defaultValue={screenDetails?.rows}
                    onChange={(event) => setRows(event.target.value)}
                    className="formInput"
                    placeholder="Rows"
                    {...register("rows")}
                  />
                </div>
                <div className="formInput">
                  <label>Number of columns</label>
                  <input
                    type="number"
                    defaultValue={screenDetails?.column}
                    className="form-formInput"
                    onChange={(event) => setColum(event.target.value)}
                    placeholder="Column"
                    {...register("column")}
                  />
                </div>
                <button type="submit">SAVE</button>
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default EditSreen;
