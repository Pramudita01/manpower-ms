"use client";

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { TrendingUp, Users, Briefcase, Calendar, Info } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const generateMockData = () => {
  const today = new Date();
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      workersAdded: Math.floor(Math.random() * 18) + 6,
      jobDemandsCreated: Math.floor(Math.random() * 10) + 2,
    });
  }
  return data;
};

export function ReportsPage({ data }) {
  // Use real data if provided, otherwise generate mock data
  const isMock = !data;
  const reportData = useMemo(() => data || generateMockData(), [data]);
  
  const [filter, setFilter] = useState('month');

  const filteredData = useMemo(() => {
    const now = new Date();
    let cutoff = new Date();
    
    if (filter === 'day') cutoff.setHours(0, 0, 0, 0);
    else if (filter === 'week') cutoff.setDate(now.getDate() - 7);
    else cutoff.setMonth(now.getMonth() - 1);

    return reportData
      .filter((d) => new Date(d.date) >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [reportData, filter]);

  const totalWorkers = filteredData.reduce((sum, d) => sum + d.workersAdded, 0);
  const totalJobDemands = filteredData.reduce((sum, d) => sum + d.jobDemandsCreated, 0);
  
  const avgWorkersPerDay = filteredData.length > 0 ? (totalWorkers / filteredData.length).toFixed(1) : '0';
  const avgDemandsPerDay = filteredData.length > 0 ? (totalJobDemands / filteredData.length).toFixed(1) : '0';

  const chartData = {
    labels: filteredData.map((d) => {
      const date = new Date(d.date);
      return filter === 'day'
        ? date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        type: 'bar',
        label: 'Workers Added',
        data: filteredData.map((d) => d.workersAdded),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderRadius: 8,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Job Demands',
        data: filteredData.map((d) => d.jobDemandsCreated),
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 4,
        pointRadius: 4,
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { type: 'linear', display: true, position: 'left', beginAtZero: true },
      y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, beginAtZero: true },
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {isMock && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 flex items-center gap-3">
          <Info className="text-amber-600" size={20} />
          <p className="text-amber-700 text-sm font-medium">
            Showing Demo Data. Connect your backend API to see real-time performance.
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" /> Reports & Analytics
          </h1>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['day', 'week', 'month'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                filter === f ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Workers" value={totalWorkers} icon={<Users />} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Job Demands" value={totalJobDemands} icon={<Briefcase />} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Avg Workers/Day" value={avgWorkersPerDay} icon={<TrendingUp />} color="text-green-600" bg="bg-green-50" />
        <StatCard title="Avg Demands/Day" value={avgDemandsPerDay} icon={<Calendar />} color="text-purple-600" bg="bg-purple-50" />
      </div>

      <Card className="shadow-xl border-none">
        <CardHeader className="border-b">
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px]">
            <Chart type="bar" data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }) {
  return (
    <Card className={`border-none shadow-md ${bg}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          </div>
          <div className={`${color} opacity-80`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}