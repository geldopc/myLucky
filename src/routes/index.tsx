import { Home } from "@pages/Home";
import { AppLayout } from "@templates/AppLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [{ index: true, element: <Home /> }],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
