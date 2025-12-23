import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Badge } from '../../components/ui/Badge'
import { Plus, Search } from 'lucide-react'

export function WorkerManagementPage({
  workers,
  employers,
  subAgents,
  onNavigate,
  onSelectWorker,
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusVariant = (status) => {
    // Normalize status to lowercase to match backend enum
    const s = status?.toLowerCase()
    switch (s) {
      case 'active':
        return 'success'
      case 'processing':
        return 'warning'
      case 'completed':
        return 'info'
      case 'rejected':
        return 'error'
      case 'pending':
        return 'default'
      default:
        return 'default'
    }
  }

  const getSubAgentName = (subAgentId) => {
    return subAgents.find((s) => s.id === subAgentId)?.name || 'Not assigned'
  }

  const filteredWorkers = workers.filter((worker) => {
    const search = searchTerm.toLowerCase()
    
    // In our new backend, employerId is populated as an object
    const employerName = worker.employerId?.name || ''
    
    return (
      worker.name.toLowerCase().includes(search) ||
      worker.passportNumber.toLowerCase().includes(search) ||
      employerName.toLowerCase().includes(search)
    )
  })

  const handleRowClick = (worker, e) => {
    // MongoDB uses _id, so we pass the whole object or worker._id
    console.log('Worker row clicked:', worker._id, worker.name)
    onSelectWorker(worker)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workers</h1>
          <p className="text-gray-600 mt-2">
            Manage workers and track their processing stages
          </p>
        </div>
        <Button onClick={() => onNavigate('/employee/workers/add')}>
          <Plus size={18} className="mr-2" />
          Add Worker
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Workers ({filteredWorkers.length})</CardTitle>
            <div className="relative w-80">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search by name, passport, or employer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Passport</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Sub-Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow
                  key={worker._id}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                  onClick={(e) => handleRowClick(worker, e)}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{worker.name}</span>
                      <span className="text-xs text-gray-400 md:hidden">
                        {worker.passportNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{worker.passportNumber}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(worker.status)}>
                      {worker.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">
                    <span className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                        {worker.currentStage || 'Interview'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {worker.employerId?.name || 'Not assigned'}
                  </TableCell>
                  <TableCell>
                    {getSubAgentName(worker.subAgentId)}
                  </TableCell>
                </TableRow>
              ))}
              {filteredWorkers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                        <Search size={40} className="text-gray-200 mb-2" />
                        <p>No workers found matching "{searchTerm}"</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}