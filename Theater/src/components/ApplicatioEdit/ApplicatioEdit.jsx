import React, { useState } from "react";
import "./ApplicatioEdit.scss";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// import { addMovie } from "../../utils/Constants";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { editApplications } from "../../utils/Constants";

const ApplicatioEdit = () => {
  const dispatch = useDispatch();

  const theater = useSelector((state) => state.theater);
  const theaterId = theater._id;

  const [theatername, setTheatername] = useState(
    theater.application.theatername
  );
  const [state, setState] = useState(theater.application.state);
  const [place, setPlace] = useState(theater.application.place);
  const [discription, setDiscription] = useState(
    theater.application.discription
  );
  const [city, setCity] = useState(theater.application.city);

  const token = useSelector((state) => state.token);

  const [status, setStatus] = useState();

  const [error, setError] = useState("");
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [imageSelected, setImageSelected] = useState(null);
  const onSubmit = async (data) => {
    toast.success("Edit successful!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });

    const formData = new FormData();

    formData.append("file", imageSelected);
    formData.append("upload_preset", "ml_default");

    reset();
    axios
      .post(
        "https://api.cloudinary.com/v1_1/dwkom79iv/image/upload",
        formData,
        { withCredentials: false }
      )
      .then(async (response) => {
        if (response.status === 200) {
          let imageUrl = response.data.secure_url;

          const application = {
            theatername: data.theatername,
            state: data.state,
            place: data.place,
            discription: data.discription,
            imageUrl: imageUrl,
            city: data.city,
          };
          axios
            .post(`${editApplications}`, { application, theaterId }, {})
            .then(async (response) => {
              if (response.application.status) {
                setStatus(true);

                let id = response.application.id;
                await axios
                  .post(`/api/theatre/upload-file/${id}`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then(({ data }) => {
                    alert(data);
                  });
              } else {
                setStatus(true);
                generateError(response.error.message);
              }
            })
            .catch((error) => {
              // handle the error here, for example:
              if (error.response) {
                generateError(error.response.data.message);
              } else {
                generateError("Network error. Please try again later.");
              }
            });
        }
      })
      .catch((error) => {
        // handle the error here, for example:
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
        <div className="bottom">
          <div className="left">
            <img
              src={
                imageSelected
                  ? URL.createObjectURL(imageSelected)
                  : theater.application.imageUrl
              }
              alt=""
            />
          </div>
          <div className="right">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              id="form"
            >
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  accept="image/jpeg, image/png"
                  type="file"
                  id="file"
                  onChange={(e) => setImageSelected(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <label>THEATER NAME</label>
                <input
                  type="text"
                  placeholder="ENETR THEATER NAME"
                  defaultValue={theater.application.theatername}
                  onChange={(event) => setTheatername(event.target.value)}
                  {...register("theatername")}
                />
              </div>
              <div className="formInput">
                <label>STATE</label>
                <input
                  type="text"
                  defaultValue={theater.application.state}
                  onChange={(event) => setState(event.target.value)}
                  placeholder="ENTER STATE"
                  {...register("state")}
                />
              </div>
              <div className="formInput">
                <label>PLACE</label>
                <input
                  type="text"
                  defaultValue={theater.application.place}
                  onChange={(event) => setPlace(event.target.value)}
                  placeholder="ENETR PLACE "
                  {...register("place", {})}
                />
              </div>
              <div className="formInput">
                <label>DISCRPTION</label>
                <input
                  type="text"
                  defaultValue={theater.application.discription}
                  onChange={(event) => setDiscription(event.target.value)}
                  placeholder="ENTER DISCRPTION "
                  {...register("discription")}
                />
              </div>
              <div className="formInput">
                <label>CITY</label>
                <input
                  type="text"
                  defaultValue={theater.application.city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="ENTER CITY "
                  {...register("city")}
                />
              </div>

              <button type="submit">SAVE</button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ApplicatioEdit;
