"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EmployerDetailPage } from '../../../../components/Admin/EmployerDetailPage'; // Import the new detail component
import { EmployersListPage } from '../../../../components/Admin/EmployersListPage';
import { DashboardLayout } from '../../../../components/DashboardLayout';

export default function AdminEmployersPage() {
    const router = useRouter();
    const [employers, setEmployers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEmployer, setSelectedEmployer] = useState(null); // State for the detail view
    const [adminData, setAdminData] = useState({ name: 'Admin', role: 'admin' });

    useEffect(() => {
        const fetchEmployers = async () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            const fullName = localStorage.getItem('fullName');

            // 1. Check Auth
            if (!token || role !== 'admin') {
                router.push('/login');
                return;
            }

            setAdminData({ name: fullName || 'Admin', role });

            // 2. Fetch Data from your Backend
            try {
                const response = await fetch('http://localhost:5000/api/employers', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    setEmployers(result.data);
                } else {
                    console.error("Fetch error:", result.error);
                }
            } catch (err) {
                console.error("Network error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployers();
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    return (
        <DashboardLayout
            role="admin"
            userName={adminData.name}
            currentPath="/dashboard/tenant-admin/employers"
            onNavigate={(path) => router.push(path)}
            onLogout={handleLogout}
        >
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : selectedEmployer ? (
                /* --- NEW: DETAIL VIEW --- */
                <EmployerDetailPage
                    employer={selectedEmployer}
                    onBack={() => setSelectedEmployer(null)}
                />
            ) : (
                /* --- LIST VIEW --- */
                <EmployersListPage
                    employers={employers}
                    onSelectEmployer={(employer) => setSelectedEmployer(employer)} // Pass the setter to the list
                />
            )}
        </DashboardLayout>
    );
}