/**
 * constants/data.js
 * Static config: stage definitions and demo seed data.
 */
(function () {
  window.ST = window.ST || {};

  const STAGE_DOTS = {
    'Stage 01': '#1E40AF',
    'Stage 02': '#065F46',
    'Stage 03': '#4C1D95',
    'Stage 04': '#78350F'
  };

  const STAGE_NAMES = {
    'Stage 01': 'Installation & Config',
    'Stage 02': 'Connector / Ingestion',
    'Stage 03': 'Point Tagging & Import',
    'Stage 04': 'Project QC'
  };

  function defaultTasks() {
    return [
      // Stage 01
      { stage: 'Stage 01', step: '01', title: 'Confirm VM/server access and RDP connectivity',                       status: 'closed',   assignee: 'JD', replies: [] },
      { stage: 'Stage 01', step: '02', title: 'Confirm PowerShell can be run as Administrator',                      status: 'closed',   assignee: 'JD', replies: [] },
      { stage: 'Stage 01', step: '03', title: 'Confirm Java is installed and running on the VM',                     status: 'closed',   assignee: 'JD', replies: [] },
      { stage: 'Stage 01', step: '04', title: 'Confirm SkySpark installation files are in the correct folder',       status: 'closed',   assignee: 'JD', replies: [] },
      { stage: 'Stage 01', step: '05', title: 'Install and confirm SkySpark is running',                             status: 'closed',   assignee: 'JD', replies: [] },
      { stage: 'Stage 01', step: '06', title: 'Confirm a project has been set up and licensed',                      status: 'closed',   assignee: 'JD', replies: [] },
      { stage: 'Stage 01', step: '07', title: 'Install license via Host app in SkySpark on project',                 status: 'closed',   assignee: 'JD', replies: [] },
      { stage: 'Stage 01', step: '08', title: 'Confirm IMEG PODs have been uploaded, then restart SkySpark',         status: 'closed',   assignee: 'JD', replies: [] },
      { stage: 'Stage 01', step: '09', title: 'Connect and confirm SkySpark is clustered to the cloud instance',     status: 'closed',   assignee: 'JD', replies: [] },
      { stage: 'Stage 01', step: '10', title: 'Configure SkySpark as a Windows service using NSSM',                  status: 'closed',   assignee: 'JD', replies: [] },
      { stage: 'Stage 01', step: '11', title: 'Disconnect from RDP and confirm SkySpark persists in browser',        status: 'closed',   assignee: 'JD', replies: [] },
      // Stage 02
      { stage: 'Stage 02', step: '01', title: 'Verify Arcbeam is installed on the BAS',                              status: 'closed',   assignee: 'RK', replies: [] },
      { stage: 'Stage 02', step: '02', title: 'Enable Arcbeam extension in SkySpark Connector App',                  status: 'closed',   assignee: 'RK', replies: [] },
      { stage: 'Stage 02', step: '03', title: 'Approve the connector that appears',                                  status: 'closed',   assignee: 'RK', replies: [] },
      { stage: 'Stage 02', step: '04', title: 'Confirm connStatus shows ok',                                         status: 'closed',   assignee: 'RK', replies: [] },
      { stage: 'Stage 02', step: '05', title: 'Run import_Arcbeam_pointReport — save and name file correctly',       status: 'closed',   assignee: 'RK', replies: [] },
      // Stage 03
      { stage: 'Stage 03', step: 'PRE', title: 'Confirm completed point report is available from Stage 02',          status: 'closed',   assignee: 'ML', replies: [] },
      { stage: 'Stage 03', step: '01', title: 'Confirm Semantic Model file is present in the OneDrive folder',       status: 'progress', assignee: 'ML', replies: [
        { author: 'M. Lee',   initials: 'ML', time: '2h ago', text: "Found the template but the filename doesn't match the naming convention. Checking with JD." },
        { author: 'J. Davis', initials: 'JD', time: '1h ago', text: "Use the version from the 2024-Q4 template folder — naming convention changed in October." }
      ]},
      { stage: 'Stage 03', step: '02', title: 'Add point report data to SelectedPoints',                             status: 'open',     assignee: 'ML', replies: [] },
      { stage: 'Stage 03', step: '03', title: 'Complete Semantic Model and upload CSV to SkySpark',                  status: 'open',     assignee: 'ML', replies: [] },
      { stage: 'Stage 03', step: '04', title: 'Run import_createSiteGroups',                                         status: 'open',     assignee: 'ML', replies: [] },
      { stage: 'Stage 03', step: '05', title: 'Run import_createEquipSections',                                      status: 'open',     assignee: 'ML', replies: [] },
      { stage: 'Stage 03', step: '06', title: 'Run import_createPoints',                                             status: 'open',     assignee: 'ML', replies: [] },
      { stage: 'Stage 03', step: '07', title: 'Run readAll(point and dateCreated == today()) — confirm all points ok', status: 'open',   assignee: 'ML', replies: [] },
      // Stage 04
      { stage: 'Stage 04', step: '01', title: 'Check site record and resolve any errors',                            status: 'open',     assignee: 'JD', replies: [] },
      { stage: 'Stage 04', step: '02', title: 'Confirm all equipment are named and placed correctly',                 status: 'open',     assignee: 'JD', replies: [] },
      { stage: 'Stage 04', step: '03', title: 'Confirm all points are named and placed correctly',                   status: 'open',     assignee: 'JD', replies: [] },
      { stage: 'Stage 04', step: '04', title: 'Confirm all points are tagged correctly',                             status: 'open',     assignee: 'JD', replies: [] },
      { stage: 'Stage 04', step: '05', title: 'Check and resolve error points',                                      status: 'open',     assignee: 'JD', replies: [] },
      { stage: 'Stage 04', step: '06', title: 'Schedule review meeting with superior',                               status: 'open',     assignee: 'JD', replies: [] }
    ];
  }

  function sampleProjects() {
    const dt = defaultTasks;
    return [
      { id: 1, num: '24-0412', title: 'Midtown Medical Center',     type: 'MBCx',    conn: 'Niagara / Arcbeam', due: '2025-06-15', initiator: 'J. Davis', tasks: dt() },
      { id: 2, num: '24-0388', title: 'Riverside Office Complex',   type: 'WPPV-Cx', conn: 'BACnet',            due: '2025-07-30', initiator: 'J. Davis',
        tasks: dt().map(t => ({ ...t, status: t.stage === 'Stage 01' ? 'closed' : 'open', replies: [] })) },
      { id: 3, num: '25-0021', title: 'North Campus Energy Center', type: 'MBCx',    conn: 'SQL Database',      due: '2025-09-01', initiator: 'J. Davis',
        tasks: dt().map(t => ({ ...t, status: 'open', replies: [] })) }
    ];
  }

  window.ST.Constants = { STAGE_DOTS, STAGE_NAMES, defaultTasks, sampleProjects };
})();
