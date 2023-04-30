import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import {
  Userblock,
  Userunblock,
  getUsers,
  searchUser,
} from "../../utils/Constants";
import Button from "@mui/material/Button";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useSelector } from "react-redux";
import socket from "../../socket.io/socket";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

const List = () => {
  const [users, setUsers] = useState({ docs: [] });
  const [page, setPage] = useState(1);
  const token = useSelector((state) => state.token);
  const searchBy = (e) => {
    let key = e.target.value;
    if (!key) {
      getUsersList();
    } else {
      axios
        .get(`${searchUser}/${key}`)
        .then((response) => {
          setUsers(response.data.users);
        })
        .catch((error) => {
          if (error.response) {
            generateError(error.response.data.message);
          } else {
            generateError("Network error. Please try again later.");
          }
        });
    }
  };

  const navigate = useNavigate();

  useEffect(
    (key) => {
      getUsersList();
    },
    [page]
  );
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  const getUsersList = () => {
    try {
      axios
        .get(`${getUsers}?page=${page}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data.user);
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
  };

  const [state, setState] = useState([]);

  useEffect(() => {
    axios.get(getUsers).then((response) => {
      setState(response.data);
    });
  }, [state]);

  const blockStaff = (id) => {
    axios
      .patch(
        `${Userblock}/${id}?page=${page}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((respose) => {
        setUsers(respose.data);
        console.log(respose, "blocccccekd");

        const socketData = {
          fromSocket: true,
          receiverId: id,
          type: "blocked",
          blocked: true,
        };
        socket.emit("setBlocked", socketData);
      })
      .then(() => {
        navigate(window.location.pathname, { replace: true });
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };

  const unblockStaff = (id) => {
    axios
      .patch(
        `${Userunblock}/${id}?page=${page}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((respose) => {
        setUsers(respose.data);
        console.log(respose, "unbnnnnnnblocccccekd");
      })
      .then(() => {
        navigate(window.location.pathname, { replace: true });
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
      <div className="search">
        <input
          type="text"
          name="query"
          placeholder="Search..."
          onChange={searchBy}
        />
        <span className="search-icon">
          <SearchOutlinedIcon />
        </span>
      </div>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">No</TableCell>
              <TableCell className="tableCell">Name</TableCell>
              <TableCell className="tableCell">Email ID</TableCell>
              <TableCell className="tableCell">Phone</TableCell>
              <TableCell className="tableCell">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.docs?.map((obj, index) => (
              <TableRow key={index + 1}>
                <TableCell className="tableCell">{index + 1}</TableCell>
                <TableCell className="tableCell">{obj.username}</TableCell>
                <TableCell className="tableCell">{obj.email}</TableCell>
                <TableCell className="tableCell">{obj.phone}</TableCell>
                <TableCell align="left">
                  {obj?.Block === true ? (
                    <Button
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, block it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            unblockStaff(obj._id);
                          }
                        });
                      }}
                      variant="outlined"
                      color="success"
                    >
                      UNBLOCK
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, block it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            blockStaff(obj._id);
                          }
                        });
                      }}
                      variant="outlined"
                      color="error"
                    >
                      BLOCK
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ToastContainer />
      </TableContainer>
      <br />

      <span>
        {users?.hasPrevPage && (
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
        {users?.hasNextPage && (
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

export default List;
