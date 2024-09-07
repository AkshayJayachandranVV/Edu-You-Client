import {Route,Routes} from 'react-router-dom'
import AdminLogin from '../../src/components/Admin/Auth/AdminLogin/AdminLogin'
import AdminDashboard from '../../src/pages/Admin/AdminDashboard/AdminDashboard'


const UserRoutes = () => {
    return(
        <Routes>
            <Route path='/login' element={ <AdminLogin />} />
            <Route path='/dashboard' element={ <AdminDashboard />} />
        </Routes>
    )
}

export default UserRoutes