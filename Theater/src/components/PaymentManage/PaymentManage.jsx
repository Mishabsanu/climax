import "./PaymentManage.scss";
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


const PaymentManage = () => {
  const [info, setInfo] = useState([]);
  const token = useSelector((state) => state.token);
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const theater = useSelector((state) => state.theater);
  const theaterId = theater._id;
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
        console.log(response.data, "get theater Applocation");
        setInfo(response.data);
      })
      .catch((error) => {
        console.log(error);
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
              <TableCell className="tableCell">BOOKING ID</TableCell>
              <TableCell className="tableCell">Ticket Price</TableCell>
              <TableCell className="tableCell">MOVIE NAME</TableCell>
              <TableCell className="tableCell">TikectCount</TableCell>
              <TableCell className="tableCell">VIEW DETAILS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {info ? (
              info.map((info, index) => (
                <TableRow key={info.id}>
                  <TableCell className="tableCell">{index + 1}</TableCell>
                  <TableCell className="tableCell">{info._id}</TableCell>
                  <TableCell className="tableCell">
                    {info.ticketPrice} ₹
                  </TableCell>

                  <TableCell className="tableCell">{info.movieName}</TableCell>
                  <TableCell className="tableCell">
                    {info.TikectCount}
                  </TableCell>
                  <Link
                    to={`/Paymnetview/${info._id}`}
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

export default PaymentManage;
