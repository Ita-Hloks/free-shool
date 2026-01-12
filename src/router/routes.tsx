import type { RouteObject } from "react-router-dom";
import Home from "../pages/Home.tsx";
import LaunchLeaveApplication from "../pages/LaunchLeaveApplication.tsx";
import LeaveApplicationDetail from "../pages/leaveApplicationDetail.tsx";
import NotFound from "../pages/NotFound.tsx";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/launchLeaveApplication",
    element: <LaunchLeaveApplication />,
  },
  {
    path: "/leaveDetail/:id",
    element: <LeaveApplicationDetail />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
