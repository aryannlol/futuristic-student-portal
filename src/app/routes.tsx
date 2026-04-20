import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Gateway } from "./components/screens/Gateway";
import { Dashboard } from "./components/screens/Dashboard";
import { Discover } from "./components/screens/Discover";
import { CourseDetails } from "./components/screens/CourseDetails";
import { Submissions } from "./components/screens/Submissions";
import { Profile } from "./components/screens/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Gateway,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "discover",
        Component: Discover,
      },
      {
        path: "course/:id",
        Component: CourseDetails,
      },
      {
        path: "submissions",
        Component: Submissions,
      },
      {
        path: "profile",
        Component: Profile,
      },
    ],
  },
]);
