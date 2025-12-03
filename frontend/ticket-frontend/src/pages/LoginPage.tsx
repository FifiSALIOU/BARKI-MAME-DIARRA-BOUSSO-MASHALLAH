import React from "react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);

      const res = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      if (!res.ok) {
        throw new Error("Identifiants invalides");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      
      // Récupérer les infos de l'utilisateur pour connaître son rôle
      try {
        const userRes = await fetch("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.role && userData.role.name) {
            localStorage.setItem("userRole", userData.role.name);
            console.log("Rôle utilisateur:", userData.role.name); // Debug
          }
        }
      } catch (err) {
        console.error("Erreur récupération infos utilisateur:", err);
      }
      
      onLogin(data.access_token);
      
      // Petit délai pour laisser le temps au state de se mettre à jour
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (err: any) {
      setError(err.message ?? "Erreur de connexion");
    }
  }

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: "40px auto", 
      padding: "32px",
    }}>
      <div style={{
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "32px",
        marginBottom: "24px"
      }}>
        <h1 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "600" }}>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ marginTop: "4px" }}
            />
          </div>
          <div>
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ marginTop: "4px" }}
            />
          </div>
          {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
          <button type="submit" style={{ marginTop: "8px" }}>Se connecter</button>
        </form>
      </div>

      <div style={{
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "24px"
      }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>Voir les tableaux de bord (Mode démo)</h2>
        <p style={{ color: "#666", marginBottom: "16px", fontSize: "14px" }}>
          Clique sur les liens ci-dessous pour voir les différentes interfaces sans te connecter :
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <a href="/dashboard/user" style={{ color: "#646cff", textDecoration: "none", padding: "8px", borderRadius: "4px", background: "#f5f5f5" }}>
            👤 Tableau de bord Utilisateur
          </a>
          <a href="/dashboard/secretary" style={{ color: "#646cff", textDecoration: "none", padding: "8px", borderRadius: "4px", background: "#f5f5f5" }}>
            📋 Tableau de bord Secrétaire/Adjoint DSI
          </a>
          <a href="/dashboard/technician" style={{ color: "#646cff", textDecoration: "none", padding: "8px", borderRadius: "4px", background: "#f5f5f5" }}>
            🔧 Tableau de bord Technicien
          </a>
          <a href="/dashboard/dsi" style={{ color: "#646cff", textDecoration: "none", padding: "8px", borderRadius: "4px", background: "#f5f5f5" }}>
            👔 Tableau de bord DSI
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


