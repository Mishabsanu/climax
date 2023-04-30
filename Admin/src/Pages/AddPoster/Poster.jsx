import "./Poster.scss";
import axios from "../../utils/axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { PosterPost } from "../../utils/Constants";


const Poster = () => {
  const [post, setPost] = useState([]);
  console.log(post,'hhhhhh');
  const dispatch = useDispatch();
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
            PosterImageUrl: imageUrl,
            PosterUrl: data.url,
          };
          await axios
            .post(PosterPost, datas,{
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setPost(response.data);

              toast.success(
                `Poster added Succsessfully`,
                { theme: "light" },
                { position: "top-right" }
              );
              navigate("/listPoster");
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
      });
  };

  return (
    <>
      <div className="new">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <div className="top">
            <h1>ADD POSTER</h1>
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

                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                </div>
                <div className="formInput">
                  <label>Poster Url</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="url"
                    {...register("url", {
                      required: true,
                    })}
                  />
                  <span style={{ color: "red" }} className="text-danger">
                    {errors.url?.type === "required" && (
                      <span>url is required</span>
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
    </>
  );
};

export default Poster;
