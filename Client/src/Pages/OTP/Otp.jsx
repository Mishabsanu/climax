import { useState } from "react";
import axios from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { loginOtp } from "../../utils/Constants";
import { ToastContainer, toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import React from "react";
import { setOtp, setTempemail } from "../../Redux/store";

const validate = (values) => {
  const errors = {};

  //email
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

const Otp = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const otp = useSelector((state) => state.otp);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const url = loginOtp;
        const { data: response } = await axios.post(
          loginOtp,
          values
        );
        dispatch(setOtp({ otp: response.otp }));
        dispatch(setTempemail({ tempemail: values.email }));
        setTimeout(() => {
          navigate("/otp", { email: values.email });
        }, 2000);
        toast.success("OTP sent successfully!", {
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
          <Toaster position="top-center" reverseOrder={false} />
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              LOGIN
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form
            className={styles.form_container}
            onSubmit={formik.handleSubmit}
          >
            <h1>Login with OTP</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              className={styles.input}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={styles.error_msg}>{formik.errors.email}</div>
            ) : null}
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Send
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Otp;
