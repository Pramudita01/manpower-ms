import {
    ArrowLeft,
    Briefcase,
    Building2,
    Globe,
    MapPin,
    Phone,
    User,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';

export function EmployerDetailPage({ employer, onBack }) {
    const [demands, setDemands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEmployerDemands = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/job-demands/employer/${employer._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (result.success) {
                    setDemands(result.data);
                }
            } catch (err) {
                console.error("Error fetching employer demands:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (employer?._id) {
            fetchEmployerDemands();
        }
    }, [employer._id]);

    if (!employer) return null;

    const creatorName = employer.createdBy?.fullName || (typeof employer.createdBy === 'string' ? employer.createdBy : 'System Admin');

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack} className="rounded-full hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{employer.employerName}</h1>
                            <Badge variant={employer.status === 'active' ? 'success' : 'secondary'}>
                                {employer.status || 'Active'}
                            </Badge>
                        </div>
                        <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                            <Globe size={14} className="text-gray-400" />
                            {employer.country} • Joined {new Date(employer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Demands</p>
                            {/* DYNAMIC COUNT */}
                            <p className="text-3xl font-bold text-gray-900 mt-1">{isLoading ? '...' : demands.length}</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Briefcase size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Hired</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <Users size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Retention Rate</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">100%</p>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Building2 size={24} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold">Contact Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-gray-50 p-2 rounded-md"><Phone size={16} className="text-gray-500" /></div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">Direct Phone</p>
                                    <p className="text-gray-900 font-medium">{employer.contact}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-gray-50 p-2 rounded-md"><MapPin size={16} className="text-gray-500" /></div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">HQ Address</p>
                                    <p className="text-gray-900 font-medium leading-relaxed">{employer.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-gray-50 p-2 rounded-md"><User size={16} className="text-gray-500" /></div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">Account Managed By</p>
                                    <p className="text-blue-600 font-semibold">{creatorName}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold">Internal Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 italic text-sm text-gray-700 leading-relaxed">
                                {employer.notes || "No special notes recorded for this employer."}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Dynamic Job Demand Table */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm overflow-hidden border-none">
                        <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b">
                            <CardTitle className="text-lg font-bold">Job Demands</CardTitle>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold">Live Data</Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="pl-6">Job Title</TableHead>
                                        <TableHead>Quota</TableHead>
                                        <TableHead>Deadline</TableHead>
                                        <TableHead className="pr-6 text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10 text-gray-400">Loading demands...</TableCell>
                                        </TableRow>
                                    ) : demands.length > 0 ? (
                                        demands.map((job) => (
                                            <TableRow key={job._id} className="hover:bg-gray-50/30 transition-colors">
                                                <TableCell className="font-semibold pl-6 text-gray-800">{job.jobTitle}</TableCell>
                                                <TableCell className="text-gray-600">{job.requiredWorkers}</TableCell>
                                                <TableCell className="text-gray-600">
                                                    {new Date(job.deadline).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <Badge
                                                        className="font-medium"
                                                        variant={job.status === 'open' ? 'success' : 'secondary'}
                                                    >
                                                        {job.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                                                No job demands found for this employer.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}