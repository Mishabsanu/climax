import "./ViewList.scss";
import { getOneTheater } from "../../utils/Constants";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../utils/axios";
import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { toast, ToastContainer } from "react-toastify";

const TheaterTable = () => {
  const { id: theaterId } = useParams();
  const [info, setInfo] = useState();

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  useEffect(() => {
    heelo();
  }, [heelo]);

  var heelo = useCallback(() => {
    axios
      .get(`${getOneTheater}/${theaterId}`)
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
    <div className="single">
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div style={{ color: "red" }}>
              <Link style={{ textDecoration: "none", color: "green" }} to="#">
                <EditOutlinedIcon />

                <h1 className="title">EDIT PROFILE</h1>
              </Link>
            </div>
            <div className="item">
              <img
                src={info?.application?.imageUrl}
                alt=""
                className="itemImg"
              />

              <div className="details">
                <h1 className="itemTitle">{info?.Name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Theatername:</span>
                  <span className="itemValue">
                    {info?.application?.theatername}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email: </span>
                  <span className="itemValue">{info?.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{info?.phone}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Place:</span>
                  <span className="itemValue">{info?.application?.place}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">City:</span>
                  <span className="itemValue">{info?.application?.city}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">STATE:</span>
                  <span className="itemValue">{info?.application?.state}</span>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default TheaterTable;
