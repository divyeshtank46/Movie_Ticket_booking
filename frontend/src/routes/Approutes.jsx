import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import '../styles/index.css';

// Layouts
import Layouts from '../layout/Layouts';
import AdminLayout from '../layout/AdminLayout';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import MoviesManagement from '../pages/admin/MoviesManagement';
import CinemasManagement from '../pages/admin/CinemasManagement';
import ShowsManagement from '../pages/admin/ShowsManagement';
import BookingsManagement from '../pages/admin/BookingsManagement';
import UsersManagement from '../pages/admin/UsersManagement';

// Public Pages
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import ContactUs from '../pages/Contact';
import Movies from '../pages/Movies';
import Cinema from '../pages/Cinema';
import Moviedetail from '../pages/Moviedetail';
import Shows from '../pages/Shows';

// Auth Components
import Login from '../components/Login';
import Registration from '../components/Regestraion';
import Privateroutes from './Privateroutes';
import Publicroutes from './Publicroutes';

// User Components
import Userdetail from '../pages/Userdetail';
import Mybookings from '../pages/Mybookings';
import Bookingpage from '../pages/Bookingpage';

// UI Components
import Moviecard from '../components/Moviecard';
import CinemaCard from '../components/Cinemacard';
import Loader from '../components/Loader';
import Adminroutes from './Adminroutes';
import RevenueChart from '../components/admin/RevenueChart';
import NotFound from '../pages/NotFound';
import AddMovie from '../pages/admin/AddMovie';
import EditMovie from '../pages/admin/EditMovie';
import AddCinema from '../pages/admin/AddCinema';
import EditCinema from '../pages/admin/EditCinema';

const Approutes = () => {
    return (
        <>
            <Routes>
                {/* Admin Routes with AdminLayout */}
                {/* <Adminroutes> */}
                <Route element={<Adminroutes />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="movies" element={<MoviesManagement />} />
                        <Route path="cinemas" element={<CinemasManagement />} />
                        <Route path="shows/:id" element={<ShowsManagement />} />
                        <Route path="bookings" element={<BookingsManagement />} />
                        <Route path="users" element={<UsersManagement />} />
                        <Route path='revenue' element={<RevenueChart />} />
                        <Route path='addmovie' element={<AddMovie />} />
                        <Route path='editmovie/:id' element={<EditMovie />} />
                        <Route path='addcinema' element={<AddCinema />} />
                        <Route path='editcinema/:id' element={<EditCinema />} />
                    </Route>
                </Route>
                {/* </Adminroutes> */}

                {/* Main Layout Routes */}
                <Route path="/" element={<Layouts />}>
                    {/* Public Routes */}
                    <Route index element={<Home />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="contact-us" element={<ContactUs />} />
                    <Route path="movies" element={<Movies />} />
                    <Route path="cinemas" element={<Cinema />} />
                    <Route path="movie/:id" element={<Moviedetail />} />
                    <Route path="shows" element={<Shows />} />

                    {/* Auth Routes */}
                    <Route
                        path="login"
                        element={
                            <Publicroutes>
                                <Login />
                            </Publicroutes>
                        }
                    />
                    <Route
                        path="register"
                        element={
                            <Publicroutes>
                                <Registration />
                            </Publicroutes>
                        }
                    />

                    {/* Protected Routes */}
                    <Route
                        path="user-detail"
                        element={
                            <Privateroutes>
                                <Userdetail />
                            </Privateroutes>
                        }
                    />
                    <Route
                        path="bookings"
                        element={
                            <Privateroutes>
                                <Mybookings />
                            </Privateroutes>
                        }
                    />
                    <Route
                        path="booking/:showId"
                        element={
                            <Privateroutes>
                                <Bookingpage />
                            </Privateroutes>
                        }
                    />
                    {/* UI Component Routes (Development) */}
                    <Route path="moviecard" element={<Moviecard />} />
                    <Route path="cinemacard" element={<CinemaCard />} />
                    <Route path="loader" element={<Loader />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes >
            <ToastContainer
                position="top-center"
                autoClose={3000}
                theme="dark"
                newestOnTop
                pauseOnHover
                draggable
            />
        </>
    );
};

export default Approutes;