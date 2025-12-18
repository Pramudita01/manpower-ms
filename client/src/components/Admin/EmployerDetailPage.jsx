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
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';

export function EmployerDetailPage({ employer, onBack }) {
    if (!employer) return null;

    // Helper to handle the populated object or a fallback ID string
    const creatorName = employer.createdBy?.fullName || (typeof employer.createdBy === 'string' ? employer.createdBy : 'System Admin');

    return (
        <div className="space-y-6">
            {/* Header Section - Action Buttons Removed */}
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
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Demands</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
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
                            <p className="text-3xl font-bold text-gray-900 mt-1">148</p>
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
                            <p className="text-3xl font-bold text-gray-900 mt-1">94%</p>
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

                {/* Right Column: Tables */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm overflow-hidden border-none">
                        <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b">
                            <CardTitle className="text-lg font-bold">Recent Job Demands</CardTitle>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold">History</Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="pl-6">Category</TableHead>
                                        <TableHead>Quota</TableHead>
                                        <TableHead>Filled</TableHead>
                                        <TableHead className="pr-6 text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { cat: 'HVAC Tech', q: 10, f: 8, s: 'In Progress' },
                                        { cat: 'Civil Engineer', q: 2, f: 2, s: 'Completed' },
                                        { cat: 'Safety Officer', q: 5, f: 0, s: 'Open' },
                                    ].map((job, i) => (
                                        <TableRow key={i} className="hover:bg-gray-50/30 transition-colors">
                                            <TableCell className="font-semibold pl-6 text-gray-800">{job.cat}</TableCell>
                                            <TableCell className="text-gray-600">{job.q}</TableCell>
                                            <TableCell className="text-gray-600">{job.f}</TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Badge className="font-medium" variant={job.s === 'Completed' ? 'success' : 'default'}>{job.s}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b">
                            <CardTitle className="text-lg font-bold">Latest Hires</CardTitle>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold">Verified</Badge>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {[
                                    { name: "John Doe", pos: "Electrician", date: "Oct 12, 2024" },
                                    { name: "Arjun Singh", pos: "Pipe Fitter", date: "Oct 10, 2024" },
                                    { name: "Hassan Malik", pos: "Driver", date: "Oct 08, 2024" }
                                ].map((hire, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {hire.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{hire.name}</p>
                                                <p className="text-xs text-gray-500 font-medium">{hire.pos}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-400">{hire.date}</p>
                                            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Placement OK</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}