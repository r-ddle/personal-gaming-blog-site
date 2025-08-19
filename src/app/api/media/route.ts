import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const mediaItems = await prisma.mediaItem.findMany({
      include: {
        post: {
          select: {
            game: true,
            title: true
          }
        }
      },
      orderBy: {
        post: {
          createdAt: 'desc'
        }
      }
    });

    const formattedMedia = mediaItems.map(item => ({
      id: item.id,
      type: item.type,
      url: item.url,
      caption: item.caption || `${item.post.game} media`,
      game: item.post.game,
      postId: item.postId
    }));

    return NextResponse.json(formattedMedia);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.url || !data.caption || !data.game || !data.type) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Auto-detect media type based on URL
    const detectMediaType = (url: string, selectedType: string): string => {
      if (url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/)) {
        return 'youtube';
      }
      
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
      const imageHosts = /(imgur\.com|i\.imgur\.com|cdn\.discordapp\.com|steamuserimages)/i;
      
      if (imageExtensions.test(url) || imageHosts.test(url)) {
        return 'screenshot';
      }
      
      const videoExtensions = /\.(mp4|webm|avi|mov|wmv|flv|mkv)(\?.*)?$/i;
      if (videoExtensions.test(url)) {
        return 'video';
      }
      
      return selectedType;
    };

    const detectedType = detectMediaType(data.url, data.type);

    // Create a standalone media post for organization
    const post = await prisma.gamePost.create({
      data: {
        title: `Media: ${data.caption}`,
        game: data.game,
        platform: 'Various',
        content: `Media uploaded: ${data.caption}`,
        mood: 'satisfied'
      }
    });

    const mediaItem = await prisma.mediaItem.create({
      data: {
        type: detectedType,
        url: data.url,
        caption: data.caption,
        postId: post.id
      }
    });

    return NextResponse.json({
      id: mediaItem.id,
      type: mediaItem.type,
      url: mediaItem.url,
      caption: mediaItem.caption,
      game: data.game,
      postId: post.id
    });
  } catch (error) {
    console.error('Error creating media:', error);
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }

    // Get the media item to find its associated post
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id },
      select: { postId: true }
    });

    if (!mediaItem) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Delete the media item first
    await prisma.mediaItem.delete({
      where: { id }
    });

    // Check if this was the only media item for this post, and if it's a standalone media post
    const remainingMediaCount = await prisma.mediaItem.count({
      where: { postId: mediaItem.postId }
    });

    const post = await prisma.gamePost.findUnique({
      where: { id: mediaItem.postId },
      select: { 
        title: true,
        content: true
      }
    });

    // If no remaining media and it's a standalone media post, delete the post too
    if (remainingMediaCount === 0 && post?.title.startsWith('Media:') && post?.content.startsWith('Media uploaded:')) {
      await prisma.gamePost.delete({
        where: { id: mediaItem.postId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}