import React from "react";
import { useEffect, useState } from "react";

interface TechnicianDashboardProps {
  token: string;
}

interface Ticket {
  id: string;
  number: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  assigned_at: string | null;
  type: string;
  creator?: {
    full_name: string;
    agency: string | null;
  };
  attachments?: any;
}

function TechnicianDashboard({ token }: TechnicianDashboardProps) {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [requestInfoText, setRequestInfoText] = useState("");
  const [requestInfoTicket, setRequestInfoTicket] = useState<string | null>(null);
  const [resolveTicket, setResolveTicket] = useState<string | null>(null);
  const [resolutionSummary, setResolutionSummary] = useState<string>("");
  const [viewTicketDetails, setViewTicketDetails] = useState<string | null>(null);
  const [ticketDetails, setTicketDetails] = useState<Ticket | null>(null);

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await fetch("http://localhost:8000/tickets/assigned", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAllTickets(data);
        }
      } catch (err) {
        console.error("Erreur chargement tickets:", err);
      }
    }
    void loadTickets();
  }, [token]);

  async function loadTicketDetails(ticketId: string) {
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTicketDetails(data);
        setViewTicketDetails(ticketId);
      } else {
        alert("Erreur lors du chargement des détails du ticket");
      }
    } catch (err) {
      console.error("Erreur chargement détails:", err);
      alert("Erreur lors du chargement des détails");
    }
  }

  async function handleAcceptAssignment(ticketId: string) {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/accept-assignment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const ticketsRes = await fetch("http://localhost:8000/tickets/assigned", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setAllTickets(ticketsData);
        }
        alert("Assignation acceptée");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible d'accepter l'assignation"}`);
      }
    } catch (err) {
      console.error("Erreur acceptation:", err);
      alert("Erreur lors de l'acceptation");
    } finally {
      setLoading(false);
    }
  }

  async function handleRejectAssignment(ticketId: string) {
    const reason = prompt("Raison du refus (optionnel):");
    if (reason === null) return; // User cancelled

    setLoading(true);
    try {
      const url = new URL(`http://localhost:8000/tickets/${ticketId}/reject-assignment`);
      if (reason) {
        url.searchParams.append("reason", reason);
      }
      
      const res = await fetch(url.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const ticketsRes = await fetch("http://localhost:8000/tickets/assigned", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setAllTickets(ticketsData);
        }
        alert("Assignation refusée. Le ticket sera réassigné.");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible de refuser l'assignation"}`);
      }
    } catch (err) {
      console.error("Erreur refus:", err);
      alert("Erreur lors du refus");
    } finally {
      setLoading(false);
    }
  }

  async function handleTakeCharge(ticketId: string) {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "en_cours",
        }),
      });

      if (res.ok) {
        const ticketsRes = await fetch("http://localhost:8000/tickets/assigned", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setAllTickets(ticketsData);
        }
        alert("Ticket pris en charge");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible de prendre en charge"}`);
      }
    } catch (err) {
      console.error("Erreur prise en charge:", err);
      alert("Erreur lors de la prise en charge");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddComment(ticketId: string) {
    if (!commentText.trim()) {
      alert("Veuillez entrer un commentaire");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticket_id: ticketId,
          content: commentText,
          type: "technique",
        }),
      });

      if (res.ok) {
        setCommentText("");
        setSelectedTicket(null);
        alert("Commentaire ajouté avec succès");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible d'ajouter le commentaire"}`);
      }
    } catch (err) {
      console.error("Erreur ajout commentaire:", err);
      alert("Erreur lors de l'ajout du commentaire");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestInfo(ticketId: string) {
    if (!requestInfoText.trim()) {
      alert("Veuillez entrer votre demande d'information");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticket_id: ticketId,
          content: `[DEMANDE D'INFORMATION] ${requestInfoText}`,
          type: "utilisateur",  // Type utilisateur pour indiquer que c'est une demande pour l'utilisateur
        }),
      });

      if (res.ok) {
        setRequestInfoText("");
        setRequestInfoTicket(null);
        alert("Demande d'information envoyée à l'utilisateur");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible d'envoyer la demande"}`);
      }
    } catch (err) {
      console.error("Erreur demande info:", err);
      alert("Erreur lors de l'envoi de la demande");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkResolved(ticketId: string) {
    // Ouvrir le modal pour demander le résumé
    setResolveTicket(ticketId);
  }

  async function confirmMarkResolved(ticketId: string) {
    if (!resolutionSummary.trim()) {
      alert("Veuillez entrer un résumé de la résolution");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "resolu",
          resolution_summary: resolutionSummary.trim(),
        }),
      });

      if (res.ok) {
        const ticketsRes = await fetch("http://localhost:8000/tickets/assigned", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setAllTickets(ticketsData);
        }
        setResolveTicket(null);
        setResolutionSummary("");
        alert("Ticket marqué comme résolu. L'utilisateur a été notifié.");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible de marquer comme résolu"}`);
      }
    } catch (err) {
      console.error("Erreur résolution:", err);
      alert("Erreur lors de la résolution");
    } finally {
      setLoading(false);
    }
  }

  // Filtrer les tickets selon leur statut
  const assignedTickets = allTickets.filter((t) => t.status === "assigne_technicien");
  const inProgressTickets = allTickets.filter((t) => t.status === "en_cours");
  const resolvedTickets = allTickets.filter((t) => t.status === "resolu");

  const assignedCount = assignedTickets.length;
  const inProgressCount = inProgressTickets.length;
  const resolvedCount = resolvedTickets.length;

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h2>Tableau de bord - Technicien</h2>

      <div style={{ display: "flex", gap: "16px", margin: "24px 0" }}>
        <div style={{ padding: "16px", background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#2196f3" }}>{assignedCount}</div>
          <div style={{ color: "#666", marginTop: "4px" }}>Tickets assignés</div>
        </div>
        <div style={{ padding: "16px", background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ff9800" }}>{inProgressCount}</div>
          <div style={{ color: "#666", marginTop: "4px" }}>Tickets en cours</div>
        </div>
        <div style={{ padding: "16px", background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#4caf50" }}>{resolvedCount}</div>
          <div style={{ color: "#666", marginTop: "4px" }}>Tickets résolus</div>
        </div>
      </div>

      <h3 style={{ marginTop: "32px" }}>Mes tickets assignés</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Priorité</th>
            <th>Statut</th>
            <th>Assigné le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignedTickets.length === 0 && inProgressTickets.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                Aucun ticket assigné
              </td>
            </tr>
          ) : (
            <>
              {assignedTickets.map((t) => (
                <tr key={t.id}>
                  <td>#{t.number}</td>
                  <td>{t.title}</td>
                  <td>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: t.priority === "critique" ? "#f44336" : t.priority === "haute" ? "#ff9800" : t.priority === "moyenne" ? "#ffc107" : "#9e9e9e",
                      color: "white"
                    }}>
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      background: "#e3f2fd",
                      color: "#1976d2"
                    }}>
                      Assigné
                    </span>
                  </td>
                  <td>{t.assigned_at ? new Date(t.assigned_at).toLocaleString("fr-FR") : "N/A"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => loadTicketDetails(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Voir détails
                      </button>
                      <button
                        onClick={() => handleAcceptAssignment(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => handleRejectAssignment(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Refuser
                      </button>
                      <button
                        onClick={() => handleTakeCharge(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Prendre en charge
                      </button>
                      <button
                        onClick={() => setSelectedTicket(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Ajouter commentaire
                      </button>
                      <button
                        onClick={() => setRequestInfoTicket(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Demander info
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {inProgressTickets.map((t) => (
                <tr key={t.id}>
                  <td>#{t.number}</td>
                  <td>{t.title}</td>
                  <td>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: t.priority === "critique" ? "#f44336" : t.priority === "haute" ? "#ff9800" : t.priority === "moyenne" ? "#ffc107" : "#9e9e9e",
                      color: "white"
                    }}>
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      background: "#fff3e0",
                      color: "#f57c00"
                    }}>
                      En cours
                    </span>
                  </td>
                  <td>{t.assigned_at ? new Date(t.assigned_at).toLocaleString("fr-FR") : "N/A"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => loadTicketDetails(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Voir détails
                      </button>
                      <button
                        onClick={() => setSelectedTicket(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Ajouter commentaire
                      </button>
                      <button
                        onClick={() => setRequestInfoTicket(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Demander info
                      </button>
                      <button
                        onClick={() => handleMarkResolved(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Marquer résolu
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      {selectedTicket && (
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
            <h3>Ajouter un commentaire technique</h3>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Entrez votre commentaire technique..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "8px",
                marginTop: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                onClick={() => handleAddComment(selectedTicket)}
                disabled={loading || !commentText.trim()}
                style={{ flex: 1, padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Ajouter
              </button>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setCommentText("");
                }}
                style={{ flex: 1, padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {requestInfoTicket && (
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
            <h3>Demander des informations à l'utilisateur</h3>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "8px", marginBottom: "12px" }}>
              Cette demande sera envoyée à l'utilisateur créateur du ticket.
            </p>
            <textarea
              value={requestInfoText}
              onChange={(e) => setRequestInfoText(e.target.value)}
              placeholder="Quelles informations avez-vous besoin de l'utilisateur ?"
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "8px",
                marginTop: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                onClick={() => handleRequestInfo(requestInfoTicket)}
                disabled={loading || !requestInfoText.trim()}
                style={{ flex: 1, padding: "10px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Envoyer
              </button>
              <button
                onClick={() => {
                  setRequestInfoTicket(null);
                  setRequestInfoText("");
                }}
                style={{ flex: 1, padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour résumé de résolution */}
      {resolveTicket && (
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
            <h3 style={{ marginBottom: "16px" }}>Marquer le ticket comme résolu</h3>
            <p style={{ marginBottom: "16px", color: "#666", fontSize: "14px" }}>
              Veuillez fournir un résumé de la résolution. Ce résumé sera visible par l'utilisateur et enregistré dans l'historique.
            </p>
            <textarea
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              placeholder="Résumé de la résolution (actions effectuées, solution appliquée, tests effectués, etc.)"
              rows={6}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                resize: "vertical"
              }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                onClick={() => confirmMarkResolved(resolveTicket)}
                disabled={loading || !resolutionSummary.trim()}
                style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Marquer comme résolu
              </button>
              <button
                onClick={() => {
                  setResolveTicket(null);
                  setResolutionSummary("");
                }}
                style={{ flex: 1, padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour voir les détails du ticket */}
      {viewTicketDetails && ticketDetails && (
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
            maxWidth: "700px",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h3 style={{ marginBottom: "16px" }}>Détails du ticket #{ticketDetails.number}</h3>
            
            <div style={{ marginBottom: "16px" }}>
              <strong>Titre :</strong>
              <p style={{ marginTop: "4px", padding: "8px", background: "#f8f9fa", borderRadius: "4px" }}>
                {ticketDetails.title}
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <strong>Description :</strong>
              <p style={{ marginTop: "4px", padding: "8px", background: "#f8f9fa", borderRadius: "4px", whiteSpace: "pre-wrap" }}>
                {ticketDetails.description}
              </p>
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div>
                <strong>Type :</strong>
                <span style={{ marginLeft: "8px", padding: "4px 8px", background: "#e3f2fd", borderRadius: "4px" }}>
                  {ticketDetails.type === "materiel" ? "Matériel" : "Applicatif"}
                </span>
              </div>
              <div>
                <strong>Priorité :</strong>
                <span style={{
                  marginLeft: "8px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                  background: ticketDetails.priority === "critique" ? "#f44336" : ticketDetails.priority === "haute" ? "#ff9800" : ticketDetails.priority === "moyenne" ? "#ffc107" : "#9e9e9e",
                  color: "white"
                }}>
                  {ticketDetails.priority}
                </span>
              </div>
            </div>

            {ticketDetails.creator && (
              <div style={{ marginBottom: "16px" }}>
                <strong>Créateur :</strong>
                <p style={{ marginTop: "4px" }}>
                  {ticketDetails.creator.full_name}
                  {ticketDetails.creator.agency && ` - ${ticketDetails.creator.agency}`}
                </p>
              </div>
            )}

            {ticketDetails.attachments && (
              <div style={{ marginBottom: "16px" }}>
                <strong>Pièces jointes :</strong>
                <div style={{ marginTop: "8px" }}>
                  {Array.isArray(ticketDetails.attachments) && ticketDetails.attachments.length > 0 ? (
                    ticketDetails.attachments.map((att: any, idx: number) => (
                      <div key={idx} style={{ padding: "8px", marginTop: "4px", background: "#f8f9fa", borderRadius: "4px" }}>
                        {att.name || att.filename || `Fichier ${idx + 1}`}
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#999", fontStyle: "italic" }}>Aucune pièce jointe</p>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                onClick={() => {
                  setViewTicketDetails(null);
                  setTicketDetails(null);
                }}
                style={{ flex: 1, padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnicianDashboard;
