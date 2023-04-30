import React, { useState } from "react";
import "./new.scss";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// import { addMovie } from "../../utils/Constants";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { applicationPost, getOneTheater } from "../../utils/Constants";
import { useSelector, useDispatch } from "react-redux";
import { setTheater } from "../../Redux/store";

import { useEffect } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
const New = () => {
  const theater = useSelector((state) => state.theater);

  const theaterId = theater?._id;
  const token = useSelector((state) => state.token);

  const [info, setInfo] = useState();

  useEffect(() => {
    heelo();
  }, [heelo]);

  var heelo = useCallback(() => {
    axios
      .get(`${getOneTheater}/${theaterId}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInfo(response.data);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  });

  const [status, setStatus] = useState();
  const dispatch = useDispatch();

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
  const [imageSelected, setImageSelected] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const acceptedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxFileSize = 1000000; // 1MB

  const onImageSelect = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      acceptedFileTypes.includes(file.type) &&
      file.size <= maxFileSize
    ) {
      setImageSelected(file);
      setErrorMessage("");
    } else {
      setImageSelected("");
      setErrorMessage(
        `Please select an image of type ${acceptedFileTypes.join(
          ", "
        )} and size up to ${maxFileSize / 1000000} MB`
      );
    }
  };
  const onSubmit = async (data) => {
    if (!imageSelected) {
      setErrorMessage("Please select an image");
      return;
    }
    const formData = new FormData();

    formData.append("file", imageSelected);
    // formData.append("upload_preset", "kjadhf739")
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
            .post(
              applicationPost,
              { application, theaterId },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(async (response) => {
              dispatch(setTheater({ theater: response.data.updated }));
              if (response.data.application.status) {
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
                    toast.success(
                      `application sended Succsessfully`,
                      { theme: "light" },
                      { position: "top-right" }
                    );
                    navigate("/application");
                  })
                  .catch((error) => {
                    if (error.response) {
                      generateError(error.response.data.message);
                    } else {
                      generateError("Network error. Please try again later.");
                    }
                  });
              } else {
                setStatus(true);
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
    <>
      {theater?.application ? (
        <div className="single">
          <Sidebar />
          <div className="singleContainer">
            <Navbar />
            <div className="top">
              <div className="left">
                <div style={{ color: "red" }}>
                  <Link
                    style={{ textDecoration: "none", color: "green" }}
                    to="/EditApplication"
                  >
                    <EditOutlinedIcon />

                    <h1 className="title">EDIT PROFILE</h1>
                  </Link>
                </div>
                <div className="item">
                  <img
                    src={info?.application?.imageUrl}
                    alt=""
                    className="itemImg"
                  />

                  <div className="details">
                    <h1 className="itemTitle">{info?.Name}</h1>
                    <div className="detailItem">
                      <span className="itemKey">Theatername:</span>
                      <span className="itemValue">
                        {info?.application?.theatername}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Email: </span>
                      <span className="itemValue">{info?.email}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Phone:</span>
                      <span className="itemValue">{info?.phone}</span>
                    </div>

                    <div className="detailItem">
                      <span className="itemKey">Place:</span>
                      <span className="itemValue">
                        {info?.application?.place}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">City:</span>
                      <span className="itemValue">
                        {info?.application?.city}
                      </span>
                    </div>

                    <div className="detailItem">
                      <span className="itemKey">STATE:</span>
                      <span className="itemValue">
                        {info?.application?.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="new">
          <Sidebar />
          <div className="newContainer">
            <Navbar />
            <div className="top">
              <h1>APPLICATION</h1>
            </div>
            <div className="bottom">
              <div className="left">
                <img
                  src={
                    imageSelected
                      ? URL.createObjectURL(imageSelected)
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
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
                       onChange={onImageSelect}
                       accept={acceptedFileTypes.join(",")}
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                    />
                     {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                  </div>
                  <span style={{ color: "red" }} className="text-danger">
                    {errors.imageUrl?.type === "required" && (
                      <span>imageUrl is required</span>
                    )}
                  </span>

                  <div className="formInput">
                    <label>STATE</label>
                    <input
                      type="text"
                      placeholder="ENETR  STATE"
                      {...register("state", {
                        required: true,
                      })}
                    />
                    <span style={{ color: "red" }} className="text-danger">
                      {errors.state?.type === "required" && (
                        <span>STATE is required</span>
                      )}
                    </span>
                  </div>
                  <div className="formInput">
                    <label>NAME</label>
                    <input
                      type="text"
                      placeholder="ENTER THEATER NAME"
                      {...register("theatername", {
                        required: true,
                      })}
                    />
                    <span style={{ color: "red" }} className="text-danger">
                      {errors.theatername?.type === "required" && (
                        <span>THEATER Name is required</span>
                      )}
                    </span>
                  </div>
                  <div className="formInput">
                    <label>PLACE</label>
                    <input
                      type="text"
                      placeholder="ENETR THEATERB PLACE"
                      {...register("place", {
                        required: true,
                        pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
                      })}
                    />
                    <span style={{ color: "red" }} className="text-danger">
                      {errors.place?.type === "required" && (
                        <span>PLACE is required</span>
                      )}
                      {errors.place?.type === "pattern" && (
                        <span>Should not have spaces</span>
                      )}
                    </span>
                  </div>
                  <div className="formInput">
                    <label>CITY</label>
                    <input
                      type="text"
                      placeholder="ENTER CITY "
                      {...register("city", {
                        required: true,
                        pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
                      })}
                    />
                    <span style={{ color: "red" }} className="text-danger">
                      {errors.city?.type === "required" && (
                        <span>CITY is required</span>
                      )}
                      {errors.city?.type === "pattern" && (
                        <span>Should not have spaces</span>
                      )}
                    </span>
                  </div>

                  <div className="formInput">
                    <label>DISCRIPTION</label>
                    <input
                      type="text"
                      placeholder="ENTER DISCRIPTION"
                      {...register("discription", {
                        required: true,
                        pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
                      })}
                    />
                    <span style={{ color: "red" }} className="text-danger">
                      {errors.discription?.type === "required" && (
                        <span>DISCRIPTION is required</span>
                      )}
                      {errors.discription?.type === "pattern" && (
                        <span>Should not have spaces</span>
                      )}
                    </span>
                  </div>

                  <button type="submit">SAVE</button>
                </form>
              </div>
              <ToastContainer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default New;
