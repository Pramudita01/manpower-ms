"use client";

import {
    Briefcase,
    Building2,
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    UserCheck,
    UserCircle,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar({ role, onLogout }) {
    const pathname = usePathname();

    // Standardized links based on your tenant-admin folder structure
    const adminLinks = [
        { path: '/dashboard/tenant-admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/dashboard/tenant-admin/employers', label: 'Employers', icon: Building2 },
        { path: '/dashboard/tenant-admin/employees', label: 'Employees', icon: Users },
        { path: '/dashboard/tenant-admin/workers', label: 'Workers', icon: UserCircle },
        { path: '/dashboard/tenant-admin/sub-agents', label: 'Sub Agents', icon: UserCheck },
        { path: '/dashboard/tenant-admin/reports', label: 'Reports', icon: FileText },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const employeeLinks = [
        { path: '/dashboard/employee', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/dashboard/employee/employers', label: 'Employers', icon: Building2 },
        { path: '/dashboard/employee/job-demands', label: 'Job Demands', icon: Briefcase },
        { path: '/dashboard/employee/workers', label: 'Workers', icon: UserCircle },
        { path: '/dashboard/employee/sub-agents', label: 'Sub Agents', icon: UserCheck },
        { path: '/dashboard/employee/reports', label: 'Reports', icon: FileText },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const links = role === 'admin' ? adminLinks : employeeLinks;

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">ManpowerMS</h1>
                <p className="text-sm text-gray-500 mt-1 capitalize">{role} Portal</p>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    // Logic to highlight the active link
                    const isActive = pathname === link.path || pathname.startsWith(`${link.path}/`);

                    return (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                            <span>{link.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1 h-5 bg-blue-600 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}