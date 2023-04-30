import "./ViewList.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getOneBookinDetails } from "../../utils/Constants";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../utils/axios";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";


const PaymentViewList = () => {
  const { id: bookingId } = useParams();
  const token = useSelector((state) => state.token);
  const [info, setInfo] = useState();



  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  useEffect(() => {
    heelo();
  }, [heelo]);

  var heelo = useCallback(() => {
    try {
      axios
        .get(`${getOneBookinDetails}/${bookingId}`, {
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
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        generateError(error.response.data.message);
      }
    }
  });

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">USER NAME</TableCell>
            <TableCell className="tableCell">MOVIE NAME</TableCell>
            <TableCell className="tableCell">BOOKING ID</TableCell>
            <TableCell className="tableCell">Tikect Count</TableCell>
            <TableCell className="tableCell">Sub Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {info ? (
            <TableRow key={info.id}>
              <TableCell className="tableCell">{info.userName}</TableCell>
              <TableCell className="tableCell">{info.movieName}</TableCell>
              <TableCell className="tableCell">{info._id}</TableCell>
              <TableCell className="tableCell">{info.TikectCount}</TableCell>
              <TableCell className="tableCell">{info.total} ₹</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
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
  );
};

export default PaymentViewList;
