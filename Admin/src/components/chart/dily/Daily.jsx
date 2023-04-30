import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { ResponsiveContainer } from "recharts";
import { getOneDayRevenue } from "../../../utils/Constants";
const DailyRevenueGraph = ({ aspect, title }) => {
  const [daily, setDaily] = useState([]);
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const token = useSelector((state) => state.token);
  const date = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    axios
      .get(`${getOneDayRevenue}/${date}`, {
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
    const dailys = daily?.map((i) => i.count);
    const revenues = daily?.map((i) => i.revenue);
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
