import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { Toaster } from "react-hot-toast";
import { getMovie, movieEditPost } from "../../utils/Constants";
import { useSelector } from "react-redux";
const EditMovie = () => {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState(movies.title);
  const [description, setDescription] = useState(movies.description);
  const [genre, setGenre] = useState(movies.genre);
  const [director, setDirector] = useState(movies.director);
  const [releasedate, SetReleasedate] = useState(movies.releasedate);
  const [duration, SetDuration] = useState(movies.duration);
  const token = useSelector((state) => state.token);
  const { id: movieId } = useParams();

  useEffect(
    (key) => {
      getUsersList();
    },
    [movieId]
  );

  const getUsersList = () => {
    // getOneMovies = getOneMovies+`/${movieId}`
    axios
      .get(`${getMovie}/${movieId}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
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
    try {
      let imageUrl;

      if (imageSelected) {
        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "ml_default");
        reset();
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dwkom79iv/image/upload",
          formData,
          { withCredentials: false }
        );

        if (response.status !== 200) throw response.error.message;

        imageUrl = response.data.secure_url;
      }

      const datas = {
        title: data.title,
        description: data.description,
        genre: data.genre,
        director: data.director,
        duration: data.duration,
        imageUrl: imageUrl,
        releasedate: data.releasedate,
      };

      await axios.post(
        `${movieEditPost}/${movieId}`,
        { datas },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Edit successful!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/movieList");
      }, 2000);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      }
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <Toaster position="top-center" reverseOrder={false}></Toaster>
          <h1>EDIT MOVIE</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                imageSelected
                  ? URL.createObjectURL(imageSelected)
                  : movies.imageUrl
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
                  type="file"
                  id="file"
                  onChange={onImageSelect}
                  accept={acceptedFileTypes.join(",")}
                  style={{ display: "none" }}
                />
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </div>

              <div className="formInput">
                <label>Title</label>
                <input
                  type="text"
                  defaultValue={movies.title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="form-control"
                  placeholder="Title"
                  {...register("title")}
                  required
                />
              </div>
              <div className="formInput">
                <label>Discription</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Discription"
                  defaultValue={movies.description}
                  onChange={(event) => setDescription(event.target.value)}
                  {...register("description")}
                  required
                />
              </div>
              <div className="formInput">
                <label>Genre</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={movies.genre}
                  onChange={(event) => setGenre(event.target.value)}
                  placeholder="Genre"
                  {...register("genre")}
                  required
                />
              </div>
              <div className="formInput">
                <label>Director</label>
                <input
                  type="text"
                  defaultValue={movies.director}
                  onChange={(event) => setDirector(event.target.value)}
                  className="form-control"
                  placeholder="Director"
                  {...register("director")}
                  required
                />
              </div>
              <div className="formInput">
                <label>Duration</label>
                <input
                  type="text"
                  defaultValue={movies.duration}
                  onChange={(event) => SetDuration(event.target.value)}
                  className="form-control"
                  placeholder="Duration"
                  {...register("duration")}
                  required
                />
              </div>
              <div className="formInput">
                <label>Release Date</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={movies.releasedate}
                  onChange={(event) => SetReleasedate(event.target.value)}
                  placeholder="Date"
                  {...register("releasedate")}
                  required
                />
              </div>
              <button type="submit">SAVE</button>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMovie;
