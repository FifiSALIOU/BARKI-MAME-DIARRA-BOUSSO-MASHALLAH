import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Lock, Eye, EyeOff } from "lucide-react";
import logoImage from "../assets/logo.png";

const primaryOrange = "#f97316";
const borderColor = "#e5e7eb";
const darkText = "#111827";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Les deux mots de passe ne correspondent pas." });
      return;
    }
    if (!token || loading) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data.detail || "Lien invalide ou expiré. Refaites une demande de réinitialisation." });
        setLoading(false);
        return;
      }
      setMessage({ type: "success", text: "Mot de passe mis à jour. Vous pouvez vous connecter." });
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage({ type: "error", text: "Impossible de contacter le serveur. Réessayez plus tard." });
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
        <div style={{ textAlign: "center", padding: "24px" }}>
          <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "16px" }}>
            Lien invalide ou manquant. Veuillez utiliser le lien reçu par email ou refaire une demande de réinitialisation.
          </p>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            style={{
              padding: "10px 20px",
              background: primaryOrange,
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Demander un nouveau lien
          </button>
          <div style={{ marginTop: "24px" }}>
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
                cursor: "pointer"
              }}
            >
              <ChevronLeft size={18} />
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
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
            Nouveau mot de passe
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>
            Définissez un nouveau mot de passe sécurisé pour votre compte.
          </p>
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
          © 2026 Caisse de Sécurité Sociale. Tous droits réservés.
        </div>
      </div>

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
            Définir un nouveau mot de passe
          </h2>
          <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "24px" }}>
            Saisissez votre nouveau mot de passe ci-dessous (au moins 6 caractères).
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
                Nouveau mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  pointerEvents: "none"
                }}>
                  <Lock size={20} />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    height: "48px",
                    paddingLeft: "48px",
                    paddingRight: "48px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    fontSize: "15px",
                    background: "#fff",
                    boxSizing: "border-box",
                    color: darkText
                  }}
                  onFocus={(e) => { e.target.style.borderColor = primaryOrange; }}
                  onBlur={(e) => { e.target.style.borderColor = borderColor; }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af"
                  }}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: darkText
              }}>
                Confirmer le mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  pointerEvents: "none"
                }}>
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    height: "48px",
                    paddingLeft: "48px",
                    paddingRight: "48px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    fontSize: "15px",
                    background: "#fff",
                    boxSizing: "border-box",
                    color: darkText
                  }}
                  onFocus={(e) => { e.target.style.borderColor = primaryOrange; }}
                  onBlur={(e) => { e.target.style.borderColor = borderColor; }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af"
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
              {loading ? "Enregistrement..." : "Valider le mot de passe"}
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
