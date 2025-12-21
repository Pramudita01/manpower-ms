"use client";
import React, { useState, useEffect } from 'react';
import { WorkerManagementPage } from '../../../../components/Employee/WorkerManagementPage';
import { AddWorkerPage } from '../../../../components/Employee/AddWorkerPage';

export default function WorkersPage() {
  const [view, setView] = useState('list'); // 'list' or 'add'
  const [workers, setWorkers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [jobDemands, setJobDemands] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all data from your Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [workerRes, employerRes, demandRes] = await Promise.all([
        fetch('http://localhost:5000/api/worker'),
        fetch('http://localhost:5000/api/employers'), // You'll need this route
        fetch('http://localhost:5000/api/job-demands')
      ]);

      const workersData = await workerRes.json();
      const employersData = await employerRes.json();
      const demandsData = await demandRes.json();

      if (workersData.success) setWorkers(workersData.data);
      if (employersData.success) setEmployers(employersData.data);
      if (demandsData.success) setJobDemands(demandsData.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Navigation Handler
  const handleNavigate = (path) => {
    if (path === '/employee/workers/add') {
      setView('add');
    } else {
      setView('list');
      fetchData(); // Refresh list when coming back
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading Manpower Data...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {view === 'list' ? (
        <WorkerManagementPage
          workers={workers}
          employers={employers}
          subAgents={[]} // Add sub-agent data here later
          onNavigate={handleNavigate}
          onSelectWorker={(worker) => console.log("Selected:", worker)}
        />
      ) : (
        <AddWorkerPage
          employers={employers}
          jobDemands={jobDemands}
          subAgents={[]}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}