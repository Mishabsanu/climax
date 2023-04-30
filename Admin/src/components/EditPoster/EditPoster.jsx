import "./EditPoster.scss";
import axios from "../../utils/axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PosterList from "../../components/list/list";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { editPoster, getAllPoster, PosterPost } from "../../utils/Constants";

const EditPoster = () => {
  const { id: posterId } = useParams();

  const [poster, getPoster] = useState([]);
  const [PosterUrl, setPosterUrl] = useState(poster[0]?.PosterUrl);
  const image = poster.map((t) => t.posterImageUrl);

  useEffect(() => {
    const getAllPosters = () => {
      try {
        axios
          .get(getAllPoster)
          .then((response) => {
            getPoster(response.data);
          })
          .catch((error) => {
            if (error.response) {
              generateError(error.response.data.message);
            } else {
              generateError("Network error. Please try again later.");
            }
          });
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          generateError(error.response.data.message);
        }
      }
    };
    getAllPosters();
  }, []);

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
            .post(PosterPost, datas)
            .then((response) => {
              // dispatch(setPosts({posts:response.data.savedPoster}))
              getPoster(response);

              toast.success(
                `Poster added Succsessfully`,
                { theme: "light" },
                { position: "top-right" }
              );
              navigate("/addPoster");
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
                src={imageSelected ? URL.createObjectURL(imageSelected) : image}
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
                    accept="image/jpeg, image/png"
                    type="file"
                    id="file"
                    onChange={(e) => setImageSelected(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  <span style={{ color: "red" }} className="text-danger">
                    {errors.imageUrl?.type === "required" && (
                      <span>imageUrl is required</span>
                    )}
                  </span>
                </div>
                <div className="formInput">
                  <label>Poster Url</label>
                  <input
                    type="text"
                    defaultValue={poster.map((t) => t.PosterUrl)}
                    onChange={(event) => setPosterUrl(event.target.value)}
                    className="form-control"
                    placeholder="url"
                    {...register("url")}
                    required
                  />
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

export default EditPoster;
