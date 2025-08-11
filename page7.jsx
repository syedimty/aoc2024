import React, { useState } from 'react';
import { Search, Calendar, Filter, ExternalLink, FileText, Settings, Clock, Play, AlertCircle, CheckCircle, XCircle, Pause, MoreVertical, ChevronRight, Activity, PlayCircle, StopCircle } from 'lucide-react';

const ControlMJobHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('compact');
  const [expandedJob, setExpandedJob] = useState(null);

  // Sample data - all same job with different execution instances
  const jobExecutions = [
    {
      orderDate: '2024-08-11 14:30:15',
      jobId: 'DAILY_BATCH_PROCESS',
      status: 'Ended OK',
      statusColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      waitingEvents: [],
      numberOfRuns: 1,
      hasJobLogs: true,
      hasScriptLog: true,
      startTime: '2024-08-11 14:30:15',
      endTime: '2024-08-11 14:42:49',
      duration: '00:12:34',
      owner: 'PROD_USER',
      priority: 'Normal'
    },
    {
      orderDate: '2024-08-11 13:45:22',
      jobId: 'DAILY_BATCH_PROCESS',
      status: 'Failed',
      statusColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: XCircle,
      waitingEvents: [],
      numberOfRuns: 3,
      hasJobLogs: true,
      hasScriptLog: false,
      startTime: '2024-08-11 13:45:22',
      endTime: '2024-08-11 13:53:34',
      duration: '00:08:12',
      errorCode: 'ERR_DB_CONNECTION',
      owner: 'PROD_USER',
      priority: 'Normal'
    },
    {
      orderDate: '2024-08-11 12:00:00',
      jobId: 'DAILY_BATCH_PROCESS',
      status: 'Waiting Condition',
      statusColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: Pause,
      waitingEvents: ['FILE_READY_EVT', 'DB_BACKUP_COMPLETE', 'APPROVAL_RECEIVED'],
      numberOfRuns: 0,
      hasJobLogs: true,
      hasScriptLog: false,
      estimatedStartTime: '2024-08-11 16:30:00',
      estimatedEndTime: '2024-08-11 17:15:00',
      estimatedDuration: '00:45:00',
      owner: 'PROD_USER',
      priority: 'Normal'
    },
    {
      orderDate: '2024-08-11 11:15:30',
      jobId: 'DAILY_BATCH_PROCESS',
      status: 'Ended OK',
      statusColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      waitingEvents: [],
      numberOfRuns: 1,
      hasJobLogs: true,
      hasScriptLog: true,
      startTime: '2024-08-11 11:15:30',
      endTime: '2024-08-11 11:17:45',
      duration: '00:02:15',
      owner: 'PROD_USER',
      priority: 'Normal'
    },
    {
      orderDate: '2024-08-11 10:30:45',
      jobId: 'DAILY_BATCH_PROCESS',
      status: 'Executing',
      statusColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: Play,
      waitingEvents: [],
      numberOfRuns: 1,
      hasJobLogs: true,
      hasScriptLog: true,
      startTime: '2024-08-11 10:30:45',
      estimatedEndTime: '2024-08-11 15:45:00',
      duration: '01:45:22',
      owner: 'PROD_USER',
      priority: 'Normal'
    },
    {
      orderDate: '2024-08-11 09:00:00',
      jobId: 'DAILY_BATCH_PROCESS',
      status: 'Abended',
      statusColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: AlertCircle,
      waitingEvents: [],
      numberOfRuns: 2,
      hasJobLogs: true,
      hasScriptLog: false,
      startTime: '2024-08-11 09:00:00',
      endTime: '2024-08-11 09:15:33',
      duration: '00:15:33',
      errorCode: 'ABEND_S0C4',
      owner: 'PROD_USER',
      priority: 'Normal'
    }
  ];

  const filteredJobs = jobExecutions.filter(job => {
    const matchesSearch = job.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getTimeInfo = (job) => {
    const result = {
      startLabel: '',
      startTime: '',
      endLabel: '',
      endTime: '',
      startIcon: null,
      endIcon: null,
      isEstimated: false
    };

    if (job.status === 'Waiting Condition') {
      result.startLabel = 'Est. Start';
      result.startTime = job.estimatedStartTime ? formatDate(job.estimatedStartTime).full : '—';
      result.endLabel = 'Est. End';
      result.endTime = job.estimatedEndTime ? formatDate(job.estimatedEndTime).full : '—';
      result.startIcon = Clock;
      result.endIcon = Clock;
      result.isEstimated = true;
    } else if (job.status === 'Executing') {
      result.startLabel = 'Started';
      result.startTime = job.startTime ? formatDate(job.startTime).full : '—';
      result.endLabel = 'Est. End';
      result.endTime = job.estimatedEndTime ? formatDate(job.estimatedEndTime).full : '—';
      result.startIcon = PlayCircle;
      result.endIcon = Clock;
      result.isEstimated = false;
    } else {
      // Completed, Failed, Abended
      result.startLabel = 'Started';
      result.startTime = job.startTime ? formatDate(job.startTime).full : '—';
      result.endLabel = 'Ended';
      result.endTime = job.endTime ? formatDate(job.endTime).full : '—';
      result.startIcon = PlayCircle;
      result.endIcon = StopCircle;
      result.isEstimated = false;
    }

    return result;
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

  // Compact List View
  const CompactListView = () => (
    <div className="space-y-2">
      {filteredJobs.map((job, index) => {
        const StatusIcon = job.icon;
        const dateInfo = formatDate(job.orderDate);
        const timeInfo = getTimeInfo(job);
        
        return (
          <div key={`${job.jobId}-${job.orderDate}`} 
               className={`border-l-4 ${job.borderColor} bg-white rounded-r-lg shadow-sm hover:shadow-md transition-all duration-200`}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <StatusIcon className={`w-5 h-5 ${job.statusColor}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.statusColor} ${job.bgColor}`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <timeInfo.startIcon className="w-3 h-3" />
                        <span className={timeInfo.isEstimated && timeInfo.startLabel.includes('Est') ? 'italic text-blue-600' : ''}>{timeInfo.startLabel}: {timeInfo.startTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <timeInfo.endIcon className="w-3 h-3" />
                        <span className={timeInfo.isEstimated || timeInfo.endLabel.includes('Est') ? 'italic text-blue-600' : ''}>{timeInfo.endLabel}: {timeInfo.endTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{job.numberOfRuns} runs</span>
                  <div className="flex space-x-1">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                    {job.hasScriptLog && (
                      <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {job.waitingEvents.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.waitingEvents.slice(0, 3).map((event, i) => (
                    <span key={i} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-mono">
                      {event}
                    </span>
                  ))}
                  {job.waitingEvents.length > 3 && (
                    <span className="text-xs text-gray-500 px-2">+{job.waitingEvents.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Detailed Card View
  const DetailedCardView = () => (
    <div className="space-y-4">
      {filteredJobs.map((job, index) => {
        const StatusIcon = job.icon;
        const dateInfo = formatDate(job.orderDate);
        const timeInfo = getTimeInfo(job);
        
        return (
          <div key={`${job.jobId}-${job.orderDate}`} 
               className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${job.bgColor}`}>
                    <StatusIcon className={`w-5 h-5 ${job.statusColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${job.statusColor} ${job.bgColor} border ${job.borderColor}`}>
                        {job.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(job.priority)}`}>
                        {job.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{dateInfo.full}</p>
                  <p className="text-xs text-gray-500">{job.owner}</p>
                </div>
              </div>

              {/* Timing Information */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <timeInfo.startIcon className="w-4 h-4 text-gray-500" />
                    <p className={`text-xs text-gray-500 uppercase tracking-wide ${timeInfo.isEstimated && timeInfo.startLabel.includes('Est') ? 'italic' : ''}`}>
                      {timeInfo.startLabel}
                    </p>
                  </div>
                  <p className={`text-sm font-mono text-gray-900 ${timeInfo.isEstimated && timeInfo.startLabel.includes('Est') ? 'italic text-blue-600' : ''}`}>
                    {timeInfo.startTime}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <timeInfo.endIcon className="w-4 h-4 text-gray-500" />
                    <p className={`text-xs text-gray-500 uppercase tracking-wide ${timeInfo.isEstimated || timeInfo.endLabel.includes('Est') ? 'italic' : ''}`}>
                      {timeInfo.endLabel}
                    </p>
                  </div>
                  <p className={`text-sm font-mono text-gray-900 ${timeInfo.isEstimated || timeInfo.endLabel.includes('Est') ? 'italic text-blue-600' : ''}`}>
                    {timeInfo.endTime}
                  </p>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Runs</p>
                  <p className="text-lg font-semibold text-gray-900">{job.numberOfRuns}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                  <p className="text-lg font-mono text-gray-900">{job.duration || job.estimatedDuration || '—'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Owner</p>
                  <p className="text-sm font-mono text-gray-900">{job.owner}</p>
                </div>
              </div>

              {/* Waiting Events */}
              {job.waitingEvents.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Waiting for Events:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.waitingEvents.map((event, i) => (
                      <span key={i} className="bg-yellow-100 border border-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full font-mono">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Info */}
              {job.errorCode && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Error Code:</span>
                    <span className="font-mono text-sm text-red-900">{job.errorCode}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex space-x-3">
                  <button className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <FileText className="w-4 h-4 mr-2" />
                    Job Logs
                  </button>
                  {job.hasScriptLog && (
                    <button className="inline-flex items-center px-4 py-2 border border-green-300 text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Script Log
                    </button>
                  )}
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Timeline View
  const TimelineView = () => (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="space-y-6">
        {filteredJobs.map((job, index) => {
          const StatusIcon = job.icon;
          const dateInfo = formatDate(job.orderDate);
          const timeInfo = getTimeInfo(job);
          
          return (
            <div key={`${job.jobId}-${job.orderDate}`} className="relative flex items-start space-x-6">
              {/* Timeline dot */}
              <div className={`flex-shrink-0 w-4 h-4 rounded-full ${job.bgColor} border-2 ${job.borderColor} z-10`}>
                <StatusIcon className={`w-2.5 h-2.5 ${job.statusColor} m-0.5`} />
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${job.statusColor} ${job.bgColor}`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center space-x-1">
                        <timeInfo.startIcon className="w-3 h-3" />
                        <span className={timeInfo.isEstimated && timeInfo.startLabel.includes('Est') ? 'italic text-blue-600' : ''}>{timeInfo.startLabel}: {timeInfo.startTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <timeInfo.endIcon className="w-3 h-3" />
                        <span className={timeInfo.isEstimated || timeInfo.endLabel.includes('Est') ? 'italic text-blue-600' : ''}>{timeInfo.endLabel}: {timeInfo.endTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Activity className="w-3 h-3" />
                        <span>{job.numberOfRuns} runs</span>
                      </span>
                    </div>

                    {job.waitingEvents.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.waitingEvents.slice(0, 2).map((event, i) => (
                          <span key={i} className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded font-mono">
                            {event}
                          </span>
                        ))}
                        {job.waitingEvents.length > 2 && (
                          <span className="text-xs text-gray-500">+{job.waitingEvents.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    {job.hasScriptLog && (
                      <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Status Summary View
  const StatusSummaryView = () => {
    const statusGroups = filteredJobs.reduce((acc, job) => {
      if (!acc[job.status]) acc[job.status] = [];
      acc[job.status].push(job);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        {Object.entries(statusGroups).map(([status, jobs]) => {
          const firstJob = jobs[0];
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className={`px-6 py-4 ${firstJob.bgColor} border-b border-gray-200 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <firstJob.icon className={`w-5 h-5 ${firstJob.statusColor}`} />
                    <h3 className={`text-lg font-semibold ${firstJob.statusColor}`}>{status}</h3>
                  </div>
                  <span className="text-sm text-gray-600">{jobs.length} executions</span>
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                {jobs.map((job, index) => {
                  const timeInfo = getTimeInfo(job);
                  return (
                    <div key={`${job.jobId}-${job.orderDate}`} 
                         className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(job.priority)}`}>
                            {job.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                          <span className={timeInfo.isEstimated && timeInfo.startLabel.includes('Est') ? 'italic text-blue-600' : ''}>{timeInfo.startLabel}: {timeInfo.startTime}</span>
                          <span className={timeInfo.isEstimated || timeInfo.endLabel.includes('Est') ? 'italic text-blue-600' : ''}>{timeInfo.endLabel}: {timeInfo.endTime}</span>
                        </div>
                        {job.waitingEvents.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {job.waitingEvents.slice(0, 2).map((event, i) => (
                              <span key={i} className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded font-mono">
                                {event}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{job.numberOfRuns} runs</span>
                        <div className="flex space-x-1">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          {job.hasScriptLog && (
                            <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            DAILY_BATCH_PROCESS - Execution History
          </h1>
          <p className="text-gray-600 mt-1">Historical executions for this Control-M job</p>
        </div>

        {/* Filters and Controls */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="ended">Ended OK</option>
                <option value="failed">Failed</option>
                <option value="waiting">Waiting Condition</option>
                <option value="executing">Executing</option>
                <option value="abended">Abended</option>
              </select>
            </div>

            {/* View Mode Selector */}
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'compact' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Compact
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'detailed' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Detailed
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'timeline' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('status')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'status' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                By Status
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredJobs.length} of {jobExecutions.length} executions
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {viewMode === 'compact' && <CompactListView />}
        {viewMode === 'detailed' && <DetailedCardView />}
        {viewMode === 'timeline' && <TimelineView />}
        {viewMode === 'status' && <StatusSummaryView />}
        
        {filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-gray-500 mb-2">No executions found</div>
            <div className="text-sm text-gray-400">
              Try adjusting your search terms or filters
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlMJobHistory;
