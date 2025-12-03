import React from "react";
import { useEffect, useState } from "react";

interface SecretaryDashboardProps {
  token: string;
}

interface Ticket {
  id: string;
  number: number;
  title: string;
  creator_id: string;
  creator?: {
    full_name: string;
    email: string;
    agency: string | null;
  };
  user_agency: string | null;  // Agence de l'utilisateur créateur
  priority: string;
  status: string;
  technician_id: string | null;
}

interface Technician {
  id: string;
  full_name: string;
  email: string;
  specialization?: string | null;
  assigned_tickets_count?: number;
  in_progress_tickets_count?: number;
}

function SecretaryDashboard({ token }: SecretaryDashboardProps) {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [assignmentNotes, setAssignmentNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Charger tous les tickets
        const ticketsRes = await fetch("http://localhost:8000/tickets/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setAllTickets(ticketsData);
        }

        // Charger la liste des techniciens
        const techRes = await fetch("http://localhost:8000/users/technicians", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (techRes.ok) {
          const techData = await techRes.json();
          setTechnicians(techData);
        }
      } catch (err) {
        console.error("Erreur chargement données:", err);
      }
    }
    void loadData();
  }, [token]);

  async function handleAssign(ticketId: string) {
    if (!selectedTechnician) {
      alert("Veuillez sélectionner un technicien");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          technician_id: selectedTechnician,
          reason: "Assignation par Secrétaire/Adjoint DSI",
          notes: assignmentNotes || undefined,
        }),
      });

      if (res.ok) {
        // Recharger les tickets
        const ticketsRes = await fetch("http://localhost:8000/tickets/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setAllTickets(ticketsData);
        }
        setSelectedTicket(null);
        setSelectedTechnician("");
        setAssignmentNotes("");
        alert("Ticket assigné avec succès");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible d'assigner le ticket"}`);
      }
    } catch (err) {
      console.error("Erreur assignation:", err);
      alert("Erreur lors de l'assignation");
    } finally {
      setLoading(false);
    }
  }

  async function handleReassign(ticketId: string) {
    if (!selectedTechnician) {
      alert("Veuillez sélectionner un technicien");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/reassign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          technician_id: selectedTechnician,
          reason: "Réassignation par " + (selectedTicket === ticketId ? "l'agent" : ""),
        }),
      });

      if (res.ok) {
        const ticketsRes = await fetch("http://localhost:8000/tickets/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setAllTickets(ticketsData);
        }
        setSelectedTicket(null);
        setSelectedTechnician("");
        alert("Ticket réassigné avec succès");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible de réassigner le ticket"}`);
      }
    } catch (err) {
      console.error("Erreur réassignation:", err);
      alert("Erreur lors de la réassignation");
    } finally {
      setLoading(false);
    }
  }

  async function handleEscalate(ticketId: string) {
    if (!confirm("Êtes-vous sûr de vouloir escalader ce ticket ? La priorité sera augmentée.")) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/escalate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const ticketsRes = await fetch("http://localhost:8000/tickets/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setAllTickets(ticketsData);
        }
        alert("Ticket escaladé avec succès");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible d'escalader le ticket"}`);
      }
    } catch (err) {
      console.error("Erreur escalade:", err);
      alert("Erreur lors de l'escalade");
    } finally {
      setLoading(false);
    }
  }

  async function handleClose(ticketId: string) {
    if (!confirm("Êtes-vous sûr de vouloir clôturer ce ticket ?")) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "cloture",
        }),
      });

      if (res.ok) {
        const ticketsRes = await fetch("http://localhost:8000/tickets/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setAllTickets(ticketsData);
        }
        alert("Ticket clôturé avec succès");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible de clôturer le ticket"}`);
      }
    } catch (err) {
      console.error("Erreur clôture:", err);
      alert("Erreur lors de la clôture");
    } finally {
      setLoading(false);
    }
  }

  async function handleReopen(ticketId: string) {
    if (!selectedTechnician) {
      alert("Veuillez sélectionner un technicien pour la réouverture");
      return;
    }

    if (!confirm("Êtes-vous sûr de vouloir réouvrir ce ticket et le réassigner ?")) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/tickets/${ticketId}/reopen`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          technician_id: selectedTechnician,
          reason: "Réouverture après rejet utilisateur",
        }),
      });

      if (res.ok) {
        const ticketsRes = await fetch("http://localhost:8000/tickets/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setAllTickets(ticketsData);
        }
        setSelectedTicket(null);
        setSelectedTechnician("");
        alert("Ticket réouvert et réassigné avec succès");
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.detail || "Impossible de réouvrir le ticket"}`);
      }
    } catch (err) {
      console.error("Erreur réouverture:", err);
      alert("Erreur lors de la réouverture");
    } finally {
      setLoading(false);
    }
  }

  // Filtrer les tickets selon leur statut
  const pendingTickets = allTickets.filter((t) => t.status === "en_attente_analyse");
  const assignedTickets = allTickets.filter((t) => t.status === "assigne_technicien" || t.status === "en_cours");
  const resolvedTickets = allTickets.filter((t) => t.status === "resolu");
  const closedTickets = allTickets.filter((t) => t.status === "cloture");

  const pendingCount = pendingTickets.length;
  const assignedCount = assignedTickets.length;
  const resolvedCount = resolvedTickets.length;

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h2>Tableau de bord - Secrétaire/Adjoint DSI</h2>

      <div style={{ display: "flex", gap: "16px", margin: "24px 0" }}>
        <div style={{ padding: "16px", background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ff9800" }}>{pendingCount}</div>
          <div style={{ color: "#666", marginTop: "4px" }}>Tickets en attente</div>
        </div>
        <div style={{ padding: "16px", background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#2196f3" }}>{assignedCount}</div>
          <div style={{ color: "#666", marginTop: "4px" }}>Tickets assignés</div>
        </div>
        <div style={{ padding: "16px", background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#4caf50" }}>{resolvedCount}</div>
          <div style={{ color: "#666", marginTop: "4px" }}>Tickets résolus</div>
        </div>
      </div>

      <h3 style={{ marginTop: "32px" }}>Tickets en attente d'analyse</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ background: "#f8f9fa" }}>
            <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>ID</th>
            <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Titre</th>
            <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Nom</th>
            <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Agence</th>
            <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Priorité</th>
            <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Statut</th>
            <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allTickets.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                Aucun ticket
              </td>
            </tr>
          ) : (
            allTickets.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px 16px" }}>#{t.number}</td>
                <td style={{ padding: "12px 16px" }}>{t.title}</td>
                <td style={{ padding: "12px 16px" }}>
                  {t.creator ? t.creator.full_name : "N/A"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {t.creator ? (t.creator.agency || t.user_agency || "N/A") : (t.user_agency || "N/A")}
                </td>
                <td style={{ padding: "12px 16px" }}>
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
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                    background: t.status === "en_attente_analyse" ? "#ffc107" : 
                               t.status === "assigne_technicien" ? "#007bff" : 
                               t.status === "en_cours" ? "#ff9800" : 
                               t.status === "resolu" ? "#28a745" : 
                               t.status === "cloture" ? "#6c757d" :
                               t.status === "rejete" ? "#dc3545" : "#e0e0e0",
                    color: "white"
                  }}>
                    {t.status === "en_attente_analyse" ? "En attente" :
                     t.status === "assigne_technicien" ? "Assigné" :
                     t.status === "en_cours" ? "En cours" :
                     t.status === "resolu" ? "Résolu" :
                     t.status === "cloture" ? "Clôturé" :
                     t.status === "rejete" ? "Rejeté" : t.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {t.status === "en_attente_analyse" ? (
                    // Actions pour tickets en attente
                    selectedTicket === t.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start", flexWrap: "wrap" }}>
                        <select
                          value={selectedTechnician}
                          onChange={(e) => setSelectedTechnician(e.target.value)}
                          style={{ padding: "4px 8px", fontSize: "12px", minWidth: "200px" }}
                        >
                          <option value="">Sélectionner un technicien</option>
                          {technicians.map((tech) => {
                            const workload = tech.assigned_tickets_count || 0;
                            const specialization = tech.specialization ? ` (${tech.specialization})` : "";
                            return (
                              <option key={tech.id} value={tech.id}>
                                {tech.full_name}{specialization} - {workload} ticket(s)
                              </option>
                            );
                          })}
                        </select>
                        <textarea
                          value={assignmentNotes}
                          onChange={(e) => setAssignmentNotes(e.target.value)}
                          placeholder="Notes/Instructions pour le technicien (optionnel)"
                          rows={2}
                          style={{
                            width: "100%",
                            padding: "6px",
                            fontSize: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px"
                          }}
                        />
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button
                            onClick={() => handleAssign(t.id)}
                            disabled={loading || !selectedTechnician}
                            style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTicket(null);
                              setSelectedTechnician("");
                              setAssignmentNotes("");
                            }}
                            style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => setSelectedTicket(t.id)}
                          disabled={loading}
                          style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Assigner
                        </button>
                        <button
                          onClick={() => handleEscalate(t.id)}
                          disabled={loading}
                          style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#ff9800", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Escalader
                        </button>
                      </div>
                    )
                  ) : t.status === "assigne_technicien" || t.status === "en_cours" ? (
                    // Actions pour tickets assignés/en cours
                    selectedTicket === t.id ? (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <select
                          value={selectedTechnician}
                          onChange={(e) => setSelectedTechnician(e.target.value)}
                          style={{ padding: "4px 8px", fontSize: "12px", minWidth: "150px" }}
                        >
                          <option value="">Sélectionner un technicien</option>
                          {technicians.map((tech) => {
                            const workload = tech.assigned_tickets_count || 0;
                            const specialization = tech.specialization ? ` (${tech.specialization})` : "";
                            return (
                              <option key={tech.id} value={tech.id}>
                                {tech.full_name}{specialization} - {workload} ticket(s)
                              </option>
                            );
                          })}
                        </select>
                        <button
                          onClick={() => handleReassign(t.id)}
                          disabled={loading}
                          style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTicket(null);
                            setSelectedTechnician("");
                          }}
                          style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => setSelectedTicket(t.id)}
                          disabled={loading}
                          style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Réassigner
                        </button>
                        <button
                          onClick={() => handleEscalate(t.id)}
                          disabled={loading}
                          style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#ff9800", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Escalader
                        </button>
                      </div>
                    )
                  ) : t.status === "resolu" ? (
                    // Action pour tickets résolus
                    <button
                      onClick={() => handleClose(t.id)}
                      disabled={loading}
                      style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Clôturer
                    </button>
                  ) : t.status === "rejete" ? (
                    // Action pour tickets rejetés - Réouverture
                    selectedTicket === t.id ? (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <select
                          value={selectedTechnician}
                          onChange={(e) => setSelectedTechnician(e.target.value)}
                          style={{ padding: "4px 8px", fontSize: "12px", minWidth: "150px" }}
                        >
                          <option value="">Sélectionner un technicien</option>
                          {technicians.map((tech) => {
                            const workload = tech.assigned_tickets_count || 0;
                            const specialization = tech.specialization ? ` (${tech.specialization})` : "";
                            return (
                              <option key={tech.id} value={tech.id}>
                                {tech.full_name}{specialization} - {workload} ticket(s)
                              </option>
                            );
                          })}
                        </select>
                        <button
                          onClick={() => handleReopen(t.id)}
                          disabled={loading || !selectedTechnician}
                          style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTicket(null);
                            setSelectedTechnician("");
                          }}
                          style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTicket(t.id)}
                        disabled={loading}
                        style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Réouvrir
                      </button>
                    )
                  ) : (
                    // Pas d'action pour tickets clôturés
                    <span style={{ color: "#999", fontSize: "12px" }}>
                      {t.status === "cloture" ? "Clôturé" : "N/A"}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SecretaryDashboard;
