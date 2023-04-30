import { useState } from "react";
import axios from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { googleSignup, loginPost } from "../../utils/Constants";
import { setLogin } from "../../Redux/store";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import React from "react";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { useEffect } from "react";

const validate = (values) => {
  const errors = {};

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
const Login = () => {
  const navigate = useNavigate();

 
  async function handleCallbackResponse(response) {


    const userObject = jwt_decode(response.credential);


    if (userObject && userObject.email && userObject.email_verified) {
      const { goog } = await axios.post(googleSignup, {
          email: userObject.email,
        }).then((response) => {
         
          dispatch(setLogin({ user: response.data.user, token: response.data.token }));
		  google.accounts.id.prompt();
		  setTimeout(() => {
			navigate("/");
		  }, 2000);
        })
        .catch((error) => {
          setError(error.response.data.message);
        
        });
    }
  }
  React.useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "971097628560-26uun738hpuq45o29ebslj7abnhu06p5.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signdiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const url = loginPost;
        const { data } = await axios.post(url, values);
        dispatch(setLogin({ user: data.user, token: data.token }));
        setTimeout(() => {
          navigate("/");
        }, 2000);

        toast.success("Login successful!", {
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

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <Toaster position="top-center" reverseOrder={false}></Toaster>
        <div className={styles.left}>
          <form
            method="POST"
            className={styles.form_container}
            onSubmit={formik.handleSubmit}
          >
            <h1>
              LOGIN TO CLI <span style={{ color: "red" }}>MAX</span>
            </h1>
            <br />
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
              Login
            </button>
          </form>
          <div style={{ paddingTop: "10px" }} id="signdiv"></div>
          <ToastContainer />
          <span className={styles.signupSpan}>
            Don't have an account? <Link to="/signup">Signup</Link>
          </span>
        </div>
        <div className={styles.right}>
          <h1>New Here ?</h1>
          <div>
            <Link to="/otpLogin">
              <button className={styles.green_btn}>OT P Login</button>
            </Link>
          </div>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              SIGNUP
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
