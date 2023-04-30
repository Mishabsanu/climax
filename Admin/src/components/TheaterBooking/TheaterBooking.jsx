import "./TheaterBooking.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getAllTheaters } from "../../utils/Constants";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../utils/axios";
import { useCallback } from "react";
import Button from "@mui/material/Button";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const TheaterBooking = () => {
  const [info, setInfo] = useState({ docs: [] });
  const [page, setPage] = useState(1);
  const token = useSelector((state) => state.token);
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  useEffect(() => {
    heelo();
  }, [page]);

  var heelo = useCallback(() => {
    axios
      .get(`${getAllTheaters}?page=${page}`, {
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

  return (
    <>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">NO</TableCell>
              <TableCell className="tableCell">THEATER OWNER NAME</TableCell>
              <TableCell className="tableCell">THEATER NAME</TableCell>

              <TableCell className="tableCell">SCEEN INFO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {info ? (
              info.docs?.map((info, index) => (
                <TableRow key={info.id}>
                  <TableCell className="tableCell">{index + 1}</TableCell>
                  <TableCell className="tableCell">{info.Name}</TableCell>
                  <TableCell className="tableCell">
                    {info.application.theatername}
                  </TableCell>
                  {info.screen.map((screen, index) => (
                    <TableRow key={index}>
                      <TableCell className="tableCell" key={index}>
                        {screen.screenname}
                      </TableCell>
                      <TableCell className="tableCell" key={index}>
                        {screen.show &&
                          screen.show.map((show, index) => (
                            <TableCell className="tableCell" key={index}>
                              MOVIE NAME : {show.moviename}
                              <br />
                              TIME :{" "}
                              {show.time.map((t, index) => (
                                <div key={index}> {t}</div>
                              ))}
                              <div>PRICE : {show.ticketPrice}</div>
                            </TableCell>
                          ))}
                      </TableCell>
                    </TableRow>
                  ))}
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

export default TheaterBooking;
