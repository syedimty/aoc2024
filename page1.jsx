import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, XCircle, AlertCircle, FileText, Terminal } from 'lucide-react';

const ControlMMonitor = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logType, setLogType] = useState('');
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJobHistory, setSelectedJobHistory] = useState(null);
  const [selectedRun, setSelectedRun] = useState(null);

  // Mock data
  useEffect(() => {
    const mockJobs = [
      {
        id: 'JOB001',
        name: 'Daily_ETL_Process',
        description: 'Daily ETL process for customer data extraction and transformation',
        lastSuccessful: '2025-08-01 06:30:15',
        currentStatus: 'Completed',
        waitingEvents: [
          { name: 'FILE_RECEIVED', present: true, expectedDate: '2025-08-01' },
          { name: 'DB_BACKUP_COMPLETE', present: true, expectedDate: '2025-08-01' },
          { name: 'APPROVAL_GRANTED', present: false, expectedDate: '2025-08-02' }
        ],
        nextRun: '2025-08-02 06:00:00',
        hasScriptLogs: true
      },
      {
        id: 'JOB002',
        name: 'Weekly_Report_Gen',
        description: 'Generate weekly business reports and send to stakeholders',
        lastSuccessful: '2025-07-29 08:45:22',
        currentStatus: 'Waiting',
        waitingEvents: [
          { name: 'WEEK_END_MARKER', present: false, expectedDate: '2025-08-04' },
          { name: 'DATA_VALIDATION_OK', present: true, expectedDate: '2025-08-01' }
        ],
        nextRun: '2025-08-05 08:00:00',
        hasScriptLogs: false
      },
      {
        id: 'JOB003',
        name: 'Inventory_Sync',
        description: 'Synchronize inventory data between systems',
        lastSuccessful: '2025-08-01 12:15:30',
        currentStatus: 'Running',
        waitingEvents: [
          { name: 'SYSTEM_READY', present: true, expectedDate: '2025-08-01' }
        ],
        nextRun: '2025-08-01 18:00:00',
        hasScriptLogs: true
      },
      {
        id: 'JOB004',
        name: 'Security_Audit',
        description: 'Run security audit and compliance checks',
        lastSuccessful: '2025-07-31 23:59:45',
        currentStatus: 'Failed',
        waitingEvents: [
          { name: 'MAINTENANCE_WINDOW', present: true, expectedDate: '2025-08-01' },
          { name: 'SECURITY_CLEARANCE', present: false, expectedDate: '2025-08-02' }
        ],
        nextRun: '2025-08-01 23:30:00',
        hasScriptLogs: true
      },
      {
        id: 'JOB005',
        name: 'Backup_Archive',
        description: 'Archive old backup files to long-term storage',
        lastSuccessful: '2025-08-01 02:30:00',
        currentStatus: 'Scheduled',
        waitingEvents: [
          { name: 'STORAGE_AVAILABLE', present: true, expectedDate: '2025-08-01' },
          { name: 'BACKUP_COMPLETE', present: true, expectedDate: '2025-08-01' }
        ],
        nextRun: '2025-08-02 02:00:00',
        hasScriptLogs: false
      }
    ];
    setJobs(mockJobs);
  }, []);

  const generateJobHistory = (job) => {
    const history = [];
    const baseDate = new Date(job.lastSuccessful);
    
    for (let i = 0; i < 10; i++) {
      const runDate = new Date(baseDate.getTime() - (i * 24 * 60 * 60 * 1000));
      const statuses = ['Completed', 'Failed', 'Aborted', 'Completed', 'Completed'];
      const randomStatus = i === 0 ? job.currentStatus : statuses[Math.floor(Math.random() * statuses.length)];
      
      history.push({
        runId: `${job.id}_${runDate.getFullYear()}${String(runDate.getMonth() + 1).padStart(2, '0')}${String(runDate.getDate()).padStart(2, '0')}_${String(i + 1).padStart(3, '0')}`,
        startTime: runDate.toISOString().replace('T', ' ').slice(0, 19),
        endTime: new Date(runDate.getTime() + Math.random() * 3600000).toISOString().replace('T', ' ').slice(0, 19),
        status: randomStatus,
        duration: Math.floor(Math.random() * 300) + 30,
        exitCode: randomStatus === 'Completed' ? 0 : (randomStatus === 'Failed' ? 1 : 2),
        hasScriptLogs: job.hasScriptLogs
      });
    }
    
    return history;
  };

  const handleJobNameClick = (job) => {
    const history = generateJobHistory(job);
    setSelectedJobHistory({ ...job, history });
    setShowJobDetails(true);
  };

  const handleRunLogView = (run, type) => {
    setSelectedRun(run);
    setSelectedJob(selectedJobHistory);
    setLogType(type);
    setShowLogs(true);
    setShowJobDetails(false);
  };

  const closeJobDetails = () => {
    setShowJobDetails(false);
    setSelectedJobHistory(null);
  };

  const generateJobLogs = (job, run = null) => {
    const runInfo = run || {
      runId: `${job.id}_current`,
      startTime: job.lastSuccessful,
      status: job.currentStatus,
      exitCode: job.currentStatus === 'Failed' ? 1 : 0
    };
    
    const logs = [
      `=== CONTROL-M JOB LOG FOR ${job.name} ===`,
      `Job ID: ${job.id}`,
      `Run ID: ${runInfo.runId}`,
      `Start Time: ${runInfo.startTime}`,
      `Host: ctm-server-01`,
      `User: ctmuser`,
      ``,
      `[INFO] Job submission started`,
      `[INFO] Validating job parameters...`,
      `[INFO] Parameters validated successfully`,
      `[INFO] Checking job prerequisites...`,
      `[INFO] Waiting for events: ${job.waitingEvents.map(e => e.name).join(', ')}`,
      ...job.waitingEvents.map(event => 
        event.present 
          ? `[INFO] Event ${event.name} received at ${event.expectedDate} 10:30:15`
          : `[WARN] Event ${event.name} still pending (expected: ${event.expectedDate})`
      ),
      `[INFO] All prerequisites satisfied`,
      `[INFO] Job queued for execution`,
      `[INFO] Job started on agent: ctm-agent-${Math.floor(Math.random() * 5) + 1}`,
      `[INFO] Working directory: /opt/controlm/jobs/${job.name.toLowerCase()}`,
      `[INFO] Environment variables loaded`,
      `[INFO] Executing job script: ${job.name.toLowerCase()}_main.sh`,
      `[INFO] Script execution completed with exit code: ${runInfo.exitCode}`,
      `[INFO] Job output captured`,
      `[INFO] Cleaning up temporary files`,
      runInfo.status === 'Failed' 
        ? `[ERROR] Job failed - see script logs for details`
        : runInfo.status === 'Aborted'
        ? `[WARN] Job was aborted by user request`
        : `[INFO] Job completed successfully`,
      `[INFO] Job statistics: Runtime=${run ? run.duration : Math.floor(Math.random() * 120) + 30}s, CPU=${Math.floor(Math.random() * 50) + 10}%, Memory=${Math.floor(Math.random() * 500) + 100}MB`,
      ``,
      `End Time: ${run ? run.endTime : new Date(new Date(job.lastSuccessful).getTime() + Math.random() * 300000).toISOString().replace('T', ' ').slice(0, 19)}`,
      `Status: ${runInfo.status.toUpperCase()}`,
      `Exit Code: ${runInfo.exitCode}`,
      `=== END OF JOB LOG ===`
    ];
    return logs;
  };

  const generateScriptLogs = (job, run = null) => {
    const runInfo = run || {
      runId: `${job.id}_current`,
      startTime: job.lastSuccessful,
      status: job.currentStatus,
      exitCode: job.currentStatus === 'Failed' ? 1 : 0
    };
    
    const logs = [
      `#!/bin/bash`,
      `# Script: ${job.name.toLowerCase()}_main.sh`,
      `# Generated by Control-M`,
      `# Run ID: ${runInfo.runId}`,
      `# Execution Date: ${runInfo.startTime}`,
      ``,
      `echo "Starting ${job.name} process..."`,
      `export JOB_NAME="${job.name}"`,
      `export JOB_ID="${job.id}"`,
      `export RUN_ID="${runInfo.runId}"`,
      `export TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')`,
      ``,
      `echo "[$TIMESTAMP] Setting up environment..."`,
      `cd /app/data/${job.name.toLowerCase()}`,
      ``,
      `echo "[$TIMESTAMP] Checking input files..."`,
      `if [ ! -f input_data.txt ]; then`,
      `    echo "[$TIMESTAMP] ERROR: Input file not found"`,
      runInfo.status === 'Failed' ? `    exit 1` : `    echo "[$TIMESTAMP] Input file validated"`,
      `fi`,
      ``,
      `echo "[$TIMESTAMP] Processing data..."`,
      `for i in {1..5}; do`,
      `    echo "[$TIMESTAMP] Processing batch $i/5"`,
      `    sleep 2`,
      `    if [ $? -eq 0 ]; then`,
      `        echo "[$TIMESTAMP] Batch $i processed successfully"`,
      `    else`,
      `        echo "[$TIMESTAMP] ERROR: Batch $i failed"`,
      runInfo.status === 'Failed' ? `        exit 1` : ``,
      `    fi`,
      `done`,
      ``,
      `echo "[$TIMESTAMP] Generating output files..."`,
      `cat > output_summary.txt << EOF`,
      `Job: ${job.name}`,
      `Run: ${runInfo.runId}`,
      `Status: ${runInfo.status}`,
      `Records Processed: ${Math.floor(Math.random() * 10000) + 1000}`,
      `Start Time: $TIMESTAMP`,
      `EOF`,
      ``,
      `echo "[$TIMESTAMP] Sending notifications..."`,
      `mail -s "${job.name} ${runInfo.status}" admin@company.com < output_summary.txt`,
      ``,
      `echo "[$TIMESTAMP] Cleanup temporary files..."`,
      `rm -f /tmp/${job.name.toLowerCase()}_*.tmp`,
      ``,
      runInfo.status === 'Failed' 
        ? `echo "[$TIMESTAMP] ERROR: Job failed during execution"`
        : runInfo.status === 'Aborted'
        ? `echo "[$TIMESTAMP] WARN: Job was aborted"`
        : `echo "[$TIMESTAMP] Job completed successfully"`,
      ``,
      `exit ${runInfo.exitCode}`
    ];
    return logs;
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'waiting':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'scheduled':
        return <AlertCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewLogs = (job, type) => {
    setSelectedJob(job);
    setLogType(type);
    setShowLogs(true);
  };

  const closeLogs = () => {
    setShowLogs(false);
    setSelectedJob(null);
    setSelectedRun(null);
    setLogType('');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Control-M Jobs Monitor</h1>
          <p className="text-gray-600">Monitor and analyze your Control-M job executions</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Job Status Overview</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Successful</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting Events</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div 
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleJobNameClick(job)}
                        >
                          {job.name}
                        </div>
                        <div className="text-sm text-gray-500">{job.description}</div>
                        <div className="text-xs text-gray-400 mt-1">ID: {job.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(job.currentStatus)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(job.currentStatus)}`}>
                          {job.currentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDateTime(job.lastSuccessful)}</div>
                      <div className="text-xs text-gray-500">Next: {formatDateTime(job.nextRun)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {job.waitingEvents.map((event, index) => (
                          <div key={index} className={`px-2 py-2 text-xs rounded-md border ${
                            event.present 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-orange-50 border-orange-200'
                          }`}>
                            <div className={`font-medium ${event.present ? 'text-green-800' : 'text-orange-800'}`}>
                              {event.name} {event.present ? '✓' : '⏳'}
                            </div>
                            <div className="text-gray-600 text-xs mt-0.5">{event.expectedDate}</div>
                          </div>
                        ))}
                        {job.waitingEvents.length === 0 && (
                          <span className="text-xs text-gray-400">No events</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewLogs(job, 'job')}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Job Logs
                        </button>
                        {job.hasScriptLogs && (
                          <button
                            onClick={() => handleViewLogs(job, 'script')}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Terminal className="w-4 h-4 mr-1" />
                            Script Logs
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Viewer Modal */}
        {showLogs && selectedJob && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {logType === 'job' ? 'Control-M Job Logs' : 'Script Execution Logs'} - {selectedJob.name}
                  </h3>
                  <p className="text-sm text-gray-500">Job ID: {selectedJob.id} | Last Run: {formatDateTime(selectedJob.lastSuccessful)}</p>
                </div>
                <button
                  onClick={closeLogs}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto border">
                <div className="whitespace-pre-wrap">
                  {logType === 'job' 
                    ? generateJobLogs(selectedJob, selectedRun).join('\n')
                    : generateScriptLogs(selectedJob, selectedRun).join('\n')
                  }
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  {selectedJob.hasScriptLogs && (
                    <button
                      onClick={() => setLogType(logType === 'job' ? 'script' : 'job')}
                      className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Switch to {logType === 'job' ? 'Script' : 'Job'} Logs
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const logs = logType === 'job' 
                        ? generateJobLogs(selectedJob, selectedRun).join('\n')
                        : generateScriptLogs(selectedJob, selectedRun).join('\n');
                      navigator.clipboard.writeText(logs);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Copy Logs
                  </button>
                </div>
                <button
                  onClick={closeLogs}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job Details Modal */}
        {showJobDetails && selectedJobHistory && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedJobHistory.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedJobHistory.description}</p>
                  <p className="text-xs text-gray-400">Job ID: {selectedJobHistory.id}</p>
                </div>
                <button
                  onClick={closeJobDetails}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Current Status</h4>
                  <div className="flex items-center">
                    {getStatusIcon(selectedJobHistory.currentStatus)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedJobHistory.currentStatus)}`}>
                      {selectedJobHistory.currentStatus}
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Last Successful</h4>
                  <p className="text-sm text-green-800">{formatDateTime(selectedJobHistory.lastSuccessful)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Next Run</h4>
                  <p className="text-sm text-purple-800">{formatDateTime(selectedJobHistory.nextRun)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Waiting Events</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJobHistory.waitingEvents.map((event, index) => (
                    <div key={index} className={`px-2 py-2 text-xs rounded-md border ${
                      event.present 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className={`font-medium ${event.present ? 'text-green-800' : 'text-orange-800'}`}>
                        {event.name} {event.present ? '✓' : '⏳'}
                      </div>
                      <div className="text-gray-600 text-xs mt-0.5">{event.expectedDate}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Execution History</h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Run ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exit Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedJobHistory.history.map((run) => (
                        <tr key={run.runId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">{run.runId}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatDateTime(run.startTime)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{run.duration}s</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {getStatusIcon(run.status)}
                              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(run.status)}`}>
                                {run.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">{run.exitCode}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleRunLogView(run, 'job')}
                                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                Job
                              </button>
                              {run.hasScriptLogs && (
                                <button
                                  onClick={() => handleRunLogView(run, 'script')}
                                  className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <Terminal className="w-3 h-3 mr-1" />
                                  Script
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeJobDetails}
                  className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlMMonitor;
