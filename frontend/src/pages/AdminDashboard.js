import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import AnalyticsCharts from "./AnalyticsCharts";
import "./../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    organizers: 0,
    events: 0,
    completed: 0,
    ongoing: 0,
    upcoming: 0,
    activeVolunteers: 0,
    participation: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const eventsSnap = await getDocs(collection(db, "events"));

      let users = 0, organizers = 0, activeVolunteers = 0;
      usersSnap.forEach(d => {
        if (d.data().role === "organizer") organizers++;
        else users++;
        if (d.data().active) activeVolunteers++;
      });

      let completed = 0, ongoing = 0, upcoming = 0, participation = 0;
      const now = new Date();

      eventsSnap.forEach(d => {
        const e = d.data();
        participation += e.registeredVolunteers?.length || 0;
        const start = e.startDate?.toDate();
        const end = e.endDate?.toDate();
        if (end < now) completed++;
        else if (start <= now) ongoing++;
        else upcoming++;
      });

      setStats({
        users,
        organizers,
        events: eventsSnap.size,
        completed,
        ongoing,
        upcoming,
        activeVolunteers,
        participation
      });
    };

    loadStats();
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* STATS */}
      <div className="stats-grid">
        {Object.entries(stats).map(([key, value]) => (
          <div className="stat-card" key={key}>
            <h3>{key.replace(/([A-Z])/g, " $1")}</h3>
            <p>{value}</p>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="admin-actions">
        <button onClick={() => navigate("/admin/users")}>Manage Users</button>
      </div>

      {/* CHARTS */}
      <AnalyticsCharts />
    </div>
  );
};

export default AdminDashboard;
