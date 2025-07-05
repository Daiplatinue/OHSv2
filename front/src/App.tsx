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
import MyProfileCOO from './sections/COO-tabs/MyProfileCOO';
import MyBalance from './sections/COO-tabs/MyBalance';
import Bookings from './sections/COO-tabs/Bookings';
import EmailCeo from './sections/COO-tabs/MyEmailsCeo';
import NotificationCeo from './sections/COO-tabs/MyNotificationsCeo';
import NewsCeo from './sections/COO-tabs/NewsCeo';
import Employee from './sections/COO-tabs/ProvidersManagement';

import Provider from './sections/Provider';
import MyProfileProvider from './sections/Provier_Tabs/MyProfileProvider';

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

        {/* COO Tabs */}
        <Route path='/coo' element={<COO />} />
        <Route path='/ceo/my-balance' element={<MyBalance />} />
        <Route path='/ceo/bookings' element={<Bookings />} />
        <Route path='/ceo/email' element={<EmailCeo />} />
        <Route path='/ceo/notificaitons' element={<NotificationCeo />} />
        <Route path='/ceo/news' element={<NewsCeo />} />
        <Route path='/ceo/employees' element={<Employee />} />
        <Route path='/coo/profile' element={<MyProfileCOO />} />

        {/* Provider */}
        <Route path='/provider' element={<Provider />} />
        <Route path='/provider/profile' element={<MyProfileProvider />} />

        {/* Proposition */}
        <Route path='/proposition' element={<Proposition />} />


      </Routes>
    </BrowserRouter>
  );
};

export default App;