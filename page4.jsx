import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Play, 
  Settings, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  Info,
  Activity,
  Database,
  Zap
} from 'lucide-react';

const ControlMJobDashboard = () => {
  const [expandedSections, setExpandedSections] = useState({
    scheduling: true,
    events: true,
    parameters: true,
    description: true,
    execution: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Sample job data
  const jobData = {
    title: "DATA_PROCESSING_BATCH",
    name: "Daily Customer Data Processing",
    description: "Processes customer transaction data and updates analytics tables",
    startTime: "02:00 AM",
    frequency: "Daily",
    interval: "24 hours",
    addEvents: [
      { name: "DATA_PROCESSED", waitingJobs: ["REPORT_GENERATION", "EMAIL_NOTIFICATION"] },
      { name: "BATCH_COMPLETE", waitingJobs: ["CLEANUP_JOB"] }
    ],
    emittedEvents: [
      { name: "START_PROCESSING", emittingJobs: ["DATA_VALIDATION", "FILE_CHECK"] }
    ],
    parameters: [
      { name: "SOURCE_PATH", description: "Path to source data files", value: "/data/customer/raw/" },
      { name: "BATCH_SIZE", description: "Number of records to process per batch", value: "10000" },
      { name: "LOG_LEVEL", description: "Logging verbosity level", value: "INFO" }
    ],
    longDescription: "This job orchestrates the daily processing of customer transaction data. It reads raw transaction files from the source directory, validates the data integrity, transforms the records according to business rules, and loads the processed data into the analytics database. The job includes error handling for malformed records and generates comprehensive logs for audit purposes. Upon successful completion, it triggers downstream processes for report generation and customer notifications.",
    executionDetails: [
      { status: 0, description: "Job initialization and parameter validation completed" },
      { status: 50, description: "Data extraction and validation phase completed, transformation in progress" },
      { status: 100, description: "All processing completed successfully, database updated" }
    ]
  };

  const StatusBadge = ({ status, children }) => {
    const statusColors = {
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status] || statusColors.info}`}>
        {children}
      </span>
    );
  };

  const SectionHeader = ({ icon: Icon, title, section, count }) => (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {count && (
          <StatusBadge status="info">{count}</StatusBadge>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      )}
    </div>
  );

  const ExecutionProgress = ({ status, description }) => {
    const getStatusIcon = (status) => {
      if (status === 0) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      if (status === 50) return <Activity className="h-4 w-4 text-yellow-500" />;
      if (status === 100) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
    };

    const getProgressWidth = (status) => {
      return `${status}%`;
    };

    return (
      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
        {getStatusIcon(status)}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Status {status}%</span>
            <span className="text-xs text-gray-500">{status === 100 ? 'Complete' : status === 0 ? 'Initialized' : 'In Progress'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                status === 100 ? 'bg-green-500' : status > 0 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: getProgressWidth(status) }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Database className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{jobData.title}</h1>
          <StatusBadge status="success">Active</StatusBadge>
        </div>
        <h2 className="text-xl text-gray-600 mb-2">{jobData.name}</h2>
        <p className="text-gray-500">{jobData.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Scheduling Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader icon={Clock} title="Scheduling Information" section="scheduling" />
            {expandedSections.scheduling && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Play className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Start Time</p>
                      <p className="text-lg font-semibold text-blue-600">{jobData.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Frequency</p>
                      <p className="text-lg font-semibold text-green-600">{jobData.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Interval</p>
                      <p className="text-lg font-semibold text-purple-600">{jobData.interval}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Events */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader icon={Zap} title="Events" section="events" count={`${jobData.addEvents.length + jobData.emittedEvents.length} total`} />
            {expandedSections.events && (
              <div className="p-4 space-y-6">
                
                {/* Events Added by this Job */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                    Events Added by this Job
                  </h4>
                  <div className="space-y-3">
                    {jobData.addEvents.map((event, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-800">{event.name}</span>
                          <StatusBadge status="success">{event.waitingJobs.length} waiting</StatusBadge>
                        </div>
                        <p className="text-sm text-green-700 mb-2">Jobs waiting for this event:</p>
                        <div className="flex flex-wrap gap-2">
                          {event.waitingJobs.map((job, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white text-green-800 rounded text-xs border border-green-300">
                              {job}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Events Emitted */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2 text-blue-500 rotate-180" />
                    Events This Job Waits For
                  </h4>
                  <div className="space-y-3">
                    {jobData.emittedEvents.map((event, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-800">{event.name}</span>
                          <StatusBadge status="info">{event.emittingJobs.length} emitters</StatusBadge>
                        </div>
                        <p className="text-sm text-blue-700 mb-2">Jobs that emit this event:</p>
                        <div className="flex flex-wrap gap-2">
                          {event.emittingJobs.map((job, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white text-blue-800 rounded text-xs border border-blue-300">
                              {job}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Job Parameters */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader icon={Settings} title="Input Parameters" section="parameters" count={jobData.parameters.length} />
            {expandedSections.parameters && (
              <div className="p-4">
                <div className="space-y-3">
                  {jobData.parameters.map((param, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">{param.name}</h5>
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm font-mono">
                          {param.value}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{param.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Description & Execution */}
        <div className="space-y-6">
          
          {/* Detailed Description */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader icon={Info} title="Detailed Description" section="description" />
            {expandedSections.description && (
              <div className="p-4">
                <p className="text-gray-700 leading-relaxed">{jobData.longDescription}</p>
              </div>
            )}
          </div>

          {/* Execution Details */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader icon={Activity} title="Execution Details" section="execution" />
            {expandedSections.execution && (
              <div className="p-4 space-y-4">
                {jobData.executionDetails.map((detail, index) => (
                  <ExecutionProgress 
                    key={index}
                    status={detail.status}
                    description={detail.description}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Run Now</span>
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Edit Job</span>
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>View Logs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlMJobDashboard;
