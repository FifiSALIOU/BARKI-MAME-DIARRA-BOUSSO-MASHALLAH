const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/DSIDashboard.tsx');
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('activeSection === "dashboard"') && l.includes('&& ('));
if (startIdx < 0) {
  console.log('Could not find start');
  process.exit(1);
}
const endIdx = startIdx + 1961;

const replacement = `          {activeSection === "dashboard" && (
            <DashboardSection
              userRole={userRole}
              pendingCount={pendingCount}
              activeTechniciansCount={activeTechniciansCount}
              technicians={technicians}
              metrics={metrics}
              resolutionRate={resolutionRate}
              totalTicketsCount={totalTicketsCount}
              filteredTickets={filteredTickets}
              formatTicketNumber={formatTicketNumber}
              loadTicketDetails={loadTicketDetails}
              loading={loading}
              openActionsMenuFor={openActionsMenuFor}
              setOpenActionsMenuFor={setOpenActionsMenuFor}
              setActionsMenuPosition={setActionsMenuPosition}
              prepareWeeklyTicketsData={prepareWeeklyTicketsData}
              prepareMonthlyEvolutionData={prepareMonthlyEvolutionData}
              preparePriorityData={preparePriorityData}
              prepareStatusData={prepareStatusData}
              prepareAgencyAnalysisData={prepareAgencyAnalysisData}
              prepareTechnicianPerformanceData={prepareTechnicianPerformanceData}
              prepareTimeSeriesData={prepareTimeSeriesData}
              prepareStatusEvolutionData={prepareStatusEvolutionData}
              prepareResolutionTimeByTypeData={prepareResolutionTimeByTypeData}
            />
          )}`;

const newLines = [...lines.slice(0, startIdx), replacement, ...lines.slice(endIdx + 1)];
fs.writeFileSync(file, newLines.join('\n'));
console.log('Replaced lines', startIdx + 1, 'to', endIdx + 1, '- removed', endIdx - startIdx, 'lines');
