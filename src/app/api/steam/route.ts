import { NextRequest, NextResponse } from 'next/server';

const STEAM_API_KEY = '06519B76A0E15644F52F1735DF6532CF';
// First, let's try to resolve the custom URL to Steam ID
const CUSTOM_URL = 'everybodyhatesriddle';
let STEAM_ID = '76561198042423399'; // fallback Steam ID

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const steamId = searchParams.get('steamid') || STEAM_ID;
    const appId = searchParams.get('appid');

    let apiUrl = '';

    switch (endpoint) {
      case 'resolve_vanity_url':
        const vanityUrl = searchParams.get('vanityurl') || CUSTOM_URL;
        apiUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${vanityUrl}`;
        break;
      case 'player_summary':
        apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`;
        break;
      case 'owned_games':
        apiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;
        break;
      case 'recently_played':
        apiUrl = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&count=10`;
        break;
      case 'game_details':
        if (!appId) {
          return NextResponse.json({ error: 'App ID required for game details' }, { status: 400 });
        }
        apiUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Steam API request failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Steam API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch Steam data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}