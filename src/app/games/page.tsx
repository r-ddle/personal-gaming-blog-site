import { IconDeviceGamepad, IconPlus } from "@tabler/icons-react";
import { GameLogPost, GameLogPostData } from "@/components/posts/GameLogPost";
import { AdminButtons } from "@/components/auth/AdminButtons";
import { prisma } from "@/lib/prisma";

async function getAllPosts(): Promise<GameLogPostData[]> {
  try {
    const posts = await prisma.gamePost.findMany({
      include: {
        mediaItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      game: post.game,
      platform: post.platform,
      content: post.content,
      mediaItems: post.mediaItems.map(media => ({
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
    return [];
  }
}

export default async function Games() {
  const posts = await getAllPosts();

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Gaming Posts</h1>
          <p className="subtext">All my gaming experiences and reviews</p>
        </div>
        <div className="page-actions">
          <AdminButtons />
        </div>
      </div>

      <div className="blog-games-grid">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div 
              key={post.id} 
              className="slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <GameLogPost post={post} variant="preview" />
            </div>
          ))
        ) : (
          <div className="empty-state">
            <IconDeviceGamepad size={48} />
            <h3>No gaming posts yet</h3>
            <p className="subtext">Start creating posts to share your gaming experiences!</p>
          </div>
        )}
      </div>
    </div>
  );
}