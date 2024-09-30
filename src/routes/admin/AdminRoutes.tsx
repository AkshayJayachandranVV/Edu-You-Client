import {Route,Routes} from 'react-router-dom'
import AdminLogin from '../../components/Admin/Auth/AdminLogin/AdminLogin'
import AdminDashboard from '../../pages/Admin/AdminDashboard/AdminDashboard'
import AdminStudents from '../../pages/Admin/AdminDashboard/AdminStudents'
import AdminTutors from '../../pages/Admin/AdminDashboard/AdminTutors'
import ErrorPage from '../../components/User/404/errorPage'; 


const UserRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={ <AdminLogin />} />
            <Route path='/dashboard' element={ <AdminDashboard />} />
            <Route path='/students' element={ <AdminStudents />} />
            <Route path='/tutors' element={ <AdminTutors />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}

export default UserRoutes
