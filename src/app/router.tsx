import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppLayout } from './AppLayout'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { UnitsListPage } from '../features/units-list/UnitsListPage'
import { UnitDetailsPage } from '../features/unit-details/UnitDetailsPage'
import { UnitFormPage } from '../features/unit-form/UnitFormPage'
import { NotFoundPage } from '../shared/ui/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/units', element: <UnitsListPage /> },
      { path: '/units/new', element: <UnitFormPage /> },
      { path: '/units/:id', element: <UnitDetailsPage /> },
      { path: '/units/:id/edit', element: <UnitFormPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
