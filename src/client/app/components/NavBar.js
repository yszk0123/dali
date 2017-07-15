import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <ul>
      <li>
        <Link to="/">Dashboard</Link>
      </li>
      <li>
        <Link to="/daily/schedule">DailySchedule</Link>
      </li>
      <li>
        <Link to="/daily/report">DailyReport</Link>
      </li>
      <li>
        <Link to="/projects">Projects</Link>
      </li>
      <li>
        <Link to="/taskSets">TaskSets</Link>
      </li>
      <li>
        <Link to="/options">Options</Link>
      </li>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
      <li>
        <Link to="/dailyReportTemplate">DailyReportTemplate</Link>
      </li>
    </ul>
  );
}
