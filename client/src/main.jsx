// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import store from "./redux/store";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import Createjob from "./pages/Createjob";
import JobDetails from "./pages/JobDetails";
import Userproject_details from "./pages/Userproject_details";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "profile", element: <Profile /> },
      { path: "jobs", element: <Jobs /> },
      { path: "create_job", element: <Createjob /> },
      { path: "jobdetails/:id", element: <JobDetails /> },
      { path: "project_details/:id", element: <Userproject_details /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
