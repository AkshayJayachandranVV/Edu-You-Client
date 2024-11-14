import {Route,Routes} from 'react-router-dom'
import AdminLogin from '../../components/Admin/Auth/AdminLogin/AdminLogin'
import AdminDashboard from '../../pages/Admin/AdminDashboard/AdminDashboard'
import AdminStudents from '../../pages/Admin/AdminDashboard/AdminStudents'
import AdminTutors from '../../pages/Admin/AdminDashboard/AdminTutors'
import AdminCourses from '../../pages/Admin/AdminDashboard/AdminCourses'
import AdminReports from '../../pages/Admin/AdminDashboard/AdminReportCourse'
import AdminPayouts from '../../pages/Admin/AdminDashboard/AdminPayouts'
import ErrorPage from '../../components/User/404/errorPage'; 
import PrivateRoute from "./privateRoute"
import PrivateRouteAdmin from "./privateRouteAdmin"


const UserRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={ <PrivateRoute > <AdminLogin />  </PrivateRoute>} />
            <Route path='/dashboard' element={ <PrivateRouteAdmin><AdminDashboard />  </PrivateRouteAdmin> } />
            <Route path='/students' element={ <PrivateRouteAdmin> <AdminStudents />  </PrivateRouteAdmin>} />
            <Route path='/tutors' element={<PrivateRouteAdmin> <AdminTutors />  </PrivateRouteAdmin>} />
            <Route path='/courses' element={<PrivateRouteAdmin> <AdminCourses />  </PrivateRouteAdmin>} />
            <Route path='/reports' element={<PrivateRouteAdmin> <AdminReports />  </PrivateRouteAdmin>} />
            <Route path='/payouts' element={<PrivateRouteAdmin> <AdminPayouts />  </PrivateRouteAdmin>} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}

export default UserRoutes
