import { useState, useEffect } from "react";
import { User, Lock } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      showToast("Password updated!");
      // Clear the form after success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.error || "Failed to update password",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <h1>Account</h1>

      <div className="profile-card">
        <div className="profile-avatar">
          <User size={28} />
        </div>
        <div>
          <p className="profile-username">{user?.username}</p>
          <p className="profile-role">Administrator</p>
        </div>
      </div>

      <div className="profile-section">
        <h2>
          <Lock size={16} /> Change Password
        </h2>

        {passwordError && <p className="profile-error">{passwordError}</p>}

        <form onSubmit={handleChangePassword} className="password-form">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
