
import DoctorsPage from '../components/Page/DoctorsPage';
import DoctorDetailPage from '../components/Page/DoctorDetailPage';
import TreatmentsPage from '../components/Page/TreatmentsPage';
import TreatmentsDetailPage from '../components/Page/TreatmentsDetailPage';
import PatientsPage from '../components/Page/PatientsPage';
import PatientsDetailPage from '../components/Page/PatientsDetailPage';
import SchedulesPage from '../components/Page/SchedulesPage';
import ReceiptsPage from '../components/Page/ReceiptsPage';
import ReceiptsDetailPage from '../components/Page/ReceiptsDetailPage';
import UsersPage from '../components/Page/UsersPage';
import DebugPage from '../components/Page/DebugPage';

export const componentMap: { [key: string]: React.ComponentType<any> } = {
  '/doctors': DoctorsPage,
  '/doctordetail': DoctorDetailPage,
  '/treatments': TreatmentsPage,
  '/treatmentsdetail': TreatmentsDetailPage,
  '/patients': PatientsPage,
  '/patientsdetail': PatientsDetailPage,
  '/schedules': SchedulesPage,
  '/receipts': ReceiptsPage,
  '/receiptsdetail': ReceiptsDetailPage,
  '/users': UsersPage,
  '/debug': DebugPage,
};