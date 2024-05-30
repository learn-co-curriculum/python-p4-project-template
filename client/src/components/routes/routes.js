import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";
import HomePage from "../components/HomePage";
import CreateFantasyTeamForm from "../CreateFantasyTeamForm";
import ErrorPage from "..components/ErrorPage";
import Teams from "./Teams";

export const router = createBrowserRouter([
    {
      // path: "/",
      element: <App />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          index: true,
          element: <HomePage />,
        },
        {
            path: "/Teams",
            element: <Teams />,
        },
        {
          path: "/CreateFantasyTeam",
          element: <CreateFantasyTeamForm />,
        }
      ],
    },
  ]);

  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<RouterProvider router={router}/>);