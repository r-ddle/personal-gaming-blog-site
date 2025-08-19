import { IconDeviceGamepad, IconPhoto, IconStar, IconClock, IconPlus, IconMoodHappy } from "@tabler/icons-react";
import { GameLogPost, GameLogPostData } from "@/components/posts/GameLogPost";
import { QuickRant, QuickRantData } from "@/components/posts/QuickRant";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminButtons } from "@/components/auth/AdminButtons";
import { SteamProfile } from "@/components/steam/SteamProfile";
import { ScreenshotGrid } from "@/components/ui/ScreenshotGrid";
import { ContentRenderer } from "@/components/content/ContentRenderer";

async function getPosts(): Promise<GameLogPostData[]> {
  try {
    const posts = await prisma.gamePost.findMany({
      include: {
        mediaItems: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });

  return posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      game: post.game,
      platform: post.platform,
      content: post.content,
  mediaItems: post.mediaItems.map((media: any) => ({
        type: media.type as 'screenshot' | 'video' | 'youtube',
        url: media.url,
        caption: media.caption || undefined
      })),
      createdAt: post.createdAt.toISOString(),
      playtime: post.playtime || undefined,
      rating: post.rating || undefined,
      mood: post.mood as 'excited' | 'frustrated' | 'satisfied' | 'disappointed' | 'amazed'
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return []; // Return empty array instead of mock data
  }
}

async function getRants(): Promise<QuickRantData[]> {
  try {
    const rants = await prisma.quickRant.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

  return rants.map((rant: any) => ({
      id: rant.id,
      game: rant.game,
      content: rant.content,
      mood: rant.mood as 'angry' | 'happy' | 'sad' | 'neutral',
      createdAt: rant.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching rants:', error);
    return []; // Return empty array instead of mock data
  }
}

async function getCurrentlyPlaying() {
  try {
    // Get the most recent post that has a playtime (indicating active play)
    const currentGame = await prisma.gamePost.findFirst({
      where: {
        playtime: {
          not: null
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return currentGame ? {
      title: currentGame.game,
      platform: currentGame.platform,
      playtime: currentGame.playtime,
      rating: currentGame.rating
    } : null;
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return null;
  }
}

async function getGameStats() {
  try {
    const totalGames = await prisma.gamePost.count();
    const posts = await prisma.gamePost.findMany({
      where: {
        playtime: {
          not: null
        }
      },
      select: {
        playtime: true
      }
    });

    // Calculate total playtime (assumes format like "45 hours", "120h", etc.)
    let totalHours = 0;
  posts.forEach((post: any) => {
      if (post.playtime) {
        const match = post.playtime.match(/(\d+)/);
        if (match) {
          totalHours += parseInt(match[1]);
        }
      }
    });

    return {
      totalGames,
      totalHours: totalHours > 0 ? `${totalHours}h` : '0h'
    };
  } catch (error) {
    console.error('Error fetching game stats:', error);
    return { totalGames: 0, totalHours: '0h' };
  }
}

async function getRecentGames() {
  try {
    const games = await prisma.gamePost.findMany({
      select: {
        game: true,
        platform: true,
        rating: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      distinct: ['game'],
      take: 5
    });

  return games.map((game: any) => ({
      title: game.game,
      platform: game.platform,
      status: 'Completed', // We could add a status field to the schema later
      rating: game.rating
    }));
  } catch (error) {
    console.error('Error fetching recent games:', error);
    return [];
  }
}

async function getLatestScreenshots() {
  try {
    const screenshots = await prisma.mediaItem.findMany({
      where: {
        type: 'screenshot'
      },
      include: {
        post: {
          select: {
            game: true
          }
        }
      },
      orderBy: {
        post: {
          createdAt: 'desc'
        }
      },
      take: 4
    });

  return screenshots.map((screenshot: any) => ({
      url: screenshot.url,
      caption: screenshot.caption || `${screenshot.post.game} screenshot`,
      game: screenshot.post.game
    }));
  } catch (error) {
    console.error('Error fetching screenshots:', error);
    return [];
  }
}

async function getLatestReview() {
  try {
    const latestPost = await prisma.gamePost.findFirst({
      where: {
        rating: {
          not: null
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        game: true,
        content: true,
        rating: true
      }
    });

    if (!latestPost) return null;

    return {
      game: latestPost.game,
      content: latestPost.content.substring(0, 150) + (latestPost.content.length > 150 ? '...' : ''),
      rating: latestPost.rating
    };
  } catch (error) {
    console.error('Error fetching latest review:', error);
    return null;
  }
}


export default async function Home() {
  const posts = await getPosts();
  const rants = await getRants();
  const currentlyPlaying = await getCurrentlyPlaying();
  const gameStats = await getGameStats();
  const recentGames = await getRecentGames();
  const latestScreenshots = await getLatestScreenshots();
  const latestReview = await getLatestReview();

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>Tom Riddle's Gaming Log</h1>
        <p className="subtext">My personal gaming journey, rants, and epic moments</p>
      </div>

      <div className="bento-grid">
        <div className="bento-item bento-small current-game">
          <div className="current-game-bg"></div>
          <div className="current-game-content">
            <div className="current-game-info">
              {currentlyPlaying ? (
                <>
                  <span className="currently-playing-badge">Currently Playing</span>
                  <h2>{currentlyPlaying.title}</h2>
                  <p className="subtext">{currentlyPlaying.playtime} • {currentlyPlaying.platform}</p>
                  {currentlyPlaying.rating && (
                    <div className="game-rating">
                      {[...Array(5)].map((_, i) => (
                        <IconStar key={i} size={16} className={i < currentlyPlaying.rating! ? "star-filled" : "star-empty"} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <span className="currently-playing-badge">No Game Active</span>
                  <h2>Start Your Gaming Journey</h2>
                  <p className="subtext">Share your first gaming experience!</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bento-item bento-small  recent-games">
          <div className="bento-header">
            <IconDeviceGamepad size={18} />
            <h3>Recent Games</h3>
          </div>
          <div className="recent-games-list">
            {recentGames.slice(0, 2).map((game: any, index: number) => (
              <div key={index} className="recent-game-item">
                <div className="game-placeholder small"></div>
                <div>
                  <h4>{game.title}</h4>
                  <p className="subtext">{game.status}</p>
                  {game.rating && (
                    <div className="game-rating-mini">
                      {[...Array(game.rating)].map((_, i) => (
                        <IconStar key={i} size={10} className="star-filled" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {recentGames.length === 0 && (
              <div className="empty-state-mini">
                <p className="subtext">No games yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bento-item bento-small recent-screenshots">
          <div className="bento-header">
            <IconPhoto size={18} />
            <h3>Latest Screenshots</h3>
          </div>
          <ScreenshotGrid screenshots={latestScreenshots} />
        </div>

        <div className="bento-item bento-small latest-review">
          <div className="review-content">
            <h4>Latest Review</h4>
            {latestReview ? (
              <>
                <div className="review-text">
                  <ContentRenderer content={latestReview.content} />
                </div>
                <div className="review-meta">
                  <span className="review-game">{latestReview.game}</span>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <IconStar key={i} size={12} className={i < latestReview.rating! ? "star-filled" : "star-empty"} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state-mini">
                <p className="subtext">No reviews yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bento-item bento-small recent-activity">
          <div className="bento-header">
            <IconMoodHappy size={18} />
            <h4>Quick Rants</h4>
          </div>
          <div className="rants-mini-feed">
            {rants.slice(0, 2).map((rant) => (
              <div key={rant.id} className="mini-rant">
                <div className="mini-rant-game">{rant.game}</div>
                <div className="mini-rant-content">{rant.content.substring(0, 60)}...</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-item bento-small  steam-profile-section">
          <SteamProfile />
        </div>
      </div>

      <div className="content-sections">
        <section className="latest-posts-section">
          <div className="section-header">
            <h2>Latest Gaming Posts</h2>
            <AdminButtons />
          </div>
          <div className="blog-games-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <GameLogPost key={post.id} post={post} variant="preview" />
              ))
            ) : (
              <div className="empty-state">
                <h3>No gaming posts yet</h3>
                <p className="subtext">Start sharing your gaming experiences!</p>
              </div>
            )}
          </div>
        </section>

        <section className="quick-rants-section">
          <div className="section-header">
            <h2>Recent Rants & Quick Thoughts</h2>
            <AdminButtons variant="rant" />
          </div>
          <div className="rants-feed">
            {rants.length > 0 ? (
              rants.map((rant) => (
                <QuickRant key={rant.id} rant={rant} />
              ))
            ) : (
              <div className="empty-state">
                <h3>No rants yet</h3>
                <p className="subtext">Share your gaming thoughts and frustrations!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
