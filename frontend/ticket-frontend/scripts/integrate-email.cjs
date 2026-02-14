const fs = require("fs");
const path = require("path");

const DSI_PATH = path.join(__dirname, "../src/pages/DSIDashboard.tsx");
const ADMIN_PATH = path.join(__dirname, "../src/pages/AdminDashboard.tsx");

const START = '          {activeSection === "email" && (';
const END = '          {activeSection === "securite" && (';

const REPLACEMENT = `          {activeSection === "email" && (
            <EmailSection
              emailSubSection={emailSubSection}
              setEmailSubSection={setEmailSubSection}
              emailSettings={emailSettings}
              setEmailSettings={setEmailSettings}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              emailTemplates={emailTemplates}
              setEmailTemplates={setEmailTemplates}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              showTemplateEditor={showTemplateEditor}
              setShowTemplateEditor={setShowTemplateEditor}
              templateForm={templateForm}
              setTemplateForm={setTemplateForm}
              emailNotifications={emailNotifications}
              setEmailNotifications={setEmailNotifications}
              emailFrequency={emailFrequency}
              setEmailFrequency={setEmailFrequency}
              testEmail={testEmail}
              setTestEmail={setTestEmail}
              testResult={testResult}
              setTestResult={setTestResult}
              emailLogs={emailLogs}
            />
          )}

`;

function integrate(filePath) {
  let c = fs.readFileSync(filePath, "utf8");
  const startIdx = c.indexOf(START);
  const endIdx = c.indexOf(END, startIdx);
  if (startIdx < 0 || endIdx <= startIdx) {
    console.error("Block not found in", path.basename(filePath));
    return;
  }
  c = c.substring(0, startIdx) + REPLACEMENT + c.substring(endIdx);
  if (!c.includes("import { EmailSection }")) {
    c = c.replace(
      /import \{ RolesSection \} from "\.\.\/components\/dashboard\/RolesSection\.tsx";/,
      'import { RolesSection } from "../components/dashboard/RolesSection.tsx";\nimport { EmailSection } from "../components/dashboard/EmailSection.tsx";'
    );
  }
  fs.writeFileSync(filePath, c);
  console.log("OK", path.basename(filePath));
}

integrate(DSI_PATH);
integrate(ADMIN_PATH);
console.log("Done.");
