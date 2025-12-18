"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../../components/DashboardLayout';
import { EmployerListPage } from '../../../../components/Employee/EmployerListPage';
import { AddEmployerPage } from '../../../../components/Employee/AddEmployer';
import { EmployerDetailsPage } from '../../../../components/Employee/EmployerDetailPage';

export default function EmployersPage() {
    const router = useRouter();
    const [view, setView] = useState('list'); // views: 'list', 'add', 'details'
    const [employers, setEmployers] = useState([]);
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [userData, setUserData] = useState({ fullName: '', role: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        if (!token || role !== 'employee') {
            router.push('/login');
            return;
        }
        setUserData({ fullName: localStorage.getItem('fullName'), role });
        fetchEmployers(token);
    }, [router]);

    const fetchEmployers = async (token) => {
        try {
            const res = await fetch('http://localhost:5000/api/employers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setEmployers(result.data);
        } catch (error) {
            console.error("Failed to fetch:", error);
        }
    };

    // Triggered when a row is clicked in the list
    const handleSelectEmployer = (employer) => {
        setSelectedEmployer(employer);
        setView('details');
    };

    const handleSave = async (formData) => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/employers', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(formData)
        });
        
        const result = await res.json();

        if (res.ok && result.success) {
            fetchEmployers(token);
            setView('list');
        } else {
            // Throwing error so AddEmployerPage can catch and display it
            throw new Error(result.error || "Failed to save employer");
        }
    };

    return (
        <DashboardLayout 
            role="employee" 
            userName={userData.fullName} 
            currentPath="/dashboard/employee/employer" 
            onLogout={() => { localStorage.clear(); router.push('/login'); }}
        >
            {/* View Switcher */}
            {view === 'list' && (
                <EmployerListPage 
                    employers={employers} 
                    onNavigate={setView} 
                    onSelectEmployer={handleSelectEmployer} 
                />
            )}

            {view === 'add' && (
                <AddEmployerPage 
                    onNavigate={() => setView('list')} 
                    onSave={handleSave} 
                />
            )}

            {view === 'details' && (
                <EmployerDetailsPage 
                    employer={selectedEmployer} 
                    onNavigate={() => setView('list')} 
                />
            )}
        </DashboardLayout>
    );
}