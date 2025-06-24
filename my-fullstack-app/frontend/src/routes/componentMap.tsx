
import DoctorsPage from '../components/Page/DoctorsPage';
import DoctorDetailPage from '../components/Page/DoctorDetailPage';
import Medical_RecordsPage from '../components/Page/Medical_RecordsPage';
import PatientsPage from '../components/Page/PatientsPage';
import PatientsDetailPage from '../components/Page/PatientsDetailPage';
import SchedulesPage from '../components/Page/SchedulesPage';
import Treatment_Costs from '../components/Page/Treatment_Costs';
import UsersPage from '../components/Page/UsersPage';
import DebugPage from '../components/Page/DebugPage';

export const componentMap: { [key: string]: React.ComponentType<any> } = {
  '/doctors': DoctorsPage,
  '/doctordetail': DoctorDetailPage,
  '/medical_records': Medical_RecordsPage,
  '/patients': PatientsPage,
  '/patientsdetail': PatientsDetailPage,
  '/schedules': SchedulesPage,
  '/treatment_costs': Treatment_Costs,
  '/users': UsersPage,
  '/debug': DebugPage,
};