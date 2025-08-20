import React, { useState } from 'react';
import { Calendar, Filter, ChevronLeft, ChevronRight, Settings, CheckCircle, XCircle, AlertCircle, Pause, Play, Clock } from 'lucide-react';

const WeeklyJobStatusGrid = () => {
  const [currentWeek, setCurrentWeek] = useState('2024-08-05'); // Week starting date
  const [viewMode, setViewMode] = useState('status'); // 'status' or 'runs'

  // Generate week dates
  const getWeekDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeek);

  // Sample job data for the week
  const jobsData = [
    {
      jobId: 'DAILY_BATCH_PROCESS',
      jobName: 'Daily Batch Processing',
      priority: 'High',
      executions: {
        '2024-08-05': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-06': { status: 'FAILED', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200', runs: 3 },
        '2024-08-07': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-08': { status: 'ABEND', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200', runs: 2 },
        '2024-08-09': { status: 'WAITING', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', runs: 0 },
        '2024-08-10': { status: 'RUNNING', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', runs: 1 },
        '2024-08-11': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 }
      }
    },
    {
      jobId: 'ETL_DATA_SYNC',
      jobName: 'ETL Data Synchronization',
      priority: 'Critical',
      executions: {
        '2024-08-05': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-06': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-07': { status: 'FAILED', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200', runs: 2 },
        '2024-08-08': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-09': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-10': { status: 'RUNNING', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', runs: 1 },
        '2024-08-11': { status: 'SCHEDULED', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', runs: 0 }
      }
    },
    {
      jobId: 'BACKUP_VALIDATION',
      jobName: 'Database Backup Validation',
      priority: 'Normal',
      executions: {
        '2024-08-05': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-06': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-07': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-08': { status: 'FAILED', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200', runs: 2 },
        '2024-08-09': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-10': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-11': { status: 'SCHEDULED', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', runs: 0 }
      }
    },
    {
      jobId: 'REPORT_GENERATION',
      jobName: 'Weekly Report Generation',
      priority: 'Low',
      executions: {
        '2024-08-05': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-06': null, // No execution
        '2024-08-07': null,
        '2024-08-08': null,
        '2024-08-09': { status: 'FAILED', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200', runs: 2 },
        '2024-08-10': null,
        '2024-08-11': { status: 'WAITING', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', runs: 0 }
      }
    },
    {
      jobId: 'CLEANUP_TEMP_FILES',
      jobName: 'Temporary File Cleanup',
      priority: 'Normal',
      executions: {
        '2024-08-05': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-06': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-07': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-08': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-09': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-10': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 },
        '2024-08-11': { status: 'OK', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200', runs: 1 }
      }
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Normal': return 'text-blue-600 bg-blue-100';
      case 'Low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const navigateWeek = (direction) => {
    const currentDate = new Date(currentWeek);
    currentDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentWeek(currentDate.toISOString().split('T')[0]);
  };

  const getWeekSummary = () => {
    let totalJobs = 0;
    let successfulJobs = 0;
    let failedJobs = 0;
    let runningJobs = 0;

    jobsData.forEach(job => {
      weekDates.forEach(date => {
        const execution = job.executions[date];
        if (execution) {
          totalJobs++;
          if (execution.status === 'OK') successfulJobs++;
          else if (execution.status === 'FAILED' || execution.status === 'ABEND') failedJobs++;
          else if (execution.status === 'RUNNING') runningJobs++;
        }
      });
    });

    return { totalJobs, successfulJobs, failedJobs, runningJobs };
  };

  const summary = getWeekSummary();

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Weekly Job Status Overview
          </h1>
          <p className="text-gray-600 mt-1">Monitor job execution status across the week</p>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Week Navigation */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigateWeek(-1)}
                  className="p-2 hover:bg-white rounded-lg border border-gray-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium text-gray-900 px-4">
                  {formatDate(weekDates[0]).date} - {formatDate(weekDates[6]).date}
                </span>
                <button 
                  onClick={() => navigateWeek(1)}
                  className="p-2 hover:bg-white rounded-lg border border-gray-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('status')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    viewMode === 'status' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Status View
                </button>
                <button
                  onClick={() => setViewMode('runs')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    viewMode === 'runs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Runs View
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{summary.successfulJobs} Successful</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>{summary.failedJobs} Failed</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{summary.runningJobs} Running</span>
              </div>
              <div className="text-gray-600">
                Total: {summary.totalJobs} executions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-900 w-64">
                  Job Name
                </th>
                {weekDates.map(date => {
                  const dateInfo = formatDate(date);
                  return (
                    <th key={date} className="px-4 py-4 text-center font-medium text-gray-900 min-w-32">
                      <div>
                        <div className="text-sm">{dateInfo.day}</div>
                        <div className="text-xs text-gray-600">{dateInfo.date}</div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobsData.map((job, jobIndex) => (
                <tr key={job.jobId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-mono text-sm font-medium text-gray-900">{job.jobId}</div>
                      <div className="text-sm text-gray-600">{job.jobName}</div>
                      <div className="mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                    </div>
                  </td>
                  {weekDates.map(date => {
                    const execution = job.executions[date];
                    return (
                      <td key={`${job.jobId}-${date}`} className="px-4 py-4 text-center">
                        {execution ? (
                          <div className={`inline-flex flex-col items-center justify-center p-2 rounded-lg ${execution.bgColor} border ${execution.borderColor} min-w-20 min-h-16`}>
                            {viewMode === 'status' ? (
                              <>
                                <span className={`text-sm font-bold ${execution.color} text-center`}>
                                  {execution.status}
                                </span>
                                <span className="text-xs text-gray-600 mt-1">
                                  {execution.runs} run{execution.runs !== 1 ? 's' : ''}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className={`text-xl font-bold ${execution.color}`}>
                                  {execution.runs}
                                </span>
                                <span className="text-xs text-gray-600">
                                  run{execution.runs !== 1 ? 's' : ''}
                                </span>
                                <span className={`text-xs font-medium ${execution.color} mt-1 text-center`}>
                                  {execution.status}
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-20 h-16 rounded-lg bg-gray-100 border border-gray-200">
                            <span className="text-xs text-gray-400">No execution</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Status Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">OK</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">FAILED</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-sm text-gray-700">ABEND</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">RUNNING</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700">WAITING</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-sm text-gray-700">SCHEDULED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyJobStatusGrid;
