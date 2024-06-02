import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import { CookiesProvider } from 'react-cookie';

import { QueryClient, QueryClientProvider } from 'react-query';

import { Route, Routes, useLocation } from 'react-router-dom';

import { useState, useEffect } from 'react';

import SignIn from './pages/Authentication/SignIn';
import Loader from './common/Loader';
import Dashboard from './pages/Dashboard/Dashboard';
import ListEvent from './pages/Events/List';
import PageTitle from './components/PageTitle';
import CreateEvent from './pages/Events/Create';
import EventDetails from './pages/Events/Details';

const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    <Loader />
  }

  return (
    <>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route
              index
              element={
                <>
                  <PageTitle title="Dashboard | VitaEvent" />
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/signin"
              element={
                <>
                  <PageTitle title="Signin | x" />
                  <SignIn />
                </>
              }
            />
            <Route path="/events">
              <Route index element={<ListEvent />} />
              <Route path="create" element={<CreateEvent />} />
              <Route path=":id" element={<EventDetails />} />
            </Route>
          </Routes>
        </QueryClientProvider>
      </CookiesProvider>

      <ToastContainer />
    </>
  );
}

export default App;
