import "./screen.scss";
import PosterList from "../../components/list/list";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/system";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "../../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { deleteShowInfo, getscreen } from "../../utils/Constants";
import { setTheater } from "../../Redux/store";

import Swal from "sweetalert2";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Screen = () => {
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theaterId = useSelector((state) => state.theater);
  const [theater, setTheaters] = useState();

  const getTheater = async () => {
    const theaterID = theaterId._id;
    const response = await axios.get(
      `${getscreen}/${theaterID}`,
      { theaterID: theaterID },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTheaters(response.data.screeninfo);
  };

  useEffect(() => {
    getTheater();
  }, []);
  const handleDelete = (screenname, theaterID) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete screen information!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${deleteShowInfo}/${screenname}/${theaterID}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setTheaters(response.data);
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            navigate("/screen");
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
          <h1>SCREEN</h1>
        </div>
        <Box sx={{ flexGrow: 2, paddingLeft: "50px" }}>
          <Stack spacing={10} direction="row">
            <Link style={{ textDecoration: "none" }} to="/addscreens">
              <Button variant="contained">ADD SCREEN</Button>
            </Link>
          </Stack>
        </Box>

        <PosterList theater={theater} />

        {theater
          ? theater.screen.map((movie) => {
              return (
                <Box sx={{ flexGrow: 1 }}>
                  <div className="top">
                    <h1>{movie.screenname}</h1>
                  </div>
                  {movie.show?.length ? (
                    <Grid
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      style={{ paddingLeft: "10px" }}
                    >
                      <Grid item xs={2} sm={2} md={2}>
                        <Item
                          style={{ backgroundColor: "wheat", color: "black" }}
                        >
                          {/* {movie.show[0].moviename} */}
                          {movie && movie.show && movie.show[0]
                            ? movie.show[0].moviename
                            : ""}
                        </Item>
                      </Grid>

                      <Grid item xs={0.5} sm={0.7} md={0.7}>
                        <Link to={`/editSreenShow/${movie.screenname}`}>
                          <Item
                            style={{ backgroundColor: "wheat", color: "green" }}
                          >
                            <EditIcon />
                          </Item>
                        </Link>
                      </Grid>
                      <Grid item xs={0.5} sm={0.7} md={0.7}>
                        <Item
                          style={{ backgroundColor: "wheat", color: "red" }}
                        >
                          <DeleteIcon
                            onClick={() =>
                              handleDelete(movie.screenname, theater._id)
                            }
                          />
                        </Item>
                      </Grid>
                      {movie.show[0].time &&
                        Array.isArray(movie.show[0].time) &&
                        movie.show[0].time.map((time, index) => (
                          <Grid key={index} item xs={1.5} sm={1.5} md={1.5}>
                            <Item
                              style={{
                                backgroundColor: "wheat",
                                color: "black",
                              }}
                            >
                              {time}
                            </Item>
                          </Grid>
                        ))}
                    </Grid>
                  ) : null}
                </Box>
              );
            })
          : ""}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Screen;
