interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  img_logo_url: string;
  playtime_2weeks?: number;
}

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

const STEAM_API_KEY = '06519B76A0E15644F52F1735DF6532CF';
const STEAM_ID = '76561198042423399'; // fallback Steam ID
const CUSTOM_URL = 'everybodyhatesriddle';

// Resolve custom URL to Steam ID
export async function resolveSteamId(customUrl: string = CUSTOM_URL): Promise<string> {
  try {
    const response = await fetch(`/api/steam?endpoint=resolve_vanity_url&vanityurl=${customUrl}`);
    
    if (!response.ok) {
      throw new Error('Failed to resolve Steam ID');
    }
    
    const data = await response.json();
    if (data.response?.success === 1) {
      return data.response.steamid;
    } else {
      // Fallback to default Steam ID if resolution fails
      return STEAM_ID;
    }
  } catch (error) {
    console.error('Error resolving Steam ID:', error);
    return STEAM_ID;
  }
}

// Convert Steam profile URL to Steam ID
export function getSteamIdFromUrl(profileUrl: string): string {
  // Extract custom URL from profile URL
  const match = profileUrl.match(/steamcommunity\.com\/id\/([^\/]+)/);
  if (match) {
    return match[1];
  }
  return STEAM_ID;
}

export async function getSteamPlayerSummary(steamId: string = STEAM_ID): Promise<SteamPlayerSummary | null> {
  try {
    const response = await fetch(`/api/steam?endpoint=player_summary&steamid=${steamId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Steam player summary');
    }
    
    const data = await response.json();
    return data.response?.players?.[0] || null;
  } catch (error) {
    console.error('Error fetching Steam player summary:', error);
    return null;
  }
}

export async function getSteamOwnedGames(steamId: string = STEAM_ID): Promise<SteamGame[]> {
  try {
    const response = await fetch(`/api/steam?endpoint=owned_games&steamid=${steamId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Steam owned games');
    }
    
    const data = await response.json();
    return data.response?.games || [];
  } catch (error) {
    console.error('Error fetching Steam owned games:', error);
    return [];
  }
}

export async function getSteamRecentlyPlayedGames(steamId: string = STEAM_ID): Promise<SteamRecentlyPlayedGame[]> {
  try {
    const response = await fetch(`/api/steam?endpoint=recently_played&steamid=${steamId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Steam recently played games');
    }
    
    const data = await response.json();
    return data.response?.games || [];
  } catch (error) {
    console.error('Error fetching Steam recently played games:', error);
    return [];
  }
}

export async function getSteamGameDetails(appId: number): Promise<any> {
  try {
    const response = await fetch(`/api/steam?endpoint=game_details&appid=${appId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Steam game details');
    }
    
    const data = await response.json();
    return data[appId]?.data || null;
  } catch (error) {
    console.error('Error fetching Steam game details:', error);
    return null;
  }
}

// Helper function to format playtime
export function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  if (hours < 1) {
    return `${minutes}m`;
  } else if (hours < 100) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${hours}h`;
  }
}

// Helper function to get game icon URL
export function getSteamGameIconUrl(appId: number, iconHash: string): string {
  return `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${iconHash}.jpg`;
}

// Helper function to get game logo URL
export function getSteamGameLogoUrl(appId: number, logoHash: string): string {
  return `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${logoHash}.jpg`;
}