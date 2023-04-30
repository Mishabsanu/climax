import "./list.scss";
import axios from "../../utils/axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";


const PosterList = (props) => {

  const theater = props.theater;

 
  const [file, setFile] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="new">
      <div className="newContainer">
        <div className="bottoms">
            <img  src={theater?.application?.imageUrl} alt="application" />
          <div className="right">
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterList;


   