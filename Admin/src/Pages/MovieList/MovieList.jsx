import "./MovieList.scss";
import axios from "../../utils/axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate } from "react-router-dom";
import { deleteMovie, getMovies } from "../../utils/Constants";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

const MovieList = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const [movies, getAllMovie] = useState([]);
  useEffect((key) => {
    getUsersList();
  }, []);

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  const getUsersList = () => {
    axios
      .get(getMovies, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllMovie(response.data);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Movie!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${deleteMovie}/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            getAllMovie(response.data);
            console.log("rsoppp ", response);
            navigate("/movieList");
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          })
          .catch((error) => {
            if (error.response) {
              generateError(error.response.data.message);
            } else {
              generateError("Network error. Please try again later.");
            }
          });
      }
    });
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>MOVIE LIST</h1>
        </div>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {movies.map((movie, index) => {
            return (
              <Box
                key={index}
                sx={{
                  width: ["100%", "50%", "33.33%", "25%"], // responsive width, 4 cards per row
                  p: 2,
                  m: 2,
                }}
              >
                <Card sx={{ maxWidth: 270 }}>
                  <CardMedia
                    sx={{ height: 300, width: 270 }}
                    image={movie.imageUrl}
                    title="green iguana"
                  />
                  <CardContent style={{ textAlign: "center" }}>
                    <h2>{movie.title}</h2>
                  </CardContent>
                  <CardActions style={{ paddingLeft: "110px" }}>
                    <Link>
                      <DeleteIcon
                        style={{ color: "red" }}
                        onClick={() => handleDelete(movie._id)}
                      />
                    </Link>
                    <Link to={`/editMovie/${movie._id}`}>
                      <EditIcon style={{ color: "green" }} />
                    </Link>
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

export default MovieList;
