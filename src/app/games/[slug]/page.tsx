import { IconStar, IconClock, IconCalendar, IconShare, IconPhoto, IconVideo, IconArrowLeft } from "@tabler/icons-react";
import { GameLogPost, GameLogPostData } from "@/components/posts/GameLogPost";
import { Comments } from "@/components/comments/Comments";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ShareButton } from "@/components/ui/ShareButton";

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getGameLogPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - Tom Riddle\'s Gaming Log',
    };
  }

  const firstImage = post.mediaItems.find(item => item.type === 'screenshot')?.url;
  
  return {
    title: `${post.title} - ${post.game} | Tom Riddle's Gaming Log`,
    description: post.content.substring(0, 160) + (post.content.length > 160 ? '...' : ''),
    openGraph: {
      title: `${post.title} - ${post.game}`,
      description: post.content.substring(0, 160) + (post.content.length > 160 ? '...' : ''),
      type: 'article',
      publishedTime: post.createdAt,
      authors: ['Tom Riddle'],
      images: firstImage ? [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: `${post.game} screenshot`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} - ${post.game}`,
      description: post.content.substring(0, 160) + (post.content.length > 160 ? '...' : ''),
      images: firstImage ? [firstImage] : [],
    },
  };
}

async function getGameLogPost(slug: string): Promise<GameLogPostData | null> {
  try {
    const post = await prisma.gamePost.findUnique({
      where: { id: slug },
      include: {
        mediaItems: true
      }
    });

    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      game: post.game,
      platform: post.platform,
      content: post.content,
      mediaItems: post.mediaItems.map(media => ({
        type: media.type as 'screenshot' | 'video',
        url: media.url,
        caption: media.caption || undefined
      })),
      createdAt: post.createdAt.toISOString(),
      playtime: post.playtime || undefined,
      rating: post.rating || undefined,
      mood: post.mood as 'excited' | 'frustrated' | 'satisfied' | 'disappointed' | 'amazed'
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Fallback mock data for development
const getGameLogPostMock = (slug: string): GameLogPostData | null => {
  const posts: Record<string, GameLogPostData> = {
    'elden-ring-malenia': {
      id: slug,
      title: "Finally beat the final boss after 20 attempts!",
      game: "Elden Ring",
      platform: "PC",
      content: `Holy crap, what a journey! Just spent the last 3 hours fighting Malenia and I finally got her. The satisfaction is unreal. Those waterfowl dance attacks were absolutely brutal but once you learn the timing it becomes manageable.

The key was realizing I needed to use Bloodhound's Step to dodge through the first flurry, then run away from the second and third. Once I figured that out, the fight became much more manageable, though still incredibly challenging.

Can't believe I'm saying this but I actually want to fight her again in NG+. This game has absolutely ruined me for other games - nothing else feels as tight and rewarding as these boss fights.

The level design leading up to her is also phenomenal. The Haligtree is probably my favorite area in the entire game, even though it's absolutely brutal. Every enemy placement feels deliberate and the verticality is insane.

Now onto Mohg and then I think I'll finally be ready for the DLC when it drops!`,
      mediaItems: [
        { type: "screenshot", url: "/victory.jpg", caption: "Victory screen after 20+ attempts!" },
        { type: "video", url: "/boss-fight.mp4", caption: "The final moments of the fight" },
        { type: "screenshot", url: "/malenia.jpg", caption: "Malenia in all her terrifying glory" },
        { type: "video", url: "/waterfowl.mp4", caption: "Learning to dodge the waterfowl dance" }
      ],
      createdAt: "2024-01-15T20:30:00Z",
      playtime: "156 hours",
      rating: 5,
      mood: "amazed"
    },
    'baldurs-gate-difficulty': {
      id: slug,
      title: "This game's difficulty is getting ridiculous",
      game: "Baldur's Gate 3",
      platform: "Steam Deck",
      content: `I love this game but some of these encounters are just unfair. Just spent 2 hours on one fight because the enemy AI always targets my weakest character first. The tactical combat is great when it works but sometimes RNG just screws you over completely.

Don't get me wrong - I absolutely love the depth and strategy involved. When everything clicks, it's pure gaming bliss. But man, some of these difficulty spikes are brutal.

The worst part is when you have a perfect strategy planned out, execute it flawlessly, and then miss three 85% chance attacks in a row. Like, come on! I know it's probability but it feels personal at this point.

Still gonna keep playing though because when you pull off an amazing combo or perfect positioning, it feels incredible. Just needed to rant about this particular fight that's been kicking my ass.`,
      mediaItems: [
        { type: "screenshot", url: "/death-screen.jpg", caption: "Another party wipe..." },
        { type: "screenshot", url: "/tactical-view.jpg", caption: "Planning my 47th attempt" }
      ],
      createdAt: "2024-01-14T16:45:00Z",
      playtime: "89 hours",
      rating: 4,
      mood: "frustrated"
    }
  };
  
  return posts[slug] || null;
};

const getGameData = (slug: string) => {
  const games: Record<string, any> = {
    'zelda-tears-of-the-kingdom': {
      id: 1,
      title: "The Legend of Zelda: Tears of the Kingdom",
      platform: "Nintendo Switch",
      status: "Currently Playing",
      playtime: "45 hours",
      rating: 5,
      dateStarted: "2024-01-10",
      thoughts: "The building mechanics are absolutely incredible. Every puzzle feels fresh and the world is so immersive.",
      fullReview: `
        This game has completely blown me away. From the moment I stepped back into Hyrule, I knew this was going to be something special. The building mechanics using the Ultrahand ability have opened up infinite possibilities for creative problem-solving.

        **What I Love:**
        - The freedom to approach every situation differently
        - Incredible physics system that just works
        - Beautiful art direction and music
        - So many "wow" moments discovering new areas

        **Current Progress:**
        I'm about 45 hours in and still discovering new mechanics and areas. Currently working through the main questline while getting constantly distracted by side content (in the best way possible).

        **Memorable Moments:**
        - Building my first flying machine and actually getting it to work
        - The emotional reunion with familiar characters
        - Discovering the underground areas - completely unexpected!

        This is definitely going to be one of my all-time favorites. Can't wait to see what else Nintendo has hidden in this massive world.
      `,
      screenshots: [
        { id: 1, caption: "My first successful flying machine build!", type: "screenshot" },
        { id: 2, caption: "This view from the sky islands is breathtaking", type: "screenshot" },
        { id: 3, caption: "Link figuring out a complex puzzle", type: "screenshot" },
        { id: 4, caption: "Epic boss battle moments", type: "video" },
        { id: 5, caption: "Building the most ridiculous contraption ever", type: "video" }
      ]
    },
    'baldurs-gate-3': {
      id: 2,
      title: "Baldur's Gate 3",
      platform: "PC",
      status: "Completed",
      playtime: "120 hours",
      rating: 5,
      dateStarted: "2023-12-01",
      dateCompleted: "2024-01-05",
      thoughts: "Phenomenal RPG experience. The character development and story choices blew my mind.",
      fullReview: `
        After 120 hours, I can confidently say this is one of the best RPGs ever made. The depth of character interactions and meaningful choices sets a new standard for the genre.

        **What Made This Special:**
        - Every conversation felt meaningful
        - Companions with actual depth and development
        - Consequences that matter throughout the entire game
        - Combat that's both strategic and fun

        **My Playthrough:**
        Played as a Half-Elf Warlock with a focus on charisma-based solutions. The relationship dynamics between party members created some of the most memorable gaming moments I've experienced.

        **Final Thoughts:**
        This game respects your intelligence and choices. Multiple playthroughs are definitely in my future because I know there's so much content I missed. Larian Studios has created something truly special here.
      `,
      screenshots: [
        { id: 6, caption: "Character creation - spent 2 hours on this!", type: "screenshot" },
        { id: 7, caption: "Epic party battle scene", type: "video" },
        { id: 8, caption: "Emotional story moment with Shadowheart", type: "screenshot" }
      ]
    }
  };
  
  return games[slug];
};

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const post = await getGameLogPost(slug);
  
  if (!post) {
    return (
      <div className="page-container">
        <div className="center-column-container">
          <h1>Post not found</h1>
          <p className="subtext">The gaming post you're looking for doesn't exist.</p>
          <Link href="/" className="button">
            <IconArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <Link href="/" className="button">
            <IconArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
        <div className="page-actions">
          <ShareButton 
            title={`${post.title} - ${post.game}`}
            description={`Check out my gaming experience with ${post.game}: ${post.content.substring(0, 100)}...`}
          />
        </div>
      </div>

      <div className="game-detail-post">
        <GameLogPost post={post} variant="full" />
        
        <div className="post-engagement">
          <div className="engagement-stats">
            <span className="stat-item">Posted {new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="stat-item">{post.mediaItems.length} media items</span>
            <span className="stat-item">{post.content.split(' ').length} words</span>
          </div>
          
          <div className="post-tags">
            <span className="post-tag">{post.game}</span>
            <span className="post-tag">{post.platform}</span>
            <span className="post-tag">{post.mood}</span>
            {post.rating && <span className="post-tag">★ {post.rating}/5</span>}
          </div>
        </div>

        <Comments postId={post.id} />
      </div>
    </div>
  );
}