"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { RegisterPage } from '../../../components/RegisterPage';

const API_URL = 'http://localhost:5000/api/auth/register';

export default function Register() {
  const router = useRouter();

  const handleRegister = async (username, email, password, role, companyName) => {
    try {
      // 1. Send Registration Request
      const response = await axios.post(API_URL, {
        fullName: username,
        email: email,
        password: password,
        role: role,
        companyName: companyName,
      });

      // 2. DO NOT store token here. 
      // Instead, we just confirm success.
      console.log("Registration Successful:", response.data.msg);

      // 3. Redirect to Login Page
      // We add a query parameter '?registered=true' so the login page can show a success message
      router.push('/login?registered=true');

    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);

      let errorMessage = 'Registration failed. Please check the form data.';
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message === 'Network Error') {
        errorMessage = 'Server unreachable. Is the backend running?';
      }

      throw new Error(errorMessage);
    }
  };

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  return <RegisterPage onRegister={handleRegister} onSwitchToLogin={handleSwitchToLogin} />;
}