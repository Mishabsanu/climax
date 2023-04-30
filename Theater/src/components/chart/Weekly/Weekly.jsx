import "./chart.scss";
import { useState } from "react";
import axios from "../../../utils/axios";
import { useSelector } from "react-redux";
import { ResponsiveContainer } from "recharts";
import LineChart from "react-apexcharts";
import { useEffect } from "react";
import { useCallback } from "react";
import { getReservation } from "../../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";

const Weekly = ({ aspect, title }) => {
  const token = useSelector((state) => state.token);
  const theater = useSelector((state) => state.theater);
  const theaterId = theater?._id;

  const [week, setWeek] = useState();
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  useEffect(() => {
    heelo();
  }, [heelo]);

  var heelo = useCallback(() => {
    try {
      axios
        .get(`${getReservation}/${theaterId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setWeek(response.data);
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
  });
  const daysOfWeek = week?.map((dailyRevenue) => {
    const date = new Date(dailyRevenue._id);
    const formattedDate = date.toLocaleDateString("en-US", { weekday: "long" });
    return formattedDate;
  });

  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: daysOfWeek,
    },
  };
  const count = week?.map((dailyRevenue) => dailyRevenue.count);
  const series = [
    {
      name: `Weekly Revenue Booking   :${count}`,
      data: week?.map((dailyRevenue) => dailyRevenue.totalRevenue),
    },
  ];

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <LineChart options={options} series={series} type="bar" width="500" />
      </ResponsiveContainer>
      <ToastContainer />
    </div>
  );
};

export default Weekly;
