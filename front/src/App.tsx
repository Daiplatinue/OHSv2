import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './sections/Home';
import LoginAlt from './sections/LoginAlt';
import Transaction from './sections/Transaction';
import MyProfileCustomer from './sections/Customer_Tabs/MyProfileCustomer';

import ChatRTC from './sections/Styles/ChatRTC';

import Admin from './sections/Admin';
import Admin_Transaction from './sections/Admin_Tabs/Admin_Transactions';
import AccountsTab from './sections/Admin_Tabs/AccountsTab';
import NewsAdmin from './sections/Admin_Tabs/NewsAdmin';
import UserActivities from './sections/Admin_Tabs/UserActivities';
import MyProfile from './sections/Admin_Tabs/MyProfile';
import MyEmailsAdmin from './sections/Admin_Tabs/MyEmailsAdmin';
import MyNotificationsAdmin from './sections/Admin_Tabs/MyNotificationsAdmin';

import COO from './sections/COO';
import MyBalance from './sections/Manager-tabs/MyBalance';
import Bookings from './sections/Manager-tabs/Bookings';
import EmailCeo from './sections/Manager-tabs/MyEmailsCeo';
import NotificationCeo from './sections/Manager-tabs/MyNotificationsCeo';
import NewsCeo from './sections/Manager-tabs/NewsCeo';
import Employee from './sections/Manager-tabs/ProvidersManagement';

import Provider from './sections/Provider';

import Proposition from './sections/Proposition';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/transaction' element={<Transaction />} />
        <Route path='/login' element={<LoginAlt />} />

        {/* Chat */}
        <Route path='/chat' element={<ChatRTC />} />

        {/* Customer Tabs */}
        <Route path='/' element={<Home />} />
        <Route path='/customer/profile' element={<MyProfileCustomer />} />

        {/* Admin Tabs */}
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin/transactions' element={<Admin_Transaction />} />
        <Route path='/admin/accounts' element={<AccountsTab />} />
        <Route path='/admin/news' element={<NewsAdmin />} />
        <Route path='/admin/activities' element={<UserActivities />} />
        <Route path='/admin/my-account' element={<MyProfile />} />
        <Route path='/admin/emails' element={<MyEmailsAdmin />} />
        <Route path='/admin/notifications' element={<MyNotificationsAdmin />} />

        {/* Ceo Tabs */}
        <Route path='/coo' element={<COO />} />
        <Route path='/ceo/my-balance' element={<MyBalance />} />
        <Route path='/ceo/bookings' element={<Bookings />} />
        <Route path='/ceo/email' element={<EmailCeo />} />
        <Route path='/ceo/notificaitons' element={<NotificationCeo />} />
        <Route path='/ceo/news' element={<NewsCeo />} />
        <Route path='/ceo/employees' element={<Employee />} />

        {/* Provider */}
        <Route path='/provider' element={<Provider />} />

        {/* Proposition */}
        <Route path='/proposition' element={<Proposition />} />


      </Routes>
    </BrowserRouter>
  );
};

export default App;