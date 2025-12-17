"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LoginPage } from '../../../components/LoginPage';

const API_URL = 'http://localhost:5000/api/auth/login';

export default function Login() {
    const router = useRouter();

    const handleLogin = async (email, password) => {
        try {
            // 1. Send Login Request
            const response = await axios.post(API_URL, { email, password });

            const { token, user } = response.data;

            // 2. Persist User Data
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('companyId', user.companyId || 'null');
            localStorage.setItem('fullName', user.fullName); // Corrected from username

            console.log(`Login Successful! Welcome, ${user.fullName}`);

            // 3. Role-Based Redirect
            // This ensures Super Admins go to their master panel, and Admins to their company panel
            if (user.role === 'super_admin') {
                router.push('/dashboard/super-admin');
            } else if (user.role === 'admin') {
                router.push('/dashboard/tenant-admin');
            } else {
                router.push('/dashboard/employee');
            }

        } catch (error) {
            let errorMessage = 'Login failed. Please check your credentials.';

            if (error.response?.data?.msg) {
                errorMessage = error.response.data.msg;
            } else if (error.message === 'Network Error') {
                errorMessage = 'Network Error. Is the backend server running?';
            }

            // We throw this so LoginPage's internal catch can display it in the UI
            throw new Error(errorMessage);
        }
    };

    return <LoginPage onLogin={handleLogin} />;
}