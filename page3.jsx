import React from 'react';
import { 
  Clock, 
  Calendar, 
  Play, 
  Settings, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  Activity,
  Database,
  Zap,
  MoreHorizontal,
  FileText,
  Terminal
} from 'lucide-react';

const ControlMJobDashboard = () => {
  // Sample job data
  const jobData = {
    title: "DATA_PROCESSING_BATCH",
    name: "Daily Customer Data Processing",
    description: "Processes customer transaction data and updates analytics tables",
    startTime: "02:00 AM",
    frequency: "Daily",
    interval: "24 hours",
    status: "Running",
    nextRun: "Tomorrow 02:00 AM",
    lastRun: "Success - 45min ago",
    addEvents: [
      { name: "DATA_PROCESSED", waitingJobs: ["REPORT_GENERATION", "EMAIL_NOTIFICATION", "ARCHIVE_JOB"] },
      { name: "BATCH_COMPLETE", waitingJobs: ["CLEANUP_JOB", "AUDIT_LOG"] }
    ],
    emittedEvents: [
      { name: "START_PROCESSING", emittingJobs: ["DATA_VALIDATION", "FILE_CHECK"] },
      { name: "DB_READY", emittingJobs: ["DATABASE_INIT"] }
    ],
    parameters: [
      { name: "SOURCE_PATH", description: "Path to source data files", value: "/data/customer/raw/" },
      { name: "BATCH_SIZE", description: "Number of records to process per batch", value: "10000" },
      { name: "LOG_LEVEL", description: "Logging verbosity level", value: "INFO" },
      { name: "RETRY_COUNT", description: "Number of retry attempts on failure", value: "3" },
      { name: "TIMEOUT", description: "Maximum execution timeout in minutes", value: "120" }
    ],
    longDescription: "This job orchestrates the daily processing of customer transaction data. It reads raw transaction files from the source directory, validates the data integrity, transforms the records according to business rules, and loads the processed data into the analytics database. The job includes error handling for malformed records and generates comprehensive logs for audit purposes.",
    executionDetails: [
      { status: 0, description: "Job completed successfully - all operations finished without errors", timestamp: "02:42:18", step: "Final Status" },
      { status: 50, description: "Job is currently running - data validation and transformation in progress", timestamp: "02:15:45", step: "In Progress" },
      { status: 101, description: "Job failed due to database connection timeout", timestamp: "01:45:32", step: "Error State" },
      { status: 102, description: "Job terminated by user request", timestamp: "01:30:15", step: "User Action" },
      { status: 150, description: "Job waiting for file dependency to be available", timestamp: "02:00:00", step: "Waiting" }
    ]
  };

  const StatusBadge = ({ status, size = "sm" }) => {
    const colors = {
      Running: 'bg-blue-500 text-white',
      Success: 'bg-green-500 text-white',
      Failed: 'bg-red-500 text-white',
      Waiting: 'bg-yellow-500 text-white'
    };
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm'
    };
    
    return (
      <span className={`inline-flex items-center rounded-full font-medium ${colors[status]} ${sizes[size]}`}>
        {status}
      </span>
    );
  };

  const EventTable = ({ title, events, type }) => (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {type === 'add' ? 'Waiting Jobs' : 'Emitting Jobs'}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((event, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{event.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <div className="flex flex-wrap gap-1">
                    {(type === 'add' ? event.waitingJobs : event.emittingJobs).slice(0, 3).map((job, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {job}
                      </span>
                    ))}
                    {(type === 'add' ? event.waitingJobs : event.emittingJobs).length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                        +{(type === 'add' ? event.waitingJobs : event.emittingJobs).length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {type === 'add' ? event.waitingJobs.length : event.emittingJobs.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ParameterTable = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {jobData.parameters.map((param, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{param.name}</td>
              <td className="px-4 py-3 text-sm font-mono text-blue-600 bg-blue-50">{param.value}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ExecutionTimeline = () => {
    const getStatusIcon = (status) => {
      if (status === 0) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      if (status === 50) return <Activity className="h-5 w-5 text-blue-500" />;
      if (status > 100) return <AlertCircle className="h-5 w-5 text-red-500" />;
      if (status === 150) return <Clock className="h-5 w-5 text-yellow-500" />;
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    };

    const getStatusColor = (status) => {
      if (status === 0) return "text-green-600 bg-green-50";
      if (status === 50) return "text-blue-600 bg-blue-50";
      if (status > 100) return "text-red-600 bg-red-50";
      if (status === 150) return "text-yellow-600 bg-yellow-50";
      return "text-gray-600 bg-gray-50";
    };

    const getStatusLabel = (status) => {
      const statusMap = {
        0: "SUCCESS",
        50: "RUNNING", 
        101: "FAILED",
        102: "KILLED",
        150: "WAITING"
      };
      return statusMap[status] || `CODE_${status}`;
    };

    const handleJobLogs = (status, timestamp) => {
      console.log(`Opening job logs for status ${status} at ${timestamp}`);
      // In real implementation, this would open job logs
    };

    const handleScriptLogs = (status, timestamp) => {
      console.log(`Opening script logs for status ${status} at ${timestamp}`);
      // In real implementation, this would open script logs
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Execution Status History</h3>
        <div className="space-y-3">
          {jobData.executionDetails.map((detail, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg border border-gray-100">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className={`px-2 py-1 rounded text-xs font-mono font-bold ${getStatusColor(detail.status)}`}>
                  {detail.status}
                </div>
                <div className="mt-1">
                  {getStatusIcon(detail.status)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {getStatusLabel(detail.status)}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{detail.step}</span>
                </div>
                <p className="text-sm text-gray-900 leading-relaxed mb-2">{detail.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{detail.timestamp}</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleJobLogs(detail.status, detail.timestamp)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Job Logs
                    </button>
                    <button
                      onClick={() => handleScriptLogs(detail.status, detail.timestamp)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Terminal className="h-3 w-3 mr-1" />
                      Script Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{jobData.title}</h1>
              <p className="text-gray-600">{jobData.name}</p>
            </div>
            <StatusBadge status={jobData.status} size="md" />
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Run Now</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        
        {/* Quick Stats */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Start:</span>
              <span className="font-medium ml-2">{jobData.startTime}</span>
              <span className="text-gray-500 ml-1">({jobData.frequency})</span>
            </div>
            <div>
              <span className="text-gray-600">Next:</span>
              <span className="font-medium ml-2">Tomorrow 02:00 AM</span>
            </div>
            <div>
              <span className="text-gray-600">Last:</span>
              <span className="font-medium text-green-600 ml-2">Success</span>
              <span className="text-gray-500 ml-1">(45min ago)</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2"><StatusBadge status={jobData.status} size="sm" /></span>
            </div>
          </div>
        </div>

        {/* All Content - No Tabs */}
        <div className="space-y-6">
          
          {/* Job Description - First */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
            <p className="text-gray-700 mb-3">{jobData.description}</p>
            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Detailed Description</h4>
              <p className="text-sm text-gray-600">{jobData.longDescription}</p>
            </div>
          </div>

          {/* Execution Timeline */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Execution Status</h2>
            <ExecutionTimeline />
          </div>

          {/* Events Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EventTable 
                title="Events Added by This Job" 
                events={jobData.addEvents} 
                type="add" 
              />
              <EventTable 
                title="Events This Job Waits For" 
                events={jobData.emittedEvents} 
                type="emit" 
              />
            </div>
          </div>

          {/* Parameters Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Input Parameters</h2>
            <ParameterTable />
          </div>

          {/* Execution Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Execution Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExecutionTimeline />
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Code Reference</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-green-600 bg-green-50 px-2 py-1 rounded">0</span>
                        <span className="text-gray-700">Success</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">50</span>
                        <span className="text-gray-700">Running</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-red-600 bg-red-50 px-2 py-1 rounded">101+</span>
                        <span className="text-gray-700">Error Codes</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-yellow-600 bg-yellow-50 px-2 py-1 rounded">150</span>
                        <span className="text-gray-700">Waiting</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-red-600 bg-red-50 px-2 py-1 rounded">102</span>
                        <span className="text-gray-700">Killed</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Current Status</h4>
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <div>
                        <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">50</span>
                        <span className="ml-2 text-sm text-gray-700">Job is currently running</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlMJobDashboard;
