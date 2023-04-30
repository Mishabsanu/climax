import React, { useState } from "react";
import "./profileEdit.scss";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Navbar/Navbar";
import { setUser } from "../../Redux/store";
import { profileEditPost } from "../../utils/Constants";

const Profileedit = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const userId = user._id;

  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone);
  const [place, setPlace] = useState(user.place);
  const [city, setCity] = useState(user.city);
  const [pincode, setPincode] = useState(user.pincode);
  const [address, setAddress] = useState(user.address);
  const [email, setEmail] = useState(user.email);
  const [status, setStatus] = useState();

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
    if (file && acceptedFileTypes.includes(file.type) && file.size <= maxFileSize) {
      setImageSelected(file);
      setErrorMessage("");
    } else {
      setImageSelected("");
      setErrorMessage(`Please select an image of type ${acceptedFileTypes.join(", ")} and size up to ${maxFileSize / 1000000} MB`);
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
      const application = {
        username: data.username,
        phone: data.phone,
        place: data.place,
        city: data.city,
        pincode: data.pincode,
        imageUrl: imageUrl,
        address: data.address,
        email: data.email,
      };
      const res = await axios.post(
        `${profileEditPost}`,
        { application, userId },{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      dispatch(setUser({ user: res.data.update }));
      toast.success("Edit successful!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/profile");
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
      <Navbar />
      <div className="newContainer">
        <div className="bottom">
          <div className="left">
            <img
              src={
                imageSelected
                  ? URL.createObjectURL(imageSelected)
                  : user.imageUrl
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
                  type="file"
                  id="file"
                  onChange={onImageSelect}
                  accept={acceptedFileTypes.join(",")}
                  style={{ display: "none" }}
                />
                {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
              </div>
              <div className="formInput">
                <label>NAME</label>
                <input
                  type="text"
                  placeholder="ENETR NAME"
                  defaultValue={user.username}
                  onChange={(event) => setUsername(event.target.value)}
                  {...register("username")}
                />
              </div>
              <div className="formInput">
                <label>EMAIL</label>
                <input
                  type="text"
                  defaultValue={user.email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ENTER EMAIL"
                  {...register("email")}
                />
              </div>
              <div className="formInput">
                <label>ADDRESS</label>
                <input
                  type="text"
                  defaultValue={user.address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="ENETR ADDRESS "
                  {...register("address", {})}
                />
              </div>
              <div className="formInput">
                <label>CITY</label>
                <input
                  type="text"
                  defaultValue={user.city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="ENTER COUNRTY "
                  {...register("city")}
                />
              </div>
              <div className="formInput">
                <label>PLACE</label>
                <input
                  type="text"
                  defaultValue={user.place}
                  onChange={(event) => setPlace(event.target.value)}
                  placeholder="ENTER PLACE "
                  {...register("place")}
                />
              </div>
              <div className="formInput">
                <label>PHONE</label>
                <input
                  type="number"
                  defaultValue={user.phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="ENTER PHONE"
                  {...register("phone")}
                />
              </div>
              <div className="formInput">
                <label>PIN CODE</label>
                <input
                  type="number"
                  defaultValue={user.pincode}
                  onChange={(event) => setPincode(event.target.value)}
                  placeholder="ENTER PIN CODE "
                  {...register("pincode")}
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

export default Profileedit;
