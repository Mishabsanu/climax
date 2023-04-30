import "./chart.scss";
import React, { useCallback, useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import LineChart from "react-apexcharts";
import axios from "../../../utils/axios";
import { getDailyRevenue } from "../../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const Weekly = ({ aspect, title }) => {
  const token = useSelector((state) => state.token);
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const [daily, setDaily] = useState([]);
  useEffect(() => {
    heelo();
  }, [heelo]);

  var heelo = useCallback(() => {
    axios
      .get(getDailyRevenue, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDaily(response.data);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  });

  const daysOfWeek = daily?.map((dailyRevenue) => {
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
  const series = [
    {
      name: "Weekly evenue",
      data: daily?.map((dailyRevenue) => dailyRevenue.totalRevenue),
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
