import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import ReactApexChart from "react-apexcharts";

import { useSelector } from "react-redux";
import { ResponsiveContainer } from "recharts";
import { getOneTheaterDayRevenue } from "../../../utils/Constants";

import { toast, ToastContainer } from "react-toastify";
const DailyRevenueGraph = ({ aspect, title }) => {
  const [daily, setDaily] = useState([]);

  const theater = useSelector((state) => state.theater);
  const theaterId = theater?._id;
  const token = useSelector((state) => state.token);
  const date = new Date().toISOString().slice(0, 10);

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  useEffect(() => {
    try {
      axios
        .get(`${getOneTheaterDayRevenue}/${date}/${theaterId}`, {
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
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        generateError(error.response.data.message);
      }
    }
  }, []);

  const [chartData, setChartData] = useState({
    series: [1],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      title: {
        text: `Revenue for ${date} `,
        align: "center",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });
  useEffect(() => {
    const dailys = daily.map((i) => i.count);
    const revenues = daily.map((i) => i.revenue);
    setChartData({
      series: [revenues[0], dailys[0]],
      options: {
        chart: {
          width: 380,
          type: "pie",
        },
        title: {
          text: `Revenue for ${date} `,
          align: "center",
          style: {
            fontSize: "16px",
            fontWeight: "bold",
          },
        },
        labels: [`TODAY BOOKING:${dailys}`],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    });
  }, [daily]);

  return (
    <div className="chart">
      <div className="title">{title}</div>

      <ResponsiveContainer width="100%" aspect={aspect}>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          width={380}
        />
      </ResponsiveContainer>
      <ToastContainer />
    </div>
  );
};

export default DailyRevenueGraph;
