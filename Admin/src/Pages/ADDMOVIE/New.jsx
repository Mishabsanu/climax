import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { MoviesPost } from "../../utils/Constants";
import { useSelector } from "react-redux";

const New = () => {
  const token = useSelector((state) => state.token);

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

          const datas = {
            title: data.title,
            description: data.description,
            genre: data.genre,
            director: data.director,
            duration: data.duration,
            imageUrl: imageUrl,
            releasedate: data.releasedate,
          };
          await axios
            .post(MoviesPost, datas, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              toast.error(
                `Movie Already  Exist`,
                { theme: "light" },
                { position: "top-right" }
              );

              toast.success(
                `Movie added Succsessfully`,
                { theme: "light" },
                { position: "top-right" }
              );
              navigate("/movieList");
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
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>ADD MOVIE</h1>
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
                  Movie poster:{" "}
                  <DriveFolderUploadOutlinedIcon className="icon" />
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
              <div className="formInput">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  {...register("title", {
                    required: true,
                    maxLength: 10,
                    pattern: /^[^\s\d]+(?:$|.*[^\s]+$)/,
                  })}
                />
                <span style={{ color: "red" }} className="text-danger">
                  {errors.title?.type === "required" && (
                    <span style={{ color: "red" }}>Title is required</span>
                  )}
                  {errors.title?.type === "maxLength" && (
                    <span style={{ color: "red" }}>
                      Title must less than 10 Character
                    </span>
                  )}
                  {errors.title?.type === "pattern" && (
                    <span style={{ color: "red" }}>
                      Title accept alphabetic characters
                    </span>
                  )}
                </span>
              </div>
              <div className="formInput">
                <label>description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Discription"
                  {...register("description", {
                    required: true,
                    maxLength: 50,
                    pattern: /^[^\s\d]+(?:$|.*[^\s]+$)/,
                  })}
                />
                <span style={{ color: "red" }} className="text-danger">
                  {errors.description?.type === "required" && (
                    <span style={{ color: "red" }}>
                      Discription is required
                    </span>
                  )}
                  {errors.description?.type === "maxLength" && (
                    <span style={{ color: "red" }}>
                      Discription must less than 50 Character
                    </span>
                  )}
                  {errors.description?.type === "pattern" && (
                    <span style={{ color: "red" }}>
                      Discription accept alphabetic characters
                    </span>
                  )}
                </span>
              </div>
              <div className="formInput">
                <label>Genre</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Genre"
                  {...register("genre", {
                    required: true,
                    maxLength: 10,
                    pattern: /^[^\s\d]+(?:$|.*[^\s]+$)/,
                  })}
                />
                <span style={{ color: "red" }} className="text-danger">
                  {errors.genre?.type === "required" && (
                    <span style={{ color: "red" }}>Genre is required</span>
                  )}
                  {errors.genre?.type === "maxLength" && (
                    <span style={{ color: "red" }}>
                      Genre must less than 10 Character
                    </span>
                  )}
                  {errors.genre?.type === "pattern" && (
                    <span style={{ color: "red" }}>
                      Genre accept alphabetic characters
                    </span>
                  )}
                </span>
              </div>
              <div className="formInput">
                <label>Director</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Director"
                  {...register("director", {
                    required: true,
                  })}
                />
                <p style={{ color: "red" }} className="text-danger">
                  {errors.director?.type === "required" && (
                    <span>director name is required</span>
                  )}
                </p>
              </div>
              <div className="formInput">
                <label>Duration</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Duration"
                  {...register("duration", {
                    required: true,
                    maxLength: 8,
                  })}
                />
                <span style={{ color: "red" }} className="text-danger">
                  {errors.duration?.type === "required" && (
                    <span>duration is required</span>
                  )}
                  {errors.duration?.type === "maxLength" && (
                    <span style={{ color: "red" }}>
                      duration must less than 8 Character
                    </span>
                  )}
                </span>
              </div>
              <div className="formInput">
                <label>Release Date</label>
                <input
                  type="Date"
                  className="form-control"
                  placeholder="Date"
                  {...register("releasedate", {
                    required: true,
                  })}
                />
                <span style={{ color: "red" }} className="text-danger">
                  {errors.releasedate?.type === "required" && (
                    <span>releasedate feild is required</span>
                  )}
                </span>
              </div>
              <button type="submit">Send</button>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
