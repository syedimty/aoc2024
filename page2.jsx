import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  FileText,
  Terminal,
  Copy,
  X,
  ExternalLink,
  RefreshCw,
  Wifi,
  WifiOff,
  Check,
  Hourglass
} from 'lucide-react';

const ControlMDashboard = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [logModal, setLogModal] = useState({ open: false, jobId: null, logType: 'job', runId: null });
  const [detailsModal, setDetailsModal] = useState({ open: false, jobId: null });
  
  // Auto-refresh states
  const [refreshState, setRefreshState] = useState({
    jobStatus: { loading: false, lastUpdate: new Date(), error: false },
    eventStatus: { loading: false, lastUpdate: new Date(), error: false }
  });
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const refreshJobStatus = async () => {
      setRefreshState(prev => ({
        ...prev,
        jobStatus: { ...prev.jobStatus, loading: true }
      }));
      
      // Simulate API call delay
      setTimeout(() => {
        setRefreshState(prev => ({
          ...prev,
          jobStatus: { loading: false, lastUpdate: new Date(), error: false }
        }));
      }, 1500);
    };

    const refreshEventStatus = async () => {
      setRefreshState(prev => ({
        ...prev,
        eventStatus: { ...prev.eventStatus, loading: true }
      }));
      
      // Simulate API call delay
      setTimeout(() => {
        setRefreshState(prev => ({
          ...prev,
          eventStatus: { loading: false, lastUpdate: new Date(), error: false }
        }));
      }, 1200);
    };

    // Initial load
    refreshJobStatus();
    refreshEventStatus();

    // Set up intervals - job status every 30 seconds, events every 15 seconds
    const jobStatusInterval = setInterval(refreshJobStatus, 30000);
    const eventStatusInterval = setInterval(refreshEventStatus, 15000);

    return () => {
      clearInterval(jobStatusInterval);
      clearInterval(eventStatusInterval);
    };
  }, [autoRefreshEnabled]);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const isLoading = refreshState.jobStatus.loading || refreshState.eventStatus.loading;

  // Mock data - ready for Control-M API integration
  const jobs = [
    {
      id: 'JOB001',
      name: 'Daily_Sales_ETL',
      description: 'Extract sales data and load into warehouse',
      status: 'Completed',
      lastSuccessful: '2025-08-01 06:30:15',
      nextRun: '2025-08-02 06:00:00',
      hasScriptLogs: true,
      waitingEvents: [],
      executionHistory: [
        { runId: 'JOB001_20250801_001', startTime: '06:00:15', duration: '29m 45s', status: 'Completed', exitCode: 0 },
        { runId: 'JOB001_20250731_001', startTime: '06:00:12', duration: '31m 22s', status: 'Completed', exitCode: 0 },
        { runId: 'JOB001_20250730_001', startTime: '06:00:18', duration: '28m 15s', status: 'Failed', exitCode: 1 },
      ]
    },
    {
      id: 'JOB002',
      name: 'Customer_Data_Sync',
      description: 'Synchronize customer data across systems',
      status: 'Running',
      lastSuccessful: '2025-07-31 14:22:08',
      nextRun: '2025-08-01 15:00:00',
      hasScriptLogs: true,
      waitingEvents: [],
      executionHistory: [
        { runId: 'JOB002_20250801_001', startTime: '14:22:30', duration: '12m 45s', status: 'Running', exitCode: null },
        { runId: 'JOB002_20250731_001', startTime: '14:22:08', duration: '15m 33s', status: 'Completed', exitCode: 0 },
      ]
    },
    {
      id: 'JOB003',
      name: 'Report_Generation',
      description: 'Generate monthly financial reports',
      status: 'Waiting',
      lastSuccessful: '2025-07-30 09:15:42',
      nextRun: '2025-08-01 09:00:00',
      hasScriptLogs: false,
      waitingEvents: [
        { name: 'FILE_RECEIVED', expectedDate: '2025-08-01', status: 'received' },
        { name: 'DB_BACKUP_COMPLETE', expectedDate: '2025-08-01', status: 'received' },
        { name: 'APPROVAL_GRANTED', expectedDate: '2025-08-02', status: 'pending' }
      ],
      executionHistory: [
        { runId: 'JOB003_20250730_001', startTime: '09:15:42', duration: '45m 12s', status: 'Completed', exitCode: 0 },
      ]
    },
    {
      id: 'JOB004',
      name: 'Data_Validation',
      description: 'Validate data integrity checks',
      status: 'Failed',
      lastSuccessful: '2025-07-29 11:30:15',
      nextRun: '2025-08-01 12:00:00',
      hasScriptLogs: true,
      waitingEvents: [],
      executionHistory: [
        { runId: 'JOB004_20250801_001', startTime: '11:30:22', duration: '5m 15s', status: 'Failed', exitCode: 2 },
        { runId: 'JOB004_20250729_001', startTime: '11:30:15', duration: '22m 45s', status: 'Completed', exitCode: 0 },
      ]
    },
    {
      id: 'JOB005',
      name: 'Scheduled_Maintenance',
      description: 'System maintenance and cleanup tasks',
      status: 'Scheduled',
      lastSuccessful: '2025-07-28 02:00:00',
      nextRun: '2025-08-02 02:00:00',
      hasScriptLogs: true,
      waitingEvents: [
        { name: 'MAINTENANCE_WINDOW', expectedDate: '2025-08-02', status: 'pending' }
      ],
      executionHistory: [
        { runId: 'JOB005_20250728_001', startTime: '02:00:00', duration: '1h 15m', status: 'Completed', exitCode: 0 },
      ]
    }
  ];

  const getStatusBadge = (status) => {
    const configs = {
      'Completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Running': { color: 'bg-blue-100 text-blue-800', icon: Play },
      'Waiting': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'Failed': { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      'Scheduled': { color: 'bg-purple-100 text-purple-800', icon: Calendar }
    };
    
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const generateJobLogs = (jobId, runId) => {
    return `[2025-08-01 06:00:15] INFO: Job ${jobId} submitted to Control-M server
[2025-08-01 06:00:16] INFO: Job assigned to agent CTMAG001
[2025-08-01 06:00:17] INFO: Checking job prerequisites...
[2025-08-01 06:00:18] INFO: All prerequisites satisfied
[2025-08-01 06:00:19] INFO: Job ${runId} started execution
[2025-08-01 06:15:32] INFO: Job progress: 50% complete
[2025-08-01 06:28:45] INFO: Job progress: 90% complete
[2025-08-01 06:30:15] INFO: Job completed successfully
[2025-08-01 06:30:16] INFO: Job statistics - CPU: 245s, Memory: 512MB, I/O: 1.2GB
[2025-08-01 06:30:17] INFO: Job output transferred to spool`;
  };

  const generateScriptLogs = (jobId, runId) => {
    return `#!/bin/bash
# Control-M Job Script: ${jobId}
# Run ID: ${runId}
# Execution started: 2025-08-01 06:00:19

set -e  # Exit on any error
export CTMJOB=${jobId}
export RUNID=${runId}
export LOGDIR=/opt/controlm/logs

echo "=== Job ${jobId} Starting ==="
echo "Run ID: ${runId}"
echo "Timestamp: $(date)"
echo "User: $(whoami)"
echo "Host: $(hostname)"

# Initialize environment
source /opt/controlm/scripts/common_functions.sh
validate_environment

echo "Processing data files..."
for file in /data/input/*.dat; do
    if [[ -f "$file" ]]; then
        echo "Processing: $file"
        process_file "$file"
        if [[ $? -eq 0 ]]; then
            echo "✓ Successfully processed: $file"
        else
            echo "✗ Failed to process: $file"
            exit 1
        fi
    fi
done

echo "Updating database records..."
mysql -h db-server -u etl_user -p$DB_PASSWORD << EOF
UPDATE job_status SET 
    last_run = NOW(), 
    status = 'completed',
    records_processed = 15420
WHERE job_name = '${jobId}';
EOF

echo "=== Job ${jobId} Completed Successfully ==="
echo "Records processed: 15,420"
echo "Execution time: 29m 45s"
echo "Exit code: 0"

exit 0`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openLogModal = (jobId, logType, runId = null) => {
    setLogModal({ open: true, jobId, logType, runId });
  };

  const openDetailsModal = (jobId) => {
    setDetailsModal({ open: true, jobId });
  };

  const selectedJobData = jobs.find(job => job.id === detailsModal.jobId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-blue-200">
            <div className="h-1 bg-blue-600 animate-pulse" style={{
              width: refreshState.jobStatus.loading && refreshState.eventStatus.loading ? '100%' : '60%',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Control-M Jobs Monitor</h1>
              <p className="text-gray-600 mt-1">Monitor and analyze job executions with detailed logging</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Auto-refresh status and controls */}
              <div className="flex items-center space-x-2 text-sm bg-white px-3 py-2 rounded-lg border">
                <button
                  onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                  className={`flex items-center ${autoRefreshEnabled ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {autoRefreshEnabled ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                </button>
                <div className="text-xs text-gray-500">
                  <div>Jobs: {formatTimeAgo(refreshState.jobStatus.lastUpdate)}</div>
                  <div>Events: {formatTimeAgo(refreshState.eventStatus.lastUpdate)}</div>
                </div>
              </div>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Manual Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Active Jobs</h2>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${refreshState.jobStatus.loading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                  Job Status: {formatTimeAgo(refreshState.jobStatus.lastUpdate)}
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${refreshState.eventStatus.loading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                  Event Status: {formatTimeAgo(refreshState.eventStatus.lastUpdate)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Job Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Last Successful
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Waiting Events
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <button
                          onClick={() => openDetailsModal(job.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          {job.name}
                        </button>
                        <p className="text-sm text-gray-500">{job.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.lastSuccessful}
                    </td>
                    <td className="px-6 py-4">
                      {job.waitingEvents.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Waiting Events
                          </div>
                          {job.waitingEvents.map((event, idx) => (
                            <div key={idx} className={`rounded-lg p-3 text-sm relative border ${
                              event.status === 'received' 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-orange-50 border-orange-200'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {event.status === 'received' ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Hourglass className="w-4 h-4 text-orange-600" />
                                  )}
                                  <div className={`font-medium ${
                                    event.status === 'received' ? 'text-green-800' : 'text-orange-800'
                                  }`}>
                                    {event.name}
                                  </div>
                                </div>
                              </div>
                              <div className={`text-xs mt-1 ml-6 ${
                                event.status === 'received' ? 'text-green-600' : 'text-orange-600'
                              }`}>
                                {event.expectedDate}
                              </div>
                              {refreshState.eventStatus.loading && (
                                <div className="absolute top-2 right-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Waiting Events
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm relative">
                            <div className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <div className="font-medium text-green-800">All Events Complete</div>
                            </div>
                            <div className="text-xs text-green-600 mt-1 ml-6">Ready to execute</div>
                            {refreshState.eventStatus.loading && (
                              <div className="absolute top-2 right-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openLogModal(job.id, 'job')}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Job Logs
                      </button>
                      {job.hasScriptLogs && (
                        <button
                          onClick={() => openLogModal(job.id, 'script')}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50"
                        >
                          <Terminal className="w-4 h-4 mr-1" />
                          Script Logs
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Job Details Modal */}
        {detailsModal.open && selectedJobData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-xl font-semibold">{selectedJobData.name}</h3>
                  <p className="text-gray-600">{selectedJobData.description}</p>
                </div>
                <button
                  onClick={() => setDetailsModal({ open: false, jobId: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Overview */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Overview</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Current Status</div>
                      <div className="mt-1">{getStatusBadge(selectedJobData.status)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Last Successful</div>
                      <div className="mt-1 text-sm font-medium">{selectedJobData.lastSuccessful}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Next Run</div>
                      <div className="mt-1 text-sm font-medium">{selectedJobData.nextRun}</div>
                    </div>
                  </div>
                </div>

                {/* Waiting Events */}
                {selectedJobData.waitingEvents.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold">Current Waiting Events</h4>
                      <div className="text-xs text-gray-500 flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${refreshState.eventStatus.loading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                        Updated {formatTimeAgo(refreshState.eventStatus.lastUpdate)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {selectedJobData.waitingEvents.map((event, idx) => (
                        <div key={idx} className={`rounded-lg p-4 relative border ${
                          event.status === 'received' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-orange-50 border-orange-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {event.status === 'received' ? (
                                <Check className="w-5 h-5 text-green-600" />
                              ) : (
                                <Hourglass className="w-5 h-5 text-orange-600" />
                              )}
                              <div>
                                <div className={`font-medium ${
                                  event.status === 'received' ? 'text-green-800' : 'text-orange-800'
                                }`}>
                                  {event.name}
                                </div>
                                <div className={`text-sm ${
                                  event.status === 'received' ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                  {event.expectedDate}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                event.status === 'received' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {event.status}
                              </span>
                              {refreshState.eventStatus.loading && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Execution History */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Execution History (Last 10 runs)</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Run ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exit Code</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logs</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedJobData.executionHistory.map((run, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 text-sm font-mono">{run.runId}</td>
                            <td className="px-4 py-3 text-sm">{run.startTime}</td>
                            <td className="px-4 py-3 text-sm">{run.duration}</td>
                            <td className="px-4 py-3">{getStatusBadge(run.status)}</td>
                            <td className="px-4 py-3 text-sm font-mono">{run.exitCode ?? 'N/A'}</td>
                            <td className="px-4 py-3 space-x-2">
                              <button
                                onClick={() => openLogModal(selectedJobData.id, 'job', run.runId)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Job
                              </button>
                              {selectedJobData.hasScriptLogs && (
                                <button
                                  onClick={() => openLogModal(selectedJobData.id, 'script', run.runId)}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Script
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Log Modal */}
        {logModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">
                    {logModal.logType === 'job' ? 'Job Logs' : 'Script Logs'} - {logModal.jobId}
                  </h3>
                  {logModal.runId && (
                    <span className="text-sm text-gray-500 font-mono">Run: {logModal.runId}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(
                      logModal.logType === 'job' 
                        ? generateJobLogs(logModal.jobId, logModal.runId || `${logModal.jobId}_current`)
                        : generateScriptLogs(logModal.jobId, logModal.runId || `${logModal.jobId}_current`)
                    )}
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                  <button
                    onClick={() => setLogModal({ open: false, jobId: null, logType: 'job', runId: null })}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                  {logModal.logType === 'job' 
                    ? generateJobLogs(logModal.jobId, logModal.runId || `${logModal.jobId}_current`)
                    : generateScriptLogs(logModal.jobId, logModal.runId || `${logModal.jobId}_current`)
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlMDashboard;
