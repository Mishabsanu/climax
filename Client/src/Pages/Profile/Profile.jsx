import Navbar from "../../components/Navbar/Navbar";
import React from "react";
import "./Profile.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
const Profile = () => {
  const user = useSelector((state) => state.user);

  return (
    <>
      <Navbar />
      <div className="single">
        <div className="singleContainer">
          <div className="top">
            <div className="left">
              <div style={{ color: "red" }}>
                <Link
                  style={{ textDecoration: "none", color: "green" }}
                  to="/editProfile"
                >
                  <EditOutlinedIcon />

                  <h1 className="title">EDIT PROFILE</h1>
                </Link>
              </div>
              <div className="item">
                <img src={user?.imageUrl} alt="" className="itemImg" />

                <div className="details">
                  <h1>Hello . . . .</h1>
                  <h1 className="itemTitle">{user?.username}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Email: </span>
                    <span className="itemValue">{user?.email}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Phone:</span>
                    <span className="itemValue">{user?.phone}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{user?.address}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">City:</span>
                    <span className="itemValue">{user?.city}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Place:</span>
                    <span className="itemValue">{user?.place}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Pin code:</span>
                    <span className="itemValue">{user?.pincode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
