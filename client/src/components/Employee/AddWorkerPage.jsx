import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input, Textarea } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { ArrowLeft, Upload, X, FileText } from "lucide-react";

export function AddWorkerPage({
  employers = [],
  jobDemands = [],
  subAgents = [],
  onNavigate,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    passportNumber: "",
    contact: "",
    address: "",
    country: "Nepal",
    employerId: "",
    jobDemandId: "",
    subAgentId: "",
    status: "pending",
    notes: "",
  });

  const [documents, setDocuments] = useState([]);
  const [currentDoc, setCurrentDoc] = useState({ file: null, category: "passport", name: "" });

  const documentCategories = [
    { value: "passport", label: "Passport" },
    { value: "medical", label: "Medical Certificate" },
    { value: "police-clearance", label: "Police Clearance" },
    { value: "photo", label: "Worker Photo" },
    { value: "cv", label: "CV/Resume" },
    { value: "citizenship", label: "Citizenship/ID" },
    { value: "visa", label: "Visa Copy" },
    { value: "other", label: "Other" }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Fixed JD filtering: ensures comparison is between strings
  const filteredJobDemands = jobDemands.filter(jd => {
    if (!formData.employerId) return false;
    const jdEmpId = jd.employerId?._id || jd.employerId;
    return String(jdEmpId) === String(formData.employerId);
  });

  const handleAddDocument = () => {
    if (currentDoc.file && currentDoc.name) {
      setDocuments([...documents, currentDoc]);
      setCurrentDoc({ file: null, category: "passport", name: "" });
      const fileInput = document.getElementById('worker-file-input');
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={onNavigate} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Add New Worker</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave({ ...formData, documents }); }} className="space-y-6">
        
        {/* SECTION 1: PERSONAL INFORMATION */}
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
            <Input label="Passport Number" value={formData.passportNumber} onChange={(e) => handleChange("passportNumber", e.target.value)} required />
            <Input label="Date of Birth" type="date" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)} required />
            <Input label="Contact Number" value={formData.contact} onChange={(e) => handleChange("contact", e.target.value)} required />
            <Input label="Address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} required />
            <Input label="Country" value={formData.country} onChange={(e) => handleChange("country", e.target.value)} required />
          </CardContent>
        </Card>

        {/* SECTION 2: ASSIGNMENT DETAILS */}
        <Card>
          <CardHeader><CardTitle>Assignment Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Assign to Employer"
              value={formData.employerId}
              onChange={(e) => {
                handleChange("employerId", e.target.value);
                handleChange("jobDemandId", ""); 
              }}
              options={[
                { value: "", label: "Select Employer" },
                ...employers.map(emp => ({ 
                  value: emp._id || emp.id, 
                  label: emp.employerName || emp.name || emp.companyName || "Unknown Employer"
                }))
              ]}
              required
            />

            <Select
              label="Assign to Job Demand"
              value={formData.jobDemandId}
              disabled={!formData.employerId}
              onChange={(e) => handleChange("jobDemandId", e.target.value)}
              options={[
                { value: "", label: formData.employerId ? "Select Job Demand" : "Select Employer First" },
                ...filteredJobDemands.map(jd => ({ 
                  value: jd._id || jd.id, 
                  label: jd.jobTitle || jd.title || jd.position || "Unknown Job"
                }))
              ]}
              required
            />

            <Select
              label="Assign to Sub-Agent"
              value={formData.subAgentId}
              onChange={(e) => handleChange("subAgentId", e.target.value)}
              options={[
                { value: "", label: "Direct (No Sub-Agent)" },
                ...subAgents.map(sa => ({ 
                  value: sa._id || sa.id, 
                  label: sa.fullName || sa.name || "Unknown Agent"
                }))
              ]}
            />

            <Select
              label="Initial Status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={[
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "active", label: "Active" }
              ]}
              required
            />
          </CardContent>
        </Card>

        {/* SECTION 3: DOCUMENT CLASSIFICATION */}
        <Card>
          <CardHeader><CardTitle>Document Classification</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
              <Select 
                label="Category" 
                options={documentCategories} 
                value={currentDoc.category} 
                onChange={(e) => setCurrentDoc({...currentDoc, category: e.target.value})} 
              />
              <Input label="Document Label" placeholder="e.g. Passport Front" value={currentDoc.name} onChange={(e) => setCurrentDoc({...currentDoc, name: e.target.value})} />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Upload File</label>
                <input id="worker-file-input" type="file" className="text-sm" onChange={(e) => setCurrentDoc({...currentDoc, file: e.target.files[0]})} />
              </div>
              <Button type="button" disabled={!currentDoc.file || !currentDoc.name} onClick={handleAddDocument} className="md:col-span-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border-dashed border-2 border-blue-200">
                <Upload size={16} className="mr-2" /> Add to Queue
              </Button>
            </div>

            <div className="space-y-2">
              {documents.map((doc, i) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded bg-white shadow-sm border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-500" />
                    <div>
                      <p className="text-sm font-bold">{doc.name}</p>
                      <p className="text-xs text-gray-500 uppercase">{doc.category} • {doc.file?.name}</p>
                    </div>
                  </div>
                  <X size={20} className="text-red-500 cursor-pointer hover:bg-red-50 rounded" onClick={() => setDocuments(documents.filter((_, idx) => idx !== i))} />
                </div>
              ))}
            </div>
            <Textarea label="Notes" placeholder="Additional remarks..." value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">Register Worker</Button>
          <Button type="button" variant="outline" onClick={onNavigate} className="flex-1">Cancel</Button>
        </div>
      </form>
    </div>
  );
}