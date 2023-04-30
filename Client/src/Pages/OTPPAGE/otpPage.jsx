import { useState } from "react";
import axios from "../../utils/axios";
import styles from "./styles.module.scss";
import { setUser } from "../../Redux/store";
import { setToken } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate } from "react-router-dom";
import OTPInput from "otp-input-react";
import { ToastContainer, toast } from "react-toastify";
import { otplogin } from "../../utils/Constants";


const OtpPage = () => {

  const navigate = useNavigate();
  const [typeOtp, setTypeOtp] = useState("");
  const dispatch = useDispatch();
  const otp = useSelector((state) => state.otp);
  const tempemail = useSelector((state) => state.tempemail);



 
  const handleLogin = async (e) => {
    e.preventDefault();
    if (otp == typeOtp) {
      const { data } = await axios.post(`${otplogin}/${tempemail}`);
      dispatch(setUser({ user: data.user }));
      dispatch(setToken({ token: data.token }));
      setTimeout(() => {
        navigate("/");
      }, 2000);
      toast.success("OTP Login successful!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };


  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleLogin}>
            <h1>Login with Otp</h1>
            <OTPInput
              value={typeOtp}
              onChange={setTypeOtp}
              autoFocus
              OTPLength={6}
              otpType="number"
              disabled={false}
            />
            <button type="submit" className={styles.green_btn}>
              Login
            </button>
          </form>
        </div>
        <div className={styles.right}></div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OtpPage;
