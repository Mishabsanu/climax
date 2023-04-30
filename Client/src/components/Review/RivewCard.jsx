import React, { useState } from "react";
import "./RivewCard.scss";
import Rating from "@mui/material/Rating";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import FlagIcon from "@mui/icons-material/Flag";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function ReviewCard({ review, currentUser, handleDeleteReview, movieDetails }) {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews);
  const token = useSelector((state) => state.token);
  const [replies, setReplies] = useState([]);
  const [showReply, setShowReply] = useState(false);

  const handleDelete = () => {
    handleDeleteReview(review.date);
  };
  const handleReplyToggle = () => {
    setShowReply((prev) => !prev);
  };

  return (
    <div className="reviewCardMain">
      <div className="review">
        <div className="left">
          <img src={review?.userId?.profilePicture} alt="" />
        </div>
        <div className="right w-100">
          <div className="set1">
            <span className="name fs-3 font-weight-bold">
              {review?.userId.name}
            </span>
          </div>
          <div className="set2">
            <span>@{review?.userId.username}</span>
            <Rating
              className="mt-3"
              name="read-only"
              value={parseInt(review?.rating)}
              readOnly
            />
          </div>
          <div className="set3 ">
            <span className="reviewMessage fs-4">{review?.reviewMessage}</span>
          </div>
          <div className="set4 mt-3">
            <Badge
              color="secondary"
              badgeContent={replies.length}
              showZero="false"
              style={{ zIndex: 5 }}
            >
              <CommentIcon onClick={handleReplyToggle} className="icons" />
            </Badge>
            {currentUser?._id == review?.userId._id.toString() ? (
              <DeleteIcon onClick={handleDelete} className="icons" />
            ) : (
              <FlagIcon className="icons" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
