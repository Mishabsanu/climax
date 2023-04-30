import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import Rating from "@mui/material/Rating";
import axios from "../../utils/axios";
import "./RivewCard.scss";
import { useSelector } from "react-redux";
import { deleteReview, getAllReview } from "../../utils/Constants";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import { toast, ToastContainer } from "react-toastify";
function ShowReview({ movieInfo, submit, movieReviews }) {
  const movie = movieInfo;
  const [review, setreview] = useState(movieReviews);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const getReview = async () => {
    try {
      const { data } = await axios.get(`${getAllReview}/${movie._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setreview(data);
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

  useEffect(() => {
    getReview();
  }, [submit]);

  useEffect(() => {
    setreview(movieReviews);
  }, [movieReviews]);

  const handleDelete = (date) => {
    axios
      .delete(`${deleteReview}/${movie._id}/${date}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setreview(response.data.updated);
      })
      .catch((error) => {
        if (error.response) {
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };

  const handleDeleteConfirmation = (date) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "black",
      color: "white",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(date);
        Swal.fire({
          title: "Deleted!",
          text: "Your review has been deleted.",
          icon: "success",
          background: "black",
          color: "white",
        });
      }
    });
  };

  useEffect(() => {
    handleDelete();
  }, []);

  return (
    <>
      {review?.map((item, index) => (
        <div className="reviewCardMain">
          <div className="review">
            <div className="right w-100">
              <div className="set1">
                <span className="name fs-3 font-weight-bold">
                  {item.userName ? item.userName : "gust user"}
                </span>
              </div>

              <div className="set2">
                rating
                <Rating
                  className="mt-3"
                  name="read-only"
                  value={parseInt(item?.rating)}
                  readOnly
                />
              </div>

              <div className="set3 ">
                <span className="reviewMessage fs-4">{item?.message}</span>
              </div>
              <p className="text-gray-500 text-sm text-left absolute bottom-0 right-5">
                {format(item?.date)}
              </p>
              <div className="set4 mt-3"></div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {item?.userName === user?.username && (
                  <span style={{ paddingLeft: "20px" }}>
                    <Button
                      onClick={() => handleDeleteConfirmation(item.date)}
                      variant="outlined"
                      color="error"
                    >
                      Remove
                    </Button>
                  </span>
                )}
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      ))}
    </>
  );
}

export default ShowReview;
