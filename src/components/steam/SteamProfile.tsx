"use client";

import { useState, useEffect } from "react";
import { IconBrandSteam, IconClock, IconDeviceGamepad, IconExternalLink } from "@tabler/icons-react";
import { getSteamPlayerSummary, getSteamRecentlyPlayedGames, formatPlaytime, getSteamGameIconUrl, resolveSteamId } from "@/lib/steam";

interface SteamPlayerSummary {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  realname?: string;
  timecreated?: number;
  loccountrycode?: string;
}

interface SteamRecentlyPlayedGame {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  img_logo_url: string;
}

export function SteamProfile() {
  const [playerSummary, setPlayerSummary] = useState<SteamPlayerSummary | null>(null);
  const [recentGames, setRecentGames] = useState<SteamRecentlyPlayedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteamData = async () => {
      try {
        setLoading(true);
        
        // First resolve the Steam ID from custom URL
        const steamId = await resolveSteamId();
        
        // Fetch player summary and recent games using the resolved Steam ID
        const [summary, games] = await Promise.all([
          getSteamPlayerSummary(steamId),
          getSteamRecentlyPlayedGames(steamId)
        ]);

        setPlayerSummary(summary);
        setRecentGames(games.slice(0, 3)); // Show only top 3 recent games
        setError(null);
      } catch (err) {
        setError('Failed to load Steam data');
        console.error('Steam data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSteamData();
  }, []);

  if (loading) {
    return (
      <div className="steam-profile-card">
        <div className="bento-header">
          <IconBrandSteam size={18} />
          <h3>Steam Profile</h3>
        </div>
        <div className="steam-profile-body">
          <div className="loading-skeleton steam-loading"></div>
        </div>
      </div>
    );
  }

  if (error || !playerSummary) {
    return (
      <div className="steam-profile-card">
        <div className="bento-header">
          <IconBrandSteam size={18} />
          <h3>Steam Profile</h3>
        </div>
        <div className="steam-profile-body">
          <div className="empty-state-mini">
            <p className="subtext">{error || 'Unable to load Steam profile'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getPersonaStateText = (state: number) => {
    switch (state) {
      case 0: return 'Offline';
      case 1: return 'Online';
      case 2: return 'Busy';
      case 3: return 'Away';
      case 4: return 'Snooze';
      case 5: return 'Looking to trade';
      case 6: return 'Looking to play';
      default: return 'Unknown';
    }
  };

  const getPersonaStateColor = (state: number) => {
    switch (state) {
      case 1: return 'var(--green)';
      case 2: return 'var(--red)';
      case 3: return 'var(--orange)';
      default: return 'var(--gray)';
    }
  };

  return (
    <div className="steam-profile-card">
      <div className="bento-header">
        <IconBrandSteam size={18} />
        <h3>Steam Profile</h3>
        <a 
          href={playerSummary.profileurl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="external-link"
        >
          <IconExternalLink size={16} />
        </a>
      </div>

      <div className="steam-profile-body">
        <div className="steam-player-section">
          <div className="steam-avatar-container">
            <img 
              src={playerSummary.avatarmedium} 
              alt={playerSummary.personaname}
              className="steam-avatar"
            />
            <div 
              className="steam-status-dot"
              style={{ backgroundColor: getPersonaStateColor(playerSummary.personastate) }}
            ></div>
          </div>
          
          <div className="steam-player-info">
            <h4 className="steam-username">{playerSummary.personaname}</h4>
            <div 
              className="steam-status" 
              style={{ color: getPersonaStateColor(playerSummary.personastate) }}
            >
              {getPersonaStateText(playerSummary.personastate)}
            </div>
          </div>
        </div>

        {recentGames.length > 0 && (
          <div className="steam-games-section">
            <div className="steam-section-title">Recently Played</div>
            <div className="steam-games-list">
              {recentGames.map((game) => (
                <div key={game.appid} className="steam-game-item">
                  <div className="steam-game-icon">
                    <img 
                      src={getSteamGameIconUrl(game.appid, game.img_icon_url)}
                      alt={game.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="steam-game-details">
                    <div className="steam-game-name">{game.name}</div>
                    <div className="steam-game-time">
                      <IconClock size={12} />
                      <span>{formatPlaytime(game.playtime_forever)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}