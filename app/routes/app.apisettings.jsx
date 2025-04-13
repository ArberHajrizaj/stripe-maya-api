import React, { useEffect, useState } from "react";
// import prisma from "../db.server";
// import { corsHeaders, handlePreflight } from "../utils/cors";
// import { isAuthorized } from "../utils/auth";

const ApiSettings = () => {
  const [settings, setSettings] = useState({
    stripePublishKey: "",
    stripeSecretKey: "",
    mayaApiKey: "",
    mayaSecretKey: "",
  });

  const API_TOKEN = "W_U87e4JjWXfh2nfENRgsFJJmYQA";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSettings = async () => {
    try {
      setError("");
      const response = await fetch("/api/settings", {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch settings.");
      }
      const data = await response.json();
      setSettings({
        stripePublishKey: data.stripePublishKey || "",
        stripeSecretKey: data.stripeSecretKey || "",
        mayaApiKey: data.mayaApiKey || "",
        mayaSecretKey: data.mayaSecretKey || "",
      });
    } catch (err) {
      console.error("Error fetching settings:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSettings(); // Fetch settings on mount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(""); // Clear errors
      setSuccess(""); // Clear success messages
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        throw new Error("Failed to save settings.");
      }
      setSuccess("Settings updated successfully!");
      fetchSettings(); // Refresh settings after saving
    } catch (err) {
      console.error("Save error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div>
      {/* Inline CSS */}
      <style>{`
        .api-settings-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f4f4f4;
          font-family: Arial, sans-serif;
        }

        .api-settings-card {
          background: white;
          padding: 20px 30px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
        }

        .api-settings-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
          color: #333;
        }

        .api-settings-error {
          background-color: #ffe5e5;
          color: #d9534f;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 14px;
        }

        .api-settings-success {
          background-color: #e5ffe5;
          color: #4caf50;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 14px;
        }

        .api-settings-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .api-settings-field label {
          font-weight: 600;
          color: #555;
          margin-bottom: 5px;
          display: block;
        }

        .api-settings-field input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        .api-settings-field input:focus {
          outline: none;
          border-color: #007bff;
        }

        .api-settings-button {
          background-color: #007bff;
          color: white;
          font-weight: bold;
          padding: 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .api-settings-button:hover {
          background-color: #0056b3;
        }
      `}</style>

      {/* Form */}
      <div className="api-settings-container">
        <div className="api-settings-card">
          <h2 className="api-settings-title">API Settings</h2>
          {error && <div className="api-settings-error">{error}</div>}
          {success && <div className="api-settings-success">{success}</div>}
          <form onSubmit={handleSubmit} className="api-settings-form">
            <div className="api-settings-field">
              <label>Stripe Publish Key:</label>
              <input
                type="text"
                name="stripePublishKey"
                value={settings.stripePublishKey}
                onChange={handleChange}
              />
            </div>
            <div className="api-settings-field">
              <label>Stripe Secret Key:</label>
              <input
                type="text"
                name="stripeSecretKey"
                value={settings.stripeSecretKey}
                onChange={handleChange}
              />
            </div>
            <div className="api-settings-field">
              <label>Maya API Key:</label>
              <input
                type="text"
                name="mayaApiKey"
                value={settings.mayaApiKey}
                onChange={handleChange}
              />
            </div>
            <div className="api-settings-field">
              <label>Maya Secret Key:</label>
              <input
                type="text"
                name="mayaSecretKey"
                value={settings.mayaSecretKey}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="api-settings-button">
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApiSettings;
