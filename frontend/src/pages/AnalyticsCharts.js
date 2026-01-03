import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import "./../styles/AnalyticsCharts.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const AnalyticsCharts = () => {
  const eventData = {
    labels: ["Completed", "Ongoing", "Upcoming"],
    datasets: [
      {
        data: [12, 6, 9],
        backgroundColor: ["#22c55e", "#eab308", "#3b82f6"]
      }
    ]
  };

  const organizerData = {
    labels: ["Organizer A", "Organizer B", "Organizer C"],
    datasets: [
      {
        label: "Events Created",
        data: [5, 8, 3],
        backgroundColor: "#6366f1"
      }
    ]
  };

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">Reports & Analytics</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h4>Event Status Overview</h4>
          <div className="chart-wrapper">
            <Pie data={eventData} />
          </div>
        </div>

        <div className="analytics-card">
          <h4>Organizer Activity</h4>
          <div className="chart-wrapper">
            <Bar data={organizerData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
