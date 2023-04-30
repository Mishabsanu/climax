import "./TheaterTable.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  approveTheater,
  getAllTheater,
  getAllTheaters,
  rejectTheater,
} from "../../utils/Constants";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../utils/axios";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const TheaterTable = () => {
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const token = useSelector((state) => state.token);
  const [info, setInfo] = useState({ docs: [] });

  const [page, setPage] = useState(1);
  //pagenation

  useEffect(() => {
    heelo();
  }, [page]);

  var heelo = useCallback(() => {
    try {
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

  const [state, setState] = useState([]);
  useEffect(() => {
    axios
      .get(getAllTheater)
      .then((response) => {
        setState(response.data);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  }, []);

  const reject = (id) => {
    axios
      .patch(
        `${rejectTheater}/${id}?page=${page}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((respose) => {
        setInfo(respose.data);
        console.log(respose, "reject");
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };

  const approve = (id) => {
    axios
      .patch(
        `${approveTheater}/${id}?page=${page}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((respose) => {
        setInfo(respose.data);
        console.log(respose, "approve");
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };

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
              <TableCell className="tableCell">Owner</TableCell>
              <TableCell className="tableCell">View</TableCell>
              <TableCell className="tableCell">Approved Action</TableCell>
              <TableCell className="tableCell">Rejected Action</TableCell>
              <TableCell className="tableCell">STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {info ? (
              info.docs?.map((info, index) => (
                <TableRow key={info.id}>
                  <TableCell className="tableCell">{index + 1}</TableCell>
                  <TableCell className="tableCell">{info.Name}</TableCell>
                  <Link
                    to={`/view/${info._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <TableCell align="left">
                      <Button variant="outlined" color="primary">
                        View
                      </Button>
                    </TableCell>
                  </Link>
                  {info?.application ? (
                    <TableCell align="left">
                      <Button
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You want approve this application!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes,approve it!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              approve(info._id);
                            }
                          });
                        }}
                        variant="outlined"
                        color="success"
                      >
                        Approve
                      </Button>

                      <></>
                    </TableCell>
                  ) : null}
                  {info?.application ? (
                    <TableCell align="left">
                      <>
                        {
                          <Button
                            onClick={() => {
                              Swal.fire({
                                title: "Are you sure?",
                                text: "You want Reject this application!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes,Reject it!",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  reject(info._id);
                                }
                              });
                            }}
                            variant="outlined"
                            color="error"
                          >
                            Reject
                          </Button>
                        }
                      </>
                    </TableCell>
                  ) : null}
                  {info?.application ? (
                    <TableCell className="tableCell">
                      {info?.isApproved === true ? (
                        <Button variant="outlined" color="primary">
                          is Approved
                        </Button>
                      ) : (
                        <Button variant="outlined" color="error">
                          is Rejected
                        </Button>
                      )}
                    </TableCell>
                  ) : null}
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

export default TheaterTable;
