import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card'
import { Input, Textarea } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { ArrowLeft, Upload } from 'lucide-react'

export function AddWorkerPage({
  employers,
  jobDemands,
  subAgents,
  onNavigate
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    passportNumber: '',
    contact: '',
    address: '',
    country: 'Nepal',
    employerId: employers[0]?._id || '',
    jobDemandId: jobDemands[0]?._id || '',
    subAgentId: subAgents[0]?.id || '',
    status: 'pending',
    currentStage: 'interview',
    notes: '',
    documents: [],
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      handleChange('documents', Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Using FormData to handle file uploads + text fields
    const data = new FormData()
    
    // Append text fields
    Object.keys(formData).forEach(key => {
      if (key !== 'documents') {
        data.append(key, formData[key])
      }
    })

    // Append files
    formData.documents.forEach((file) => {
      data.append('documents', file)
    })

    try {
      const response = await fetch('http://localhost:5000/api/workers/add', {
        method: 'POST',
        body: data, // No JSON.stringify needed for FormData
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Worker saved:', result)
        onNavigate('/employee/workers')
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Submission failed:', error)
      alert('Failed to connect to server')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter job demands by selected employer
  const filteredJobDemands = formData.employerId
    ? jobDemands.filter((jd) => jd.employerId === formData.employerId)
    : jobDemands

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('/employee/workers')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Worker</h1>
          <p className="text-gray-600 mt-2">Register a new worker for recruitment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Enter worker's full name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                required
              />
              <Input
                label="Passport Number"
                placeholder="e.g., NP1234567"
                value={formData.passportNumber}
                onChange={(e) => handleChange('passportNumber', e.target.value)}
                required
              />
              <Input
                label="Contact Number"
                placeholder="e.g., +977-984..."
                value={formData.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                required
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                required
              />
            </div>
            <Textarea
              label="Address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              required
            />
          </CardContent>
        </Card>

        {/* Assignment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Assign to Employer"
                options={employers.map((emp) => ({
                  value: emp._id,
                  label: `${emp.name} (${emp.country})`,
                }))}
                value={formData.employerId}
                onChange={(e) => {
                  const empId = e.target.value
                  handleChange('employerId', empId)
                  const firstMatchingJob = jobDemands.find(jd => jd.employerId === empId)
                  if (firstMatchingJob) handleChange('jobDemandId', firstMatchingJob._id)
                }}
                required
              />
              <Select
                label="Assign to Job Demand"
                options={filteredJobDemands.map((jd) => ({
                  value: jd._id,
                  label: jd.title,
                }))}
                value={formData.jobDemandId}
                onChange={(e) => handleChange('jobDemandId', e.target.value)}
                required
              />
              <Select
                label="Assign to Sub-Agent"
                options={subAgents.map((sa) => ({
                  value: sa.id,
                  label: sa.name,
                }))}
                value={formData.subAgentId}
                onChange={(e) => handleChange('subAgentId', e.target.value)}
              />
              <Select
                label="Initial Status"
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'active', label: 'Active' },
                ]}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents & Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
              />
              {formData.documents.length > 0 && (
                <ul className="mt-2 text-sm text-gray-500">
                  {formData.documents.map((f, i) => <li key={i}>• {f.name}</li>)}
                </ul>
              )}
            </div>
            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Worker'}
          </Button>
          <Button type="button" variant="outline" className="flex-1" onClick={() => onNavigate('/employee/workers')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}