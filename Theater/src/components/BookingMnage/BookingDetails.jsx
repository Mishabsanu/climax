import "./BookingDetails.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { ReservationDetailsOneTheater } from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";

const BookingDetails = () => {
  const token = useSelector((state) => state.token);
  const [info, setInfo] = useState([]);
  const theater = useSelector((state) => state.theater);
  const theaterId = theater._id;

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  useEffect(() => {
    heelo();
  }, []);

  var heelo = useCallback(() => {
    axios
      .get(`${ReservationDetailsOneTheater}/${theaterId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      .then((response) => {
        setInfo(response.data);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  });

  return (
    <>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">NO</TableCell>
              <TableCell className="tableCell">USER NAME</TableCell>
              <TableCell className="tableCell">MOVIE NAME</TableCell>
              <TableCell className="tableCell">BOOKING ID</TableCell>
              <TableCell className="tableCell">VIEW DETAILS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {info ? (
              info.map((info, index) => (
                <TableRow key={info.id}>
                  <TableCell className="tableCell">{index + 1}</TableCell>
                  <TableCell className="tableCell">{info.userName}</TableCell>
                  <TableCell className="tableCell">{info.movieName}</TableCell>
                  <TableCell className="tableCell">{info._id}</TableCell>

                  <Link
                    to={`/Bookingview/${info._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <TableCell align="left">
                      <Button variant="contained" color="success">
                        View
                      </Button>
                    </TableCell>
                  </Link>
                  <TableCell align="left"></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="tableCell">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ToastContainer />
      </TableContainer>
    </>
  );
};

export default BookingDetails;
