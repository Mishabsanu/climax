import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import axios from "../../utils/axios";
import { useRef } from "react";
import { ReservationDetails } from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const SaleDetails = () => {
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const handlePrint = () => {
    window.print();
  };

  const tableRef = useRef(null);
  const [info, setInfo] = useState({ docs: [] });
  const [page, setPage] = useState(1);
  const token = useSelector((state) => state.token);
  useEffect(() => {
    heelo();
  }, [page]);

  var heelo = useCallback(() => {
    axios
      .get(`${ReservationDetails}?page=${page}`, {
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
  const nextPage = () => {
    setPage((pre) => pre + 1);
  };
  const prePage = () => {
    setPage((pre) => pre - 1);
  };

  const headers = [
    { label: "NO", key: "id" },
    { label: "USER NAME", key: "userName" },
    { label: "THEATER NAME", key: "theaterName" },
    { label: "MOVIE NAME", key: "movieName" },
    { label: "BOOKING ID", key: "_id" },
    { label: "TICKET PRICE", key: "ticketPrice" },
    { label: "TOTAL PRICE", key: "total" },
    { label: "SEAT", key: "seat" },
    { label: "START AT", key: "startAt" },
    { label: "SCREEN", key: "cinemaScreen" },
    { label: "BOOKED DATE", key: "total" },
    { label: "SHOW DATE", key: "showDate" },
    { label: "PAYMENT ID", key: "paymentId" },
  ];

  return (
    <>
      <div className="button-group" style={{ margin: "10px" }}>
        <span style={{ paddingLeft: "30px" }}>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Download PDF
          </Button>
        </span>
      </div>

      <TableContainer component={Paper} ref={tableRef} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">NO</TableCell>
              <TableCell className="tableCell">USER NAME</TableCell>
              <TableCell className="tableCell">THEATER NAME</TableCell>
              <TableCell className="tableCell">MOVIE NAME</TableCell>
              <TableCell className="tableCell">BOOKING ID</TableCell>
              <TableCell className="tableCell">TICKET PRICE</TableCell>
              <TableCell className="tableCell">TOTAL PRICE</TableCell>
              <TableCell className="tableCell">SEAT</TableCell>
              <TableCell className="tableCell">START AT </TableCell>
              <TableCell className="tableCell">SCREEN</TableCell>
              <TableCell className="tableCell">BOOKED DATE</TableCell>
              <TableCell className="tableCell">SHOW DATE</TableCell>
              <TableCell className="tableCell">PAYMENT ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {info ? (
              info.docs?.map((info, index) => (
                <TableRow key={info.id}>
                  <TableCell className="tableCell">{index + 1}</TableCell>
                  <TableCell className="tableCell">{info.userName}</TableCell>
                  <TableCell className="tableCell">
                    {info.theaterName}
                  </TableCell>
                  <TableCell className="tableCell">{info.movieName}</TableCell>
                  <TableCell className="tableCell">{info._id}</TableCell>
                  <TableCell className="tableCell">
                    {" "}
                    {info.ticketPrice} ₹{" "}
                  </TableCell>
                  <TableCell className="tableCell">{info.total} ₹</TableCell>
                  {info?.seats?.map((seat, i) => (
                    <TableRow key={i}>
                      <TableCell className="tableCell">{seat.seat}</TableCell>
                    </TableRow>
                  ))}
                  <TableCell className="tableCell">{info.startAt}</TableCell>
                  <TableCell className="tableCell">
                    {info.cinemaScreen}
                  </TableCell>
                  <TableCell className="tableCell">{info.startAt}</TableCell>
                  <TableCell className="tableCell">{info.showDate}</TableCell>
                  <TableCell className="tableCell">{info.paymentId}</TableCell>

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
      <br />

      <span>
        {info.hasPrevPage && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => prePage()}
          >
            PrePage
          </Button>
        )}
      </span>
      <span style={{ paddingLeft: "20px" }}>
        {info.hasNextPage && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => nextPage()}
          >
            NextPage
          </Button>
        )}
      </span>
    </>
  );
};

export default SaleDetails;
