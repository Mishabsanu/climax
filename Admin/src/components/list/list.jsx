import "./list.scss";
import { deletePoster, getAllPoster } from "../../utils/Constants";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../utils/axios";
import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
const PosterList = (props) => {
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const navigate = useNavigate();
  const [poster, getPoster] = useState([]);
  const token = useSelector((state) => state.token);
  useEffect(() => {
    const getAllPosters = () => {
      axios
        .get(getAllPoster, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response, "res");
          getPoster(response.data);
        })
        .catch((error) => {
          if (error.response) {
            generateError(error.response.data.message);
          } else {
            generateError("Network error. Please try again later.");
          }
        });
    };
    getAllPosters();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Poster!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${deletePoster}/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              console.log(response.data, "resopodddddddddd");
              navigate(window.location.pathname, { replace: true });
              Swal.fire("Deleted!", "Your Poster has been deleted.", "success");
              getPoster(response.data);
            })
            .catch((error) => {
              if (error.response) {
                generateError(error.response.data.message);
              } else {
                generateError("Network error. Please try again later.");
              }
            });
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
          <h1>POSTER LIST</h1>
        </div>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {poster?.map((pos, index) => {
            return (
              <Box
                key={index}
                sx={{
                  width: ["100%", "100%", "100%", "100%"], // responsive width, 4 cards per row
                  p: 2,
                  m: 2,
                }}
              >
                <Card xl={{ maxWidth: 1300 }}>
                  <CardMedia
                    sx={{ height: 500, width: 1250 }}
                    image={pos?.posterImageUrl}
                    title="green iguana"
                  />
                  <CardContent style={{ textAlign: "center" }}></CardContent>
                  <CardActions style={{ paddingLeft: "110px" }}>
                    <DeleteIcon
                      style={{ color: "red" }}
                      onClick={() => handleDelete(pos?._id)}
                    />
                  </CardActions>
                </Card>
                <ToastContainer />
              </Box>
            );
          })}
        </Box>
      </div>
    </div>
  );
};

export default PosterList;
