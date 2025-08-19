import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.gamePost.findMany({
      include: {
        mediaItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const post = await prisma.gamePost.create({
      data: {
        title: data.title,
        game: data.game,
        gameLogo: data.gameLogo || null,
        platform: data.platform,
        content: data.content,
        playtime: data.playtime || null,
        rating: data.rating || null,
        mood: data.mood,
        mediaItems: {
          create: (data.mediaItems || []).map((media: any) => ({
            type: media.type,
            url: media.url,
            caption: media.caption || null
          }))
        }
      },
      include: {
        mediaItems: true
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    await prisma.gamePost.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'fix-media-types') {
      // Auto-detect and fix media types for all posts
      const posts = await prisma.gamePost.findMany({
        include: { mediaItems: true }
      });

      let fixedCount = 0;

      for (const post of posts) {
        for (const media of post.mediaItems) {
          const correctType = detectMediaType(media.url, media.type as any);
          
          if (correctType !== media.type) {
            await prisma.mediaItem.update({
              where: { id: media.id },
              data: { type: correctType }
            });
            fixedCount++;
          }
        }
      }

      return NextResponse.json({ 
        message: `Fixed ${fixedCount} media items`,
        fixedCount 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in PATCH:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

function detectMediaType(url: string, currentType: string): string {
  // If it's a YouTube URL, always return youtube
  if (url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/)) {
    return 'youtube';
  }
  
  // Check if it's an image URL by file extension or known image hosts
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
  const imageHosts = /(imgur\.com|i\.imgur\.com|cdn\.discordapp\.com|steamuserimages)/i;
  
  if (imageExtensions.test(url) || imageHosts.test(url)) {
    return 'screenshot';
  }
  
  // Check if it's a video URL by file extension
  const videoExtensions = /\.(mp4|webm|avi|mov|wmv|flv|mkv)(\?.*)?$/i;
  if (videoExtensions.test(url)) {
    return 'video';
  }
  
  // Fall back to current type
  return currentType;
}