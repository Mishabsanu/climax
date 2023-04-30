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
  //username
  if (!values.username) {
    errors.username = toast.error("Username is required");
  } else if (values.username.includes(" ")) {
    errors.username = toast.error("Invalid username");
  } else if (values.username.length < 5) {
    errors.username = toast.error("username must contain five characters");
  } else if (
    /[0-9\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g.test(
      values.username
    )
  ) {
    errors.username = toast.error(
      " username does not contain special characters "
    );
  }

  //email
  if (!values.email) {
    errors.email = toast.error("email is requried");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = toast.error("invalid email address");
  }

  //password
  if (!values.password) {
    errors.password = toast.error("password is required");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("wrong password");
  } else if (values.password.length < 8) {
    errors.password = toast.error("password atleast contain five characters");
  }

  return errors;
};

const Signup = () => {

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
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
            <h1>
              CREATE <span style={{ color: "red" }}>ACCOUNT</span>
            </h1>
            <br />
            <input
              type="text"
              placeholder="User Name"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
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
              Sing Up
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
