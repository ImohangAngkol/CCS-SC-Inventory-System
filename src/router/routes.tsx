import { createBrowserRouter } from 'react-router-dom';
import StudentDashboard from '../pages/Student';
import OfficerDashboard from '../pages/Officer';
import LoginPage from '../pages/Login';
import QRScannerPage from '../pages/QRScanner';
import AboutPage from '../pages/About';
import NotFound from '../pages/NotFound';
import App from '../App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <StudentDashboard /> }, // default landing
      { path: 'login', element: <LoginPage /> },
      { path: 'student', element: <StudentDashboard /> },
      { path: 'officer', element: <OfficerDashboard /> },
      { path: 'qr', element: <QRScannerPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]);
