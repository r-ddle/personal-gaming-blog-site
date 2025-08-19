import { IconSettings, IconPalette, IconDatabase, IconUser, IconShield } from "@tabler/icons-react";

export default function Settings() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Settings</h1>
          <p className="subtext">Customize your gaming log experience</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <div className="settings-section-header">
            <IconPalette size={20} />
            <h3>Appearance</h3>
          </div>
          
          <div className="settings-options">
            <div className="setting-item">
              <label className="setting-label">
                <span>Theme</span>
                <span className="subtext">Choose your preferred color scheme</span>
              </label>
              <select className="setting-select">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label className="setting-label">
                <span>Compact Mode</span>
                <span className="subtext">Use smaller cards and spacing</span>
              </label>
              <input type="checkbox" className="setting-toggle" />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <IconDatabase size={20} />
            <h3>Data & Storage</h3>
          </div>
          
          <div className="settings-options">
            <div className="setting-item">
              <label className="setting-label">
                <span>Auto-backup</span>
                <span className="subtext">Automatically backup your data</span>
              </label>
              <input type="checkbox" className="setting-toggle" defaultChecked />
            </div>
            
            <div className="setting-item">
              <label className="setting-label">
                <span>Image Quality</span>
                <span className="subtext">Screenshot upload quality</span>
              </label>
              <select className="setting-select">
                <option>Original</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            
            <div className="setting-item">
              <button className="button">Export Data</button>
              <button className="button">Import Data</button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <IconUser size={20} />
            <h3>Profile</h3>
          </div>
          
          <div className="settings-options">
            <div className="setting-item">
              <label className="setting-label">
                <span>Display Name</span>
                <span className="subtext">How you want to be identified</span>
              </label>
              <input type="text" className="setting-input" placeholder="Enter your name" />
            </div>
            
            <div className="setting-item">
              <label className="setting-label">
                <span>Gaming Platforms</span>
                <span className="subtext">Platforms you game on</span>
              </label>
              <div className="platform-tags">
                <span className="platform-tag active">PC</span>
                <span className="platform-tag active">PlayStation 5</span>
                <span className="platform-tag">Xbox Series X</span>
                <span className="platform-tag active">Nintendo Switch</span>
                <span className="platform-tag">Steam Deck</span>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <IconShield size={20} />
            <h3>Privacy & Security</h3>
          </div>
          
          <div className="settings-options">
            <div className="setting-item">
              <label className="setting-label">
                <span>Analytics</span>
                <span className="subtext">Help improve the app with usage data</span>
              </label>
              <input type="checkbox" className="setting-toggle" />
            </div>
            
            <div className="setting-item">
              <button className="button">Clear Cache</button>
              <button className="button">Reset Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}