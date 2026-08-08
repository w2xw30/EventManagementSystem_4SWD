import { useState, useEffect } from "react";
import { User, Phone, Lock } from "lucide-react";
import { clientAuthApi } from "../../api/clientAxios";
import ClientLayout from "../../components/client/ClientLayout";
import "./ClientProfile.css";

function ClientProfile() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await clientAuthApi.get("/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("clientToken")}`,
          },
        });
        setClient(response.data);
        setName(response.data.name);
        setPhoneNumber(response.data.phoneNumber);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileMessage("");
    setSavingProfile(true);

    try {
      await clientAuthApi.put(
        "/update-profile",
        { name, phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("clientToken")}`,
          },
        },
      );
      setProfileMessage("Profile updated!");
    } catch (err) {
      setProfileError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await clientAuthApi.put(
        "/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("clientToken")}`,
          },
        },
      );
      setPasswordMessage("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.error || "Failed to update password",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading)
    return (
      <ClientLayout>
        <p className="client-loading-text">Loading...</p>
      </ClientLayout>
    );

  return (
    <ClientLayout>
      <div className="client-hero-banner" style={{ paddingTop: "20px" }}>
        <h1>My Account</h1>
        <p>Manage your profile and password.</p>
      </div>

      <div className="client-profile-grid">
        <div className="client-profile-avatar-card">
          <div className="client-profile-avatar">
            <User size={30} />
          </div>
          <h3>{client?.name}</h3>
          <p>{client?.email}</p>
        </div>

        <div className="client-profile-forms">
          <form onSubmit={handleUpdateProfile} className="client-profile-form">
            <h2>Profile Details</h2>

            {profileError && (
              <p className="client-profile-error">{profileError}</p>
            )}
            {profileMessage && (
              <p className="client-profile-success">{profileMessage}</p>
            )}

            <label>Full Name</label>
            <div className="client-input-wrap">
              <User size={18} className="client-input-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <label>Phone Number</label>
            <div className="client-input-wrap">
              <Phone size={18} className="client-input-icon" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="client-btn-primary"
              disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>

          <form onSubmit={handleChangePassword} className="client-profile-form">
            <h2>
              <Lock size={16} /> Change Password
            </h2>

            {passwordError && (
              <p className="client-profile-error">{passwordError}</p>
            )}
            {passwordMessage && (
              <p className="client-profile-success">{passwordMessage}</p>
            )}

            <label>Current Password</label>
            <div className="client-input-wrap">
              <Lock size={18} className="client-input-icon" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <label>New Password</label>
            <div className="client-input-wrap">
              <Lock size={18} className="client-input-icon" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <label>Confirm New Password</label>
            <div className="client-input-wrap">
              <Lock size={18} className="client-input-icon" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="client-btn-primary"
              disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </ClientLayout>
  );
}

export default ClientProfile;
