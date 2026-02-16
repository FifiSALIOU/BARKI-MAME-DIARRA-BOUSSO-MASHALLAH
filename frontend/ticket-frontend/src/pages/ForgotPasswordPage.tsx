import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import logoImage from "../assets/logo.png";

const primaryOrange = "#f97316";
const borderColor = "#e5e7eb";
const darkText = "#111827";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data.detail || "Une erreur est survenue." });
        setLoading(false);
        return;
      }
      setMessage({
        type: "success",
        text: "Si cet email est associé à un compte, un lien de réinitialisation a été envoyé. Vérifiez votre boîte de réception et les spams.",
      });
      setEmail("");
    } catch (err) {
      setMessage({ type: "error", text: "Impossible de contacter le serveur. Réessayez plus tard." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* Panneau gauche - branding (réutilise le style login) */}
      <div style={{
        width: "50%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
        padding: "48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div>
          <img src={logoImage} alt="Logo" style={{ height: "48px", marginBottom: "48px" }} />
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", marginBottom: "16px" }}>
            Mot de passe oublié
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>
            Entrez l'adresse email de votre compte (celle que vous utilisez pour vous connecter). Nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
          © 2026 Caisse de Sécurité Sociale. Tous droits réservés.
        </div>
      </div>

      {/* Panneau droit - formulaire */}
      <div style={{
        width: "50%",
        minHeight: "100vh",
        background: "#ffffff",
        padding: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: darkText, marginBottom: "8px" }}>
            Mot de passe oublié
          </h2>
          <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "24px" }}>
            Entrez l'adresse email de votre compte (celle que vous utilisez pour vous connecter). Nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: darkText
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre.email@company.com"
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 16px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "8px",
                  fontSize: "15px",
                  background: "#fff",
                  boxSizing: "border-box",
                  color: darkText
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = primaryOrange;
                  e.target.style.outline = "none";
                }}
                onBlur={(e) => { e.target.style.borderColor = borderColor; }}
              />
            </div>

            {message && (
              <div style={{
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                background: message.type === "success" ? "#dcfce7" : "#fee2e2",
                color: message.type === "success" ? "#166534" : "#991b1b",
                fontSize: "14px"
              }}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "48px",
                background: primaryOrange,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                color: primaryOrange,
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              <ChevronLeft size={18} />
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
