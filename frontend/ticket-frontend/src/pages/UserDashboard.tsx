import React from "react";
import { useEffect, useState, FormEvent, useRef } from "react";

interface UserDashboardProps {
  token: string;
}

interface Ticket {
  id: string;
  number: number;
  title: string;
  status: string;
  priority: string;
  feedback_score?: number | null;
  technician?: {
    full_name: string;
    profile_photo_url?: string | null;
  } | null;
  created_at: string;
  assigned_at?: string | null;
}

function UserDashboard({ token: tokenProp }: UserDashboardProps) {
  // Récupérer le token depuis localStorage si le prop est vide
  const [actualToken, setActualToken] = useState<string>(() => {
    if (tokenProp && tokenProp.trim() !== "") {
      return tokenProp;
    }
    const storedToken = localStorage.getItem("token");
    return storedToken || "";
  });
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("moyenne");
  const [type, setType] = useState("materiel");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationTicket, setValidationTicket] = useState<string | null>(null);
  const [feedbackTicket, setFeedbackTicket] = useState<string | null>(null);
  const [feedbackScore, setFeedbackScore] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  
  // Mettre à jour le token si le prop change
  useEffect(() => {
    if (tokenProp && tokenProp.trim() !== "") {
      setActualToken(tokenProp);
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setActualToken(storedToken);
      } else {
        console.error("Aucun token trouvé - redirection vers la page de connexion");
        window.location.href = "/";
      }
    }
  }, [tokenProp]);

  async function loadTickets() {
    if (!actualToken || actualToken.trim() === "") {
      console.warn("Pas de token pour charger les tickets");
      return;
    }
    
    try {
      const res = await fetch("http://localhost:8000/tickets/me", {
        headers: {
          Authorization: `Bearer ${actualToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      } else if (res.status === 401) {
        // Token invalide, rediriger vers la page de connexion
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Erreur lors du chargement des tickets:", err);
    }
  }

  useEffect(() => {
    if (actualToken) {
      void loadTickets();
    }
  }, [actualToken]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Vérifier que le token existe
    if (!actualToken || actualToken.trim() === "") {
      setError("Erreur d'authentification : veuillez vous reconnecter");
      setLoading(false);
      return;
    }
    
    try {
      const requestBody = {
        title: title.trim(),
        description: description.trim(),
        priority: priority.toLowerCase(),
        type: type.toLowerCase(),
      };
      
      console.log("Envoi de la requête de création de ticket...", requestBody);
      console.log("Token utilisé:", actualToken.substring(0, 20) + "...");
      
      const res = await fetch("http://localhost:8000/tickets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${actualToken}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log("Réponse reçue:", res.status, res.statusText);
      
      if (!res.ok) {
        let errorMessage = `Erreur ${res.status}: ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {
          // Si on ne peut pas parser le JSON, utiliser le message par défaut
        }
        throw new Error(errorMessage);
      }
      
      // Succès
      const newTicket = await res.json();
      console.log("Ticket créé avec succès:", newTicket);
      setTitle("");
      setDescription("");
      setPriority("moyenne");
      setType("materiel");
      await loadTickets();
      alert("Ticket créé avec succès !");
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors de la création du ticket";
      setError(errorMsg);
      console.error("Erreur création ticket:", err);
      
      // Message plus spécifique pour "Failed to fetch"
      if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
        setError("Impossible de contacter le serveur. Vérifiez que le backend est démarré sur http://localhost:8000");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleValidateTicket(ticketId: string, validated: boolean) {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/validate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${actualToken}`,
        },
        body: JSON.stringify({ validated }),
      });

      if (res.ok) {
        await loadTickets();
        setValidationTicket(null);
        alert(validated ? "Ticket validé et clôturé avec succès !" : "Ticket rejeté. Il sera réassigné.");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible de valider le ticket"}`);
      }
    } catch (err) {
      console.error("Erreur validation:", err);
      alert("Erreur lors de la validation");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitFeedback(ticketId: string) {
    if (feedbackScore < 1 || feedbackScore > 5) {
      alert("Veuillez sélectionner un score entre 1 et 5");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/feedback`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${actualToken}`,
        },
        body: JSON.stringify({
          score: feedbackScore,
          comment: feedbackComment,
        }),
      });

      if (res.ok) {
        await loadTickets();
        setFeedbackTicket(null);
        setFeedbackScore(5);
        setFeedbackComment("");
        alert("Merci pour votre avis !");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible d'envoyer le feedback"}`);
      }
    } catch (err) {
      console.error("Erreur feedback:", err);
      alert("Erreur lors de l'envoi du feedback");
    } finally {
      setLoading(false);
    }
  }

  const opened = tickets.filter((t) => t.status !== "cloture" && t.status !== "resolu" && t.status !== "rejete").length;
  const inProgress = tickets.filter((t) => t.status === "en_cours" || t.status === "assigne_technicien").length;
  const resolved = tickets.filter((t) => t.status === "resolu" || t.status === "cloture").length;

  function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
  }

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const ticketsListRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif", background: "#f5f5f5" }}>
      {/* Sidebar */}
      <div style={{ 
        width: "250px", 
        background: "#1e293b", 
        color: "white", 
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
          <div style={{ fontSize: "24px", cursor: "pointer" }}>☰</div>
          <div style={{ fontSize: "18px", fontWeight: "600" }}>Tableau de bord</div>
        </div>
        <div 
          onClick={() => setActiveSection("dashboard")}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            padding: "12px", 
            background: activeSection === "dashboard" ? "rgba(255,255,255,0.1)" : "transparent", 
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>📊</div>
          <div>Dashboard</div>
        </div>
        <div 
          onClick={() => setShowCreateModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", cursor: "pointer" }}
        >
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>➕</div>
          <div>Créer un ticket</div>
        </div>
        <div 
          onClick={() => {
            setActiveSection("tickets");
            // Scroll vers la liste des tickets après un court délai pour laisser le DOM se mettre à jour
            setTimeout(() => {
              ticketsListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          }}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            padding: "12px", 
            background: activeSection === "tickets" ? "rgba(255,255,255,0.1)" : "transparent",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>📋</div>
          <div>Mes tickets</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px", overflow: "auto" }}>
        {/* Summary Cards - Visible seulement sur Dashboard */}
        {activeSection === "dashboard" && (
          <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <div style={{ 
            padding: "24px", 
            background: "white", 
            borderRadius: "12px", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "12px", 
              background: "#17a2b8", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "24px"
            }}>?</div>
            <div>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Tickets Ouverts</div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#007bff" }}>{opened}</div>
            </div>
          </div>
          <div style={{ 
            padding: "24px", 
            background: "white", 
            borderRadius: "12px", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "12px", 
              background: "#ff9800", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "24px"
            }}>Δ</div>
            <div>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Tickets En Cours</div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ffc107" }}>{inProgress}</div>
            </div>
          </div>
          <div style={{ 
            padding: "24px", 
            background: "white", 
            borderRadius: "12px", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "12px", 
              background: "#17a2b8", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "24px"
            }}>✓</div>
            <div>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Tickets Résolus</div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#28a745" }}>{resolved}</div>
            </div>
          </div>
          </div>
        )}

        {/* Section Header with Create Button */}
        {(activeSection === "tickets" || activeSection === "dashboard") && (
          <div ref={ticketsListRef}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#333" }}>Mes Tickets</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                Créer un nouveau ticket
              </button>
            </div>
            {/* Tickets Table */}
            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>ID</th>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Titre</th>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Statut</th>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Priorité</th>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Technicien Assigné</th>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Date</th>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                    Aucun ticket créé
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid #eee", cursor: "pointer" }}>
                    <td style={{ padding: "16px", fontWeight: "600", color: "#333" }}>#{t.number}</td>
                    <td style={{ padding: "16px", color: "#333" }}>{t.title}</td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: t.status === "en_attente_analyse" ? "#ffc107" : t.status === "assigne_technicien" ? "#007bff" : t.status === "en_cours" ? "#ff9800" : t.status === "resolu" ? "#28a745" : t.status === "cloture" ? "#6c757d" : "#dc3545",
                        color: "white"
                      }}>
                        {t.status === "en_attente_analyse" ? "En attente d'analyse" :
                         t.status === "assigne_technicien" ? "Assigné au technicien" :
                         t.status === "en_cours" ? "En cours" :
                         t.status === "resolu" ? "Résolu" :
                         t.status === "rejete" ? "Rejeté" :
                         t.status === "cloture" ? "Clôturé" : t.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: t.priority === "critique" ? "#dc3545" : t.priority === "haute" ? "#ffc107" : t.priority === "moyenne" ? "#007bff" : "#6c757d",
                        color: "white"
                      }}>
                        {t.priority}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      {t.technician ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: t.technician.profile_photo_url ? `url(${t.technician.profile_photo_url})` : "#007bff",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}>
                            {!t.technician.profile_photo_url && t.technician.full_name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: "14px", color: "#333" }}>{t.technician.full_name}</span>
                        </div>
                      ) : (
                        <span style={{ color: "#999", fontSize: "14px" }}>Non assigné</span>
                      )}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#666" }}>
                      {formatDate(t.assigned_at || t.created_at)}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {t.status === "resolu" ? (
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleValidateTicket(t.id, true); }}
                              disabled={loading}
                              style={{ fontSize: "11px", padding: "4px 8px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                            >
                              Valider
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleValidateTicket(t.id, false); }}
                              disabled={loading}
                              style={{ fontSize: "11px", padding: "4px 8px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                            >
                              Rejeter
                            </button>
                          </div>
                        ) : t.status === "cloture" && !t.feedback_score ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); setFeedbackTicket(t.id); }}
                            disabled={loading}
                            style={{ fontSize: "11px", padding: "4px 8px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Donner mon avis
                          </button>
                        ) : t.status === "cloture" && t.feedback_score ? (
                          <span style={{ color: "#28a745", fontSize: "12px" }}>
                            ✓ Avis donné ({t.feedback_score}/5)
                          </span>
                        ) : null}
                        <span style={{ fontSize: "18px", color: "#999", cursor: "pointer" }}>→</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
          </div>
        )}
        {/* Create Ticket Modal */}
        {showCreateModal && (
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
              padding: "32px",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#333" }}>Créer un nouveau ticket</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setError(null);
                    setTitle("");
                    setDescription("");
                    setPriority("moyenne");
                    setType("materiel");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#999"
                  }}
                >
                  ×
                </button>
              </div>
              {error && (
                <div style={{
                  padding: "12px",
                  marginBottom: "16px",
                  background: "#ffebee",
                  color: "#c62828",
                  borderRadius: "4px",
                  border: "1px solid #ef5350"
                }}>
                  <strong>Erreur :</strong> {error}
                </div>
              )}
              <form onSubmit={(e) => {
                handleCreate(e);
                if (!error) {
                  setShowCreateModal(false);
                }
              }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Titre</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
            rows={4}
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", resize: "vertical" }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
          >
            <option value="materiel">Matériel</option>
            <option value="applicatif">Applicatif</option>
          </select>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Priorité</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
          >
            <option value="faible">Faible</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
            <option value="critique">Critique</option>
          </select>
        </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                  <button type="submit" disabled={loading || !title.trim() || !description.trim()} style={{
                    flex: 1,
                    padding: "12px 24px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}>
                    {loading ? "Création en cours..." : "Soumettre le ticket"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setError(null);
                      setTitle("");
                      setDescription("");
                      setPriority("moyenne");
                      setType("materiel");
                    }}
                    style={{
                      padding: "12px 24px",
                      background: "#f5f5f5",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600"
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

              {/* Modal de validation */}
              {validationTicket && (
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
                    padding: "24px",
                    borderRadius: "8px",
                    maxWidth: "500px",
                    width: "90%"
                  }}>
                    <h3 style={{ marginBottom: "16px" }}>Valider la résolution</h3>
                    <p style={{ marginBottom: "16px", color: "#666" }}>
                      Le problème a-t-il été résolu de manière satisfaisante ?
                    </p>
                    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                      <button
                        onClick={() => handleValidateTicket(validationTicket, true)}
                        disabled={loading}
                        style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Oui, valider
                      </button>
                      <button
                        onClick={() => handleValidateTicket(validationTicket, false)}
                        disabled={loading}
                        style={{ flex: 1, padding: "10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Non, rejeter
                      </button>
                      <button
                        onClick={() => setValidationTicket(null)}
                        style={{ flex: 1, padding: "10px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal de feedback */}
              {feedbackTicket && (
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
                    padding: "24px",
                    borderRadius: "8px",
                    maxWidth: "500px",
                    width: "90%"
                  }}>
                    <h3 style={{ marginBottom: "16px" }}>Formulaire de satisfaction</h3>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                        Notez votre satisfaction (1-5) :
                      </label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            onClick={() => setFeedbackScore(score)}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              border: "2px solid",
                              borderColor: feedbackScore === score ? "#007bff" : "#ddd",
                              background: feedbackScore === score ? "#007bff" : "white",
                              color: feedbackScore === score ? "white" : "#333",
                              cursor: "pointer",
                              fontSize: "18px",
                              fontWeight: "bold"
                            }}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                        Commentaire (optionnel) :
                      </label>
                      <textarea
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="Votre avis..."
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          resize: "vertical"
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                      <button
                        onClick={() => handleSubmitFeedback(feedbackTicket)}
                        disabled={loading || feedbackScore < 1 || feedbackScore > 5}
                        style={{ flex: 1, padding: "10px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Envoyer
                      </button>
                      <button
                        onClick={() => {
                          setFeedbackTicket(null);
                          setFeedbackScore(5);
                          setFeedbackComment("");
                        }}
                        style={{ flex: 1, padding: "10px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

        export default UserDashboard;


