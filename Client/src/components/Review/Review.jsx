import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import axios from "../../utils/axios";
import { Modal } from "antd";
import { Backdrop, Fade, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextArea from "antd/es/input/TextArea";
import { addReview } from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
export default function ReviewForm({ open, setOpen, setsubmit }) {
  const [message, setMessage] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const user = useSelector((state) => state.user);
  const userEmail = user?.email;
  const token = useSelector((state) => state.token);
  let { id: movieId } = useParams();

  const handleClose = () => {
    setOpen(false);
  };

  const generateError = (error) =>
  toast.error(error, {
    position: "top-right",
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      
      axios.post(
        addReview,
        {
          message,
          rating,
          movieId,
          userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleClose();
      setMessage(null);
      setRating(0);
      setsubmit(true);
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

  
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        okButtonProps={{ disabled: true }}
        cancelButtonProps={{ disabled: true }}
        footer={null}
        header={null}
        closable={false}
      >
        <Fade in={open}>
          <div>
            <div style={{ textAlign: "center", position: "relative" }}>
              <h5 style={{ margin: 0, padding: 0, marginTop: 10 }}>
                How was the movies?
              </h5>
              <p style={{ margin: 0, padding: 0, fontSize: "24px" }}>
                {/* {movieInformation && movieInformation.movie.title} */}
              </p>
              <CloseIcon
                style={{
                  position: "absolute",
                  right: 10,
                  top: 0,
                  cursor: "pointer",
                }}
                onClick={handleClose}
              />
            </div>
            <hr />
            <div>
              <Typography id="discrete-slider" gutterBottom>
                How would you rate the movie?
              </Typography>
              <Rating
                // className={classes.rating}
                name="review-rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
              />
              <hr />
              <Typography id="discrete-slider" gutterBottom>
                Write something about movie
              </Typography>
              <hr />
              <form onSubmit={handleSubmit}>
                <label>
                  Message:
                  <TextArea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </label>
                <button
                  style={{
                    width: "80%",
                    margin: "30px",
                    height: 50,
                    fontSize: 18,
                    color: "white",
                    backgroundColor: "#FF1203",
                    borderRadius: 10,
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                  }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </Fade>
      </Modal>
      <ToastContainer />
    </>
  );
}
