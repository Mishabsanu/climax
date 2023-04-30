import { useState } from "react";
import axios from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { loginPost } from "../../utils/Constants";
import { setLogin } from "../../Redux/store";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = toast.error("email is required");
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
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const navigate = useNavigate();
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
        dispatch(setLogin({ theater: data.theater, token: data.token }));
		navigate("/");
  
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
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={formik.handleSubmit} >
            <h1>Login to Mizu!</h1>
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
          <span className={styles.signupSpan}>
            Don't have an account? <Link to="/signup">Signup</Link>
          </span>
        </div>
        <div className={styles.right}>
		<Toaster position="top-center" reverseOrder={false}></Toaster>
          <h1>New Here ?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sing Up
            </button>
          </Link>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
