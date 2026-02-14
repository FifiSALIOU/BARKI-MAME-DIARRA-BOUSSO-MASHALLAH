/**
 * Section Email du dashboard DSI/Admin (paramètres SMTP, templates, etc.).
 */

import React from "react";

export type EmailSettings = {
  provider: string;
  senderEmail: string;
  displayName: string;
  smtpServer: string;
  smtpPort: string;
  authType: string;
  smtpUsername: string;
  smtpPassword: string;
  useTLS: boolean;
  verifySSL: boolean;
};

export type EmailTemplate = { id: number; name: string; active: boolean };
export type EmailNotification = { event: string; active: boolean; recipients: string };
export type EmailFrequency = {
  frequency: string;
  groupInterval: number;
  dailyTime: string;
  silenceFrom: string;
  silenceTo: string;
  applyWeekend: boolean;
};
export type EmailLog = { id: number; date: string; recipient: string; template: string; status: "success" | "error"; error?: string };

export type EmailSectionProps = {
  emailSubSection: string;
  setEmailSubSection: (v: string) => void;
  emailSettings: EmailSettings;
  setEmailSettings: React.Dispatch<React.SetStateAction<EmailSettings>>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  emailTemplates: EmailTemplate[];
  setEmailTemplates: React.Dispatch<React.SetStateAction<EmailTemplate[]>>;
  selectedTemplate: any;
  setSelectedTemplate: (v: any) => void;
  showTemplateEditor: boolean;
  setShowTemplateEditor: (v: boolean) => void;
  templateForm: { name: string; subject: string; recipients: string; customRecipients: string; active: boolean; content: string };
  setTemplateForm: React.Dispatch<React.SetStateAction<{ name: string; subject: string; recipients: string; customRecipients: string; active: boolean; content: string }>>;
  emailNotifications: EmailNotification[];
  setEmailNotifications: React.Dispatch<React.SetStateAction<EmailNotification[]>>;
  emailFrequency: EmailFrequency;
  setEmailFrequency: React.Dispatch<React.SetStateAction<EmailFrequency>>;
  testEmail: { address: string; template: string };
  setTestEmail: React.Dispatch<React.SetStateAction<{ address: string; template: string }>>;
  testResult: any;
  setTestResult: (v: any) => void;
  emailLogs: EmailLog[];
};

export function EmailSection(props: EmailSectionProps) {
  const {
    emailSubSection,
    setEmailSubSection,
    emailSettings,
    setEmailSettings,
    showPassword,
    setShowPassword,
    emailTemplates,
    setEmailTemplates,
    selectedTemplate,
    setSelectedTemplate,
    showTemplateEditor,
    setShowTemplateEditor,
    templateForm,
    setTemplateForm,
    emailNotifications,
    setEmailNotifications,
    emailFrequency,
    setEmailFrequency,
    testEmail,
    setTestEmail,
    testResult,
    setTestResult,
    emailLogs,
  } = props;

  return (
    <div style={{ padding: "24px 24px 24px 0" }}>
    
      {/* Navigation par onglets */}
       <div style={{ 
         display: "flex", 
         gap: "8px", 
         marginBottom: "24px", 
         borderBottom: "2px solid #e0e0e0" 
       }}>
         <button
           onClick={() => setEmailSubSection("smtp")}
           style={{
             padding: "12px 24px",
             backgroundColor: emailSubSection === "smtp" ? "#007bff" : "transparent",
             color: emailSubSection === "smtp" ? "white" : "#666",
             border: "none",
             borderBottom: emailSubSection === "smtp" ? "2px solid #007bff" : "2px solid transparent",
             cursor: "pointer",
             fontSize: "14px",
             fontWeight: emailSubSection === "smtp" ? "600" : "400",
             marginBottom: "-2px"
           }}
         >
           Configuration SMTP
         </button>
         <button
           onClick={() => setEmailSubSection("templates")}
           style={{
             padding: "12px 24px",
             backgroundColor: emailSubSection === "templates" ? "#007bff" : "transparent",
             color: emailSubSection === "templates" ? "white" : "#666",
             border: "none",
             borderBottom: emailSubSection === "templates" ? "2px solid #007bff" : "2px solid transparent",
             cursor: "pointer",
             fontSize: "14px",
             fontWeight: emailSubSection === "templates" ? "600" : "400",
             marginBottom: "-2px"
           }}
         >
           Templates Email
         </button>
         <button
           onClick={() => setEmailSubSection("notifications")}
           style={{
             padding: "12px 24px",
             backgroundColor: emailSubSection === "notifications" ? "#007bff" : "transparent",
             color: emailSubSection === "notifications" ? "white" : "#666",
             border: "none",
             borderBottom: emailSubSection === "notifications" ? "2px solid #007bff" : "2px solid transparent",
             cursor: "pointer",
             fontSize: "14px",
             fontWeight: emailSubSection === "notifications" ? "600" : "400",
             marginBottom: "-2px"
           }}
         >
           Notifications
         </button>
         <button
           onClick={() => setEmailSubSection("frequency")}
           style={{
             padding: "12px 24px",
             backgroundColor: emailSubSection === "frequency" ? "#007bff" : "transparent",
             color: emailSubSection === "frequency" ? "white" : "#666",
             border: "none",
             borderBottom: emailSubSection === "frequency" ? "2px solid #007bff" : "2px solid transparent",
             cursor: "pointer",
             fontSize: "14px",
             fontWeight: emailSubSection === "frequency" ? "600" : "400",
             marginBottom: "-2px"
           }}
         >
           Fréquence d'Envoi
         </button>
         <button
           onClick={() => setEmailSubSection("test")}
           style={{
             padding: "12px 24px",
             backgroundColor: emailSubSection === "test" ? "#007bff" : "transparent",
             color: emailSubSection === "test" ? "white" : "#666",
             border: "none",
             borderBottom: emailSubSection === "test" ? "2px solid #007bff" : "2px solid transparent",
             cursor: "pointer",
             fontSize: "14px",
             fontWeight: emailSubSection === "test" ? "600" : "400",
             marginBottom: "-2px"
           }}
         >
           Test
         </button>
         <button
           onClick={() => setEmailSubSection("logs")}
           style={{
             padding: "12px 24px",
             backgroundColor: emailSubSection === "logs" ? "#007bff" : "transparent",
             color: emailSubSection === "logs" ? "white" : "#666",
             border: "none",
             borderBottom: emailSubSection === "logs" ? "2px solid #007bff" : "2px solid transparent",
             cursor: "pointer",
             fontSize: "14px",
             fontWeight: emailSubSection === "logs" ? "600" : "400",
             marginBottom: "-2px"
           }}
         >
           Logs
         </button>
       </div>
    
       {/* Section SERVEUR SMTP */}
       {emailSubSection === "smtp" && (
         <>
       <div style={{ 
         marginBottom: "32px", 
         border: "1px solid #ddd", 
         borderRadius: "8px", 
         padding: "24px",
         background: "white"
       }}>
         <h2 style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "600", color: "#333" }}>
           SERVEUR SMTP
         </h2>
    
         {/* Fournisseur Email */}
         <div style={{ marginBottom: "20px" }}>
           <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
             Fournisseur Email <span style={{ color: "#dc3545" }}>*</span>
           </label>
           <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
             <select
               value={emailSettings.provider}
               onChange={(e) => {
                 const provider = e.target.value;
                 setEmailSettings({
                   ...emailSettings,
                   provider,
                   smtpServer: provider === "gmail" ? "smtp.gmail.com" : 
                              provider === "outlook" ? "smtp.office365.com" : 
                              provider === "sendgrid" ? "smtp.sendgrid.net" :
                              provider === "mailgun" ? "smtp.mailgun.org" : emailSettings.smtpServer,
                   smtpPort: provider === "gmail" ? "587" : 
                            provider === "outlook" ? "587" : 
                            provider === "sendgrid" ? "587" :
                            provider === "mailgun" ? "587" : emailSettings.smtpPort
                 });
               }}
               style={{ 
                 width: "100%",
                 padding: "10px 32px 10px 12px", 
                 borderRadius: "4px", 
                 border: "1px solid #ddd", 
                 backgroundColor: "white", 
                 color: "#333", 
                 fontSize: "14px", 
                 cursor: "pointer",
                 appearance: "none",
                 WebkitAppearance: "none",
                 MozAppearance: "none"
               }}
             >
               <option value="gmail">Gmail (Gmail SMTP)</option>
               <option value="outlook">Outlook (Office 365)</option>
               <option value="custom">Serveur SMTP personnalisé</option>
               <option value="sendgrid">SendGrid</option>
               <option value="mailgun">Mailgun</option>
             </select>
             <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#666", pointerEvents: "none" }}>▼</span>
           </div>
         </div>
    
         {/* Adresse Email d'Envoi */}
         <div style={{ marginBottom: "20px" }}>
           <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
             Adresse Email d'Envoi <span style={{ color: "#dc3545" }}>*</span>
           </label>
           <input
             type="email"
             value={emailSettings.senderEmail}
             onChange={(e) => setEmailSettings({ ...emailSettings, senderEmail: e.target.value })}
             placeholder="tickets@entreprise.com"
             style={{ 
               width: "100%",
               padding: "10px", 
               borderRadius: "4px", 
               border: "1px solid #ddd", 
               backgroundColor: "white", 
               color: "#333", 
               fontSize: "14px"
             }}
           />
           <p style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}>
             Cette adresse sera utilisée pour envoyer les emails
           </p>
         </div>
    
         {/* Nom d'Affichage */}
         <div style={{ marginBottom: "20px" }}>
           <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
             Nom d'Affichage <span style={{ color: "#dc3545" }}>*</span>
           </label>
           <input
             type="text"
             value={emailSettings.displayName}
             onChange={(e) => setEmailSettings({ ...emailSettings, displayName: e.target.value })}
             placeholder="Système de Gestion des Tickets"
             style={{ 
               width: "100%",
               padding: "10px", 
               borderRadius: "4px", 
               border: "1px solid #ddd", 
               backgroundColor: "white", 
               color: "#333", 
               fontSize: "14px"
             }}
           />
           <p style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}>
             Le nom qui apparaîtra dans les emails reçus
           </p>
         </div>
    
         {/* Serveur SMTP */}
         <div style={{ marginBottom: "20px" }}>
           <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
             Serveur SMTP <span style={{ color: "#dc3545" }}>*</span>
           </label>
           <input
             type="text"
             value={emailSettings.smtpServer}
             onChange={(e) => setEmailSettings({ ...emailSettings, smtpServer: e.target.value })}
             placeholder="smtp.gmail.com"
             style={{ 
               width: "100%",
               padding: "10px", 
               borderRadius: "4px", 
               border: "1px solid #ddd", 
               backgroundColor: "white", 
               color: "#333", 
               fontSize: "14px"
             }}
           />
         </div>
    
         {/* Port SMTP */}
         <div style={{ marginBottom: "20px" }}>
           <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
             Port SMTP <span style={{ color: "#dc3545" }}>*</span>
           </label>
           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
             <div style={{ position: "relative", display: "inline-block", flex: "0 0 150px" }}>
               <select
                 value={emailSettings.smtpPort}
                 onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                 style={{ 
                   width: "100%",
                   padding: "10px 32px 10px 12px", 
                   borderRadius: "4px", 
                   border: "1px solid #ddd", 
                   backgroundColor: "white", 
                   color: "#333", 
                   fontSize: "14px", 
                   cursor: "pointer",
                   appearance: "none",
                   WebkitAppearance: "none",
                   MozAppearance: "none"
                 }}
               >
                 <option value="587">587</option>
                 <option value="465">465</option>
                 <option value="25">25</option>
                 <option value="2525">2525</option>
               </select>
               <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#666", pointerEvents: "none" }}>▼</span>
             </div>
             <span style={{ fontSize: "12px", color: "#666" }}>(ou 465 pour SSL)</span>
           </div>
         </div>
       </div>
    
       {/* Section Authentification */}
       <div style={{ 
         marginBottom: "32px", 
         border: "1px solid #ddd", 
         borderRadius: "8px", 
         padding: "24px",
         background: "white"
       }}>
         <h2 style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "600", color: "#333" }}>
           Authentification
         </h2>
    
         {/* Type d'authentification */}
         <div style={{ marginBottom: "20px" }}>
           <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
             Type d'authentification
           </label>
           <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
             <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
               <input
                 type="radio"
                 name="authType"
                 value="none"
                 checked={emailSettings.authType === "none"}
                 onChange={(e) => setEmailSettings({ ...emailSettings, authType: e.target.value })}
                 style={{ cursor: "pointer" }}
               />
               <span>Aucune</span>
             </label>
             <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
               <input
                 type="radio"
                 name="authType"
                 value="password"
                 checked={emailSettings.authType === "password"}
                 onChange={(e) => setEmailSettings({ ...emailSettings, authType: e.target.value })}
                 style={{ cursor: "pointer" }}
               />
               <span>Nom d'utilisateur et mot de passe</span>
             </label>
             <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
               <input
                 type="radio"
                 name="authType"
                 value="oauth"
                 checked={emailSettings.authType === "oauth"}
                 onChange={(e) => setEmailSettings({ ...emailSettings, authType: e.target.value })}
                 style={{ cursor: "pointer" }}
               />
               <span>OAuth 2.0</span>
             </label>
           </div>
         </div>
    
         {/* Nom d'Utilisateur SMTP */}
         {emailSettings.authType !== "none" && (
           <>
             <div style={{ marginBottom: "20px" }}>
               <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
                 Nom d'Utilisateur SMTP
               </label>
               <input
                 type="text"
                 value={emailSettings.smtpUsername}
                 onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                 placeholder="tickets@entreprise.com"
                 style={{ 
                   width: "100%",
                   padding: "10px", 
                   borderRadius: "4px", 
                   border: "1px solid #ddd", 
                   backgroundColor: "white", 
                   color: "#333", 
                   fontSize: "14px"
                 }}
               />
             </div>
    
             {/* Mot de Passe SMTP */}
             {emailSettings.authType === "password" && (
               <div style={{ marginBottom: "20px" }}>
                 <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
                   Mot de Passe SMTP
                 </label>
                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                   <input
                     type={showPassword ? "text" : "password"}
                     value={emailSettings.smtpPassword}
                     onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                     placeholder="••••••••••••••••"
                     style={{ 
                       flex: 1,
                       padding: "10px", 
                       borderRadius: "4px", 
                       border: "1px solid #ddd", 
                       backgroundColor: "white", 
                       color: "#333", 
                       fontSize: "14px"
                     }}
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     style={{
                       padding: "10px 16px",
                       backgroundColor: "#f8f9fa",
                       color: "#333",
                       border: "1px solid #ddd",
                       borderRadius: "4px",
                       cursor: "pointer",
                       fontSize: "14px"
                     }}
                   >
                     {showPassword ? "Masquer" : "Afficher"}
                   </button>
                 </div>
               </div>
             )}
           </>
         )}
    
         {/* Checkboxes TLS/SSL */}
         <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
           <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
             <input
               type="checkbox"
               checked={emailSettings.useTLS}
               onChange={(e) => setEmailSettings({ ...emailSettings, useTLS: e.target.checked })}
               style={{ cursor: "pointer" }}
             />
             <span>Utiliser TLS/SSL</span>
           </label>
           <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
             <input
               type="checkbox"
               checked={emailSettings.verifySSL}
               onChange={(e) => setEmailSettings({ ...emailSettings, verifySSL: e.target.checked })}
               style={{ cursor: "pointer" }}
             />
             <span>Vérifier le certificat SSL</span>
           </label>
         </div>
       </div>
    
       {/* Boutons d'action */}
       <div style={{ 
         display: "flex", 
         justifyContent: "flex-end", 
         gap: "12px",
         marginTop: "32px",
         paddingTop: "24px",
         borderTop: "1px solid #eee"
       }}>
         <button
           onClick={() => {
             // Réinitialiser les valeurs
             setEmailSettings({
               provider: "gmail",
               senderEmail: "tickets@entreprise.com",
               displayName: "Système de Gestion des Tickets",
               smtpServer: "smtp.gmail.com",
               smtpPort: "587",
               authType: "password",
               smtpUsername: "tickets@entreprise.com",
               smtpPassword: "",
               useTLS: true,
               verifySSL: true
             });
           }}
           style={{
             padding: "10px 20px",
             backgroundColor: "#6c757d",
             color: "white",
             border: "none",
             borderRadius: "4px",
             cursor: "pointer",
             fontSize: "14px"
           }}
         >
           Annuler
         </button>
         <button
           onClick={() => {
             localStorage.setItem("emailSettings", JSON.stringify(emailSettings));
             alert("Paramètres email enregistrés avec succès !");
           }}
           style={{
             padding: "10px 20px",
             backgroundColor: "#28a745",
             color: "white",
             border: "none",
             borderRadius: "4px",
             cursor: "pointer",
             fontSize: "14px"
           }}
         >
           Enregistrer
         </button>
       </div>
         </>
       )}
    
       {/* Section Templates Email */}
       {emailSubSection === "templates" && (
         <div>
           <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "600", color: "#333", textAlign: "center" }}>
             TEMPLATES EMAIL
           </h2>
           <p style={{ marginBottom: "24px", fontSize: "14px", color: "#666", textAlign: "center" }}>
             Sélectionnez un <span style={{ color: "#dc3545" }}>template</span> à configurer :
           </p>
    
           <div style={{ background: "white", borderRadius: "8px", border: "1px solid #ddd", overflow: "hidden" }}>
             <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                 <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#333", borderRight: "1px solid #ddd" }}>Template</th>
                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#333", borderRight: "1px solid #ddd" }}>Statut</th>
                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#333" }}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {emailTemplates.map((template) => (
                   <tr key={template.id} style={{ borderBottom: "1px solid #eee" }}>
                     <td style={{ padding: "12px", color: "#333" }}>{template.name}</td>
                     <td style={{ padding: "12px" }}>
                       <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#28a745" }}>
                         <span style={{ fontSize: "16px" }}>✓</span>
                         <span>Actif</span>
                       </span>
                     </td>
                     <td style={{ padding: "12px" }}>
                       <div style={{ display: "flex", gap: "12px" }}>
                         <button
                           onClick={() => {
                             setSelectedTemplate(template);
                             setTemplateForm({
                               name: template.name,
                               subject: `Votre ticket #{{TICKET_ID}} a été créé avec succès`,
                               recipients: "creator",
                               customRecipients: "",
                               active: template.active,
                               content: `Bonjour {{USER_NAME}},\n\nVotre ticket a été créé avec succès.\n\nDétails du Ticket :\n• Numéro : #{{TICKET_ID}}\n• Titre : {{TICKET_TITLE}}\n• Priorité : {{PRIORITY}}\n• Agence : {{DEPARTMENT}}\n• Date de Création : {{CREATION_DATE}}\n\nVous pouvez suivre l'avancement de votre ticket en vous connectant à l'application.\n\nSi vous avez des questions, contactez-nous à :\n{{SUPPORT_EMAIL}}\n\nCordialement,\nÉquipe Support`
                             });
                             setShowTemplateEditor(true);
                           }}
                           style={{
                             background: "none",
                             border: "none",
                             cursor: "pointer",
                             padding: "4px 8px"
                           }}
                           title="Éditer"
                         >
                           <span style={{ fontSize: "18px" }}>✏️</span>
                         </button>
                         <button
                           onClick={() => {
                             // Aperçu
                             alert(`Aperçu du template: ${template.name}`);
                           }}
                           style={{
                             background: "none",
                             border: "none",
                             cursor: "pointer",
                             padding: "4px 8px"
                           }}
                           title="Aperçu"
                         >
                           <span style={{ fontSize: "18px" }}>👁️</span>
                         </button>
                         <button
                           onClick={() => {
                             if (confirm(`Êtes-vous sûr de vouloir supprimer le template "${template.name}" ?`)) {
                               setEmailTemplates(emailTemplates.filter(t => t.id !== template.id));
                               localStorage.setItem("emailTemplates", JSON.stringify(emailTemplates.filter(t => t.id !== template.id)));
                             }
                           }}
                           style={{
                             background: "none",
                             border: "none",
                             cursor: "pointer",
                             padding: "4px 8px"
                           }}
                           title="Supprimer"
                         >
                           <span style={{ fontSize: "18px" }}>🗑️</span>
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
    
           {/* Modal d'édition de template */}
           {showTemplateEditor && (
             <div style={{
               position: "fixed",
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               background: "rgba(0,0,0,0.5)",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               zIndex: 1000
             }}>
               <div style={{
                 background: "white",
                 borderRadius: "8px",
                 padding: "24px",
                 width: "90%",
                 maxWidth: "800px",
                 maxHeight: "90vh",
                 overflow: "auto"
               }}>
                 <h2 style={{ marginBottom: "8px", fontSize: "20px", fontWeight: "600", color: "#333" }}>
                   ÉDITER TEMPLATE EMAIL
                 </h2>
                 <p style={{ marginBottom: "24px", fontSize: "14px", color: "#666" }}>
                   {selectedTemplate?.name}
                 </p>
    
                 {/* Informations Générales */}
                 <div style={{ marginBottom: "24px" }}>
                   <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "600", color: "#333" }}>
                     Informations Générales
                   </h3>
                   
                   <div style={{ marginBottom: "16px" }}>
                     <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
                       Nom du Template <span style={{ color: "#dc3545" }}>*</span>
                     </label>
                     <input
                       type="text"
                       value={templateForm.name}
                       onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                       style={{
                         width: "100%",
                         padding: "10px",
                         borderRadius: "4px",
                         border: "1px solid #ddd",
                         fontSize: "14px"
                       }}
                     />
                   </div>
    
                   <div style={{ marginBottom: "16px" }}>
                     <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
                       Objet de l'Email <span style={{ color: "#dc3545" }}>*</span>
                     </label>
                     <input
                       type="text"
                       value={templateForm.subject}
                       onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                       style={{
                         width: "100%",
                         padding: "10px",
                         borderRadius: "4px",
                         border: "1px solid #ddd",
                         fontSize: "14px"
                       }}
                     />
                   </div>
    
                   <div style={{ marginBottom: "16px", padding: "12px", background: "#f8f9fa", borderRadius: "4px" }}>
                     <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
                       Variables disponibles :
                     </label>
                     <div style={{ fontSize: "12px", color: "#666", fontFamily: "monospace" }}>
                       {`{{TICKET_ID}} {{TICKET_TITLE}} {{USER_NAME}} {{USER_EMAIL}} {{DEPARTMENT}} {{PRIORITY}} {{CREATION_DATE}} {{SUPPORT_EMAIL}}`}
                     </div>
                   </div>
    
                   <div style={{ marginBottom: "16px" }}>
                     <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
                       Destinataires <span style={{ color: "#dc3545" }}>*</span>
                     </label>
                     <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                       <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                         <input
                           type="radio"
                           name="recipients"
                           value="creator"
                           checked={templateForm.recipients === "creator"}
                           onChange={(e) => setTemplateForm({ ...templateForm, recipients: e.target.value })}
                         />
                         <span>Utilisateur créateur du ticket</span>
                       </label>
                       <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                         <input
                           type="radio"
                           name="recipients"
                           value="secretary"
                           checked={templateForm.recipients === "secretary"}
                           onChange={(e) => setTemplateForm({ ...templateForm, recipients: e.target.value })}
                         />
                         <span>Secrétaire/Adjoint DSI</span>
                       </label>
                       <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                         <input
                           type="radio"
                           name="recipients"
                           value="technician"
                           checked={templateForm.recipients === "technician"}
                           onChange={(e) => setTemplateForm({ ...templateForm, recipients: e.target.value })}
                         />
                         <span>Technicien assigné</span>
                       </label>
                       <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                         <input
                           type="radio"
                           name="recipients"
                           value="custom"
                           checked={templateForm.recipients === "custom"}
                           onChange={(e) => setTemplateForm({ ...templateForm, recipients: e.target.value })}
                         />
                         <span>Personnalisé :</span>
                         {templateForm.recipients === "custom" && (
                           <input
                             type="text"
                             value={templateForm.customRecipients}
                             onChange={(e) => setTemplateForm({ ...templateForm, customRecipients: e.target.value })}
                             placeholder="email@example.com"
                             style={{
                               flex: 1,
                               padding: "8px",
                               borderRadius: "4px",
                               border: "1px solid #ddd",
                               fontSize: "14px"
                             }}
                           />
                         )}
                       </label>
                     </div>
                   </div>
    
                   <div style={{ marginBottom: "16px" }}>
                     <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                       <input
                         type="checkbox"
                         checked={templateForm.active}
                         onChange={(e) => setTemplateForm({ ...templateForm, active: e.target.checked })}
                       />
                       <span>Envoyer cet email automatiquement</span>
                     </label>
                   </div>
                 </div>
    
                 {/* Contenu de l'Email */}
                 <div style={{ marginBottom: "24px" }}>
                   <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "600", color: "#333" }}>
                     Contenu de l'Email
                   </h3>
                   <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "8px", background: "#f8f9fa" }}>
                     <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontStyle: "italic" }}>
                       [Éditeur HTML/Texte Riche]
                     </div>
                     <textarea
                       value={templateForm.content}
                       onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                       rows={15}
                       style={{
                         width: "100%",
                         padding: "12px",
                         borderRadius: "4px",
                         border: "1px solid #ddd",
                         fontSize: "14px",
                         fontFamily: "monospace",
                         resize: "vertical"
                       }}
                     />
                   </div>
                   <div style={{ marginTop: "16px", padding: "12px", background: "#e3f2fd", borderRadius: "4px", border: "1px solid #ddd" }}>
                     <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>Aperçu</div>
                     <div style={{ padding: "12px", background: "white", borderRadius: "4px", border: "1px solid #ddd", textAlign: "center", color: "#999" }}>
                       [Aperçu du rendu final de l'email]
                     </div>
                   </div>
                 </div>
    
                 <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                   <button
                     onClick={() => {
                       setShowTemplateEditor(false);
                       setSelectedTemplate(null);
                     }}
                     style={{
                       padding: "10px 20px",
                       backgroundColor: "#6c757d",
                       color: "white",
                       border: "none",
                       borderRadius: "4px",
                       cursor: "pointer",
                       fontSize: "14px"
                     }}
                   >
                     Annuler
                   </button>
                   <button
                     onClick={() => {
                       // Sauvegarder le template
                       const updatedTemplates = emailTemplates.map(t => 
                         t.id === selectedTemplate?.id 
                           ? { ...t, name: templateForm.name, active: templateForm.active }
                           : t
                       );
                       setEmailTemplates(updatedTemplates);
                       localStorage.setItem("emailTemplates", JSON.stringify(updatedTemplates));
                       setShowTemplateEditor(false);
                       setSelectedTemplate(null);
                       alert("Template enregistré avec succès !");
                     }}
                     style={{
                       padding: "10px 20px",
                       backgroundColor: "#28a745",
                       color: "white",
                       border: "none",
                       borderRadius: "4px",
                       cursor: "pointer",
                       fontSize: "14px"
                     }}
                   >
                     Enregistrer
                   </button>
                 </div>
               </div>
             </div>
           )}
         </div>
       )}
    
       {/* Section Notifications Email */}
       {emailSubSection === "notifications" && (
         <div>
           <h2 style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "600", color: "#333", textAlign: "center" }}>
             NOTIFICATIONS EMAIL
           </h2>
           <div style={{ background: "white", borderRadius: "8px", border: "1px solid #ddd", overflow: "hidden" }}>
             <div style={{ padding: "16px", background: "#f8f9fa", borderBottom: "1px solid #ddd" }}>
               <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
                 Événements et Destinataires
               </h3>
             </div>
             <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                 <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#333", borderRight: "1px solid #ddd" }}>Événement</th>
                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#333", borderRight: "1px solid #ddd" }}>Actif</th>
                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#333" }}>Destinataires</th>
                 </tr>
               </thead>
               <tbody>
                 {emailNotifications.map((notif, index) => (
                   <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                     <td style={{ padding: "12px", color: notif.event === "Alerte Système" ? "#dc3545" : "#333", fontWeight: notif.event === "Alerte Système" ? "600" : "400" }}>
                       {notif.event}
                     </td>
                     <td style={{ padding: "12px" }}>
                       <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                         <input
                           type="checkbox"
                           checked={notif.active}
                           onChange={(e) => {
                             const updated = [...emailNotifications];
                             updated[index].active = e.target.checked;
                             setEmailNotifications(updated);
                             localStorage.setItem("emailNotifications", JSON.stringify(updated));
                           }}
                         />
                         {notif.active && <span style={{ color: "#28a745", fontSize: "16px" }}>✓</span>}
                       </label>
                     </td>
                     <td style={{ padding: "12px", color: "#333" }}>{notif.recipients}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       )}
    
       {/* Section Fréquence d'Envoi */}
       {emailSubSection === "frequency" && (
         <div>
           <h2 style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "600", color: "#333" }}>
             Fréquence d'Envoi
           </h2>
           <div style={{ border: "2px dashed #007bff", borderRadius: "8px", padding: "24px", background: "white" }}>
             <div style={{ marginBottom: "24px" }}>
               <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
                 Envoyer les emails :
               </label>
               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                 <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                   <input
                     type="radio"
                     name="frequency"
                     value="immediate"
                     checked={emailFrequency.frequency === "immediate"}
                     onChange={(e) => setEmailFrequency({ ...emailFrequency, frequency: e.target.value })}
                   />
                   <span>• Immédiatement</span>
                 </label>
                 <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                   <input
                     type="radio"
                     name="frequency"
                     value="grouped30"
                     checked={emailFrequency.frequency === "grouped30"}
                     onChange={(e) => setEmailFrequency({ ...emailFrequency, frequency: e.target.value })}
                   />
                   <span>o Grouper les emails (toutes les <span style={{ color: "#007bff" }}>30</span> minutes)</span>
                 </label>
                 <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                   <input
                     type="radio"
                     name="frequency"
                     value="grouped60"
                     checked={emailFrequency.frequency === "grouped60"}
                     onChange={(e) => setEmailFrequency({ ...emailFrequency, frequency: e.target.value })}
                   />
                   <span>o Grouper les emails (toutes les heures)</span>
                 </label>
                 <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                   <input
                     type="radio"
                     name="frequency"
                     value="daily"
                     checked={emailFrequency.frequency === "daily"}
                     onChange={(e) => setEmailFrequency({ ...emailFrequency, frequency: e.target.value })}
                   />
                   <span>o Grouper les emails (quotidiennement à <span style={{ color: "#007bff" }}>09:00</span>)</span>
                 </label>
               </div>
             </div>
    
             <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #ddd" }}>
               <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
                 Heures de Silence <span style={{ color: "#999" }}>(pas d'emails)</span>
               </label>
               <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                 <span>De :</span>
                 <div style={{ position: "relative", display: "inline-block" }}>
                   <select
                     value={emailFrequency.silenceFrom}
                     onChange={(e) => setEmailFrequency({ ...emailFrequency, silenceFrom: e.target.value })}
                     style={{
                       padding: "8px 32px 8px 12px",
                       borderRadius: "4px",
                       border: "1px solid #ddd",
                       fontSize: "14px",
                       appearance: "none"
                     }}
                   >
                     {Array.from({ length: 24 }, (_, i) => {
                       const hour = String(i).padStart(2, "0") + ":00";
                       return <option key={hour} value={hour}>{hour}</option>;
                     })}
                   </select>
                   <span style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>▼</span>
                 </div>
                 <span>À :</span>
                 <div style={{ position: "relative", display: "inline-block" }}>
                   <select
                     value={emailFrequency.silenceTo}
                     onChange={(e) => setEmailFrequency({ ...emailFrequency, silenceTo: e.target.value })}
                     style={{
                       padding: "8px 32px 8px 12px",
                       borderRadius: "4px",
                       border: "1px solid #ddd",
                       fontSize: "14px",
                       appearance: "none"
                     }}
                   >
                     {Array.from({ length: 24 }, (_, i) => {
                       const hour = String(i).padStart(2, "0") + ":00";
                       return <option key={hour} value={hour}>{hour}</option>;
                     })}
                   </select>
                   <span style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>▼</span>
                 </div>
               </div>
               <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                 <input
                   type="checkbox"
                   checked={emailFrequency.applyWeekend}
                   onChange={(e) => setEmailFrequency({ ...emailFrequency, applyWeekend: e.target.checked })}
                 />
                 <span>Appliquer le <span style={{ color: "#dc3545" }}>week-end</span> aussi</span>
               </label>
             </div>
           </div>
    
           <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
             <button
               onClick={() => {
                 setEmailFrequency({
                   frequency: "immediate",
                   groupInterval: 30,
                   dailyTime: "09:00",
                   silenceFrom: "18:00",
                   silenceTo: "09:00",
                   applyWeekend: true
                 });
               }}
               style={{
                 padding: "10px 20px",
                 backgroundColor: "#6c757d",
                 color: "white",
                 border: "none",
                 borderRadius: "4px",
                 cursor: "pointer",
                 fontSize: "14px"
               }}
             >
               Annuler
             </button>
             <button
               onClick={() => {
                 localStorage.setItem("emailFrequency", JSON.stringify(emailFrequency));
                 alert("Paramètres de fréquence enregistrés avec succès !");
               }}
               style={{
                 padding: "10px 20px",
                 backgroundColor: "#28a745",
                 color: "white",
                 border: "none",
                 borderRadius: "4px",
                 cursor: "pointer",
                 fontSize: "14px"
               }}
             >
               Enregistrer
             </button>
           </div>
         </div>
       )}
    
       {/* Section Test de Configuration */}
       {emailSubSection === "test" && (
         <div>
           <h2 style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "600", color: "#333" }}>
             2.6 Test de Configuration Email
           </h2>
           <div style={{ border: "2px dashed #007bff", borderRadius: "8px", padding: "24px", background: "white" }}>
             <div style={{ background: "#dc3545", color: "white", padding: "12px", borderRadius: "4px", marginBottom: "24px", textAlign: "center", fontWeight: "600" }}>
               TESTER LA CONFIGURATION EMAIL
             </div>
    
             <div style={{ marginBottom: "24px" }}>
               <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "600", color: "#333" }}>
                 Envoyer un Email de Test
               </h3>
               
               <div style={{ marginBottom: "16px" }}>
                 <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
                   Adresse Email de Test <span style={{ color: "#dc3545" }}>*</span>
                 </label>
                 <input
                   type="email"
                   value={testEmail.address}
                   onChange={(e) => setTestEmail({ ...testEmail, address: e.target.value })}
                   placeholder="admin@entreprise.com"
                   style={{
                     width: "100%",
                     padding: "10px",
                     borderRadius: "4px",
                     border: "1px solid #ddd",
                     fontSize: "14px"
                   }}
                 />
               </div>
    
               <div style={{ marginBottom: "16px" }}>
                 <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
                   Template à Tester <span style={{ color: "#dc3545" }}>*</span>
                 </label>
                 <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                   <select
                     value={testEmail.template}
                     onChange={(e) => setTestEmail({ ...testEmail, template: e.target.value })}
                     style={{
                       width: "100%",
                       padding: "10px 32px 10px 12px",
                       borderRadius: "4px",
                       border: "1px solid #ddd",
                       fontSize: "14px",
                       appearance: "none"
                     }}
                   >
                     <option value="">Sélectionner un template</option>
                     {emailTemplates.map((t) => (
                       <option key={t.id} value={t.name}>{t.name}</option>
                     ))}
                   </select>
                   <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>▼</span>
                 </div>
               </div>
    
               <button
                 onClick={() => {
                   if (!testEmail.address || !testEmail.template) {
                     alert("Veuillez remplir tous les champs requis");
                     return;
                   }
                   setTestResult({
                     success: true,
                     message: `Email envoyé avec succès à ${testEmail.address}`
                   });
                 }}
                 style={{
                   padding: "10px 20px",
                   backgroundColor: "#007bff",
                   color: "white",
                   border: "none",
                   borderRadius: "4px",
                   cursor: "pointer",
                   fontSize: "14px"
                 }}
               >
                 Envoyer Email de Test
               </button>
             </div>
    
             {testResult && (
               <div style={{ marginTop: "24px", padding: "16px", background: testResult.success ? "#d4edda" : "#f8d7da", borderRadius: "4px", border: `1px solid ${testResult.success ? "#c3e6cb" : "#f5c6cb"}` }}>
                 <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>Résultat :</div>
                 {testResult.success ? (
                   <>
                     <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#155724", marginBottom: "8px" }}>
                       <span style={{ fontSize: "18px" }}>✓</span>
                       <span>{testResult.message}</span>
                     </div>
                     <div style={{ fontSize: "12px", color: "#155724" }}>
                       Vérifiez votre boîte de réception (y compris les spams)
                     </div>
                   </>
                 ) : (
                   <div style={{ color: "#721c24" }}>{testResult.message}</div>
                 )}
               </div>
             )}
           </div>
         </div>
       )}
    
       {/* Section Logs d'Envoi */}
       {emailSubSection === "logs" && (
         <div>
           <h2 style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "600", color: "#333" }}>
             Logs d'Envoi
           </h2>
           <div style={{ border: "2px solid #007bff", borderRadius: "8px", padding: "24px", background: "white" }}>
             <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                 <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #007bff" }}>
                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#dc3545", borderRight: "1px solid #ddd" }}>Date/Heure</th>
                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#dc3545", borderRight: "1px solid #ddd" }}>Email Destinataire</th>
                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#dc3545", borderRight: "1px solid #ddd" }}>Template</th>
                   <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#dc3545" }}>Statut</th>
                 </tr>
               </thead>
               <tbody>
                 {emailLogs.map((log) => (
                   <tr key={log.id} style={{ borderBottom: "1px solid #ddd" }}>
                     <td style={{ padding: "12px", color: "#007bff" }}>{log.date}</td>
                     <td style={{ padding: "12px", color: "#007bff" }}>{log.recipient}</td>
                     <td style={{ padding: "12px", color: "#dc3545" }}>{log.template}</td>
                     <td style={{ padding: "12px" }}>
                       {log.status === "success" ? (
                         <span style={{ color: "#28a745" }}>✔ OK</span>
                       ) : (
                         <span style={{ color: "#dc3545" }}>❌ Erreur</span>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
    
             {emailLogs.some(log => log.status === "error") && (
               <div style={{ marginTop: "24px", padding: "16px", background: "#f8d7da", borderRadius: "4px", border: "1px solid #f5c6cb" }}>
                 <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#721c24" }}>
                   Détails de l'Erreur :
                 </div>
                 <div style={{ fontSize: "14px", color: "#721c24" }}>
                   {emailLogs.find(log => log.status === "error")?.error}
                 </div>
               </div>
             )}
           </div>
         </div>
       )}
     </div>
  );
}
