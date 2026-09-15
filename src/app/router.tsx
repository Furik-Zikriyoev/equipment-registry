import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "./AppLayout";
import { UnitsListPage } from "../features/units-list/UnitsListPage";
import { UnitFormPage } from "../features/unit-form/UnitFormPage";
import { NotFoundPage } from "../shared/ui/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Navigate to="/units" replace /> },
      { path: "/units", element: <UnitsListPage /> },
      { path: "/units/new", element: <UnitFormPage /> },
      { path: "/units/:id", element: <UnitFormPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
