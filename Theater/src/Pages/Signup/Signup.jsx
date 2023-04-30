
import { useState } from "react";
import axios from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { signUpPost } from "../../utils/Constants";
import { ToastContainer, toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import React from "react";

const validate = (values) => {
  const errors = {};
  //Name
  if (!values.Name) {
    errors.Name = toast.error("Name is required");
  } else if (values.Name.includes(" ")) {
    errors.Name = toast.error("Invalid Name");
  } else if (values.Name.length < 5) {
    errors.Name = toast.error("Name must contain five characters");
  } else if (
    /[0-9\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g.test(
      values.Name
    )
  ) {
    errors.Name = toast.error(
      " Name does not contain special characters "
    );
  }

  if (!values.password) {
    errors.password = toast.error("Password is required");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("wrong password");
  } else if (values.password.length < 8) {
    errors.password = toast.error("password atleast contain five characters");
  }
  if (!values.email) {
    errors.email = toast.error("Email is required");
  } 
  if (!values.phone) {
    errors.phone = toast.error("Phone is required");
  } 
  return errors;
};

const Signup = () => {
  const formik = useFormik({
    initialValues: {
      Name: "",
      email: "",
      password: "",
      phone: "",
    },
    validate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const url = signUpPost;
        const { values: res } = await axios.post(url, values);
        setTimeout(() => {
          navigate("/login");
        }, 2000);

        toast.success("Signup successful!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });

  
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setError(error.response.data.message);
        }
      }
    },
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Welcome Back</h1>
          <Toaster position="top-center" reverseOrder={false}></Toaster>

          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              LOGIN
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form
            method="POST"
            className={styles.form_container}
            onSubmit={formik.handleSubmit}
          >
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="User Name"
              name="Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Name}
              // onChange={handleChange}
              // value={data.username}

              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Phone"
              name="phone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              SIGNUP 
            </button>
          </form>
          <ToastContainer />
          <span className={styles.loginSpan}>
            Don't have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
