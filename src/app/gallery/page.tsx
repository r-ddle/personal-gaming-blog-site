import { prisma } from "@/lib/prisma";
import { GalleryView } from "@/components/gallery/GalleryView";

export interface MediaItem {
  id: string;
  type: string;
  url: string;
  caption: string | null;
  game: string;
  createdAt: string;
}

async function getGalleryMedia(): Promise<MediaItem[]> {
  try {
    const mediaItems = await prisma.mediaItem.findMany({
      include: {
        post: {
          select: {
            game: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        post: {
          createdAt: 'desc'
        }
      }
    });

  return mediaItems.map((item: any) => ({
      id: item.id,
      type: item.type,
      url: item.url,
      caption: item.caption || `${item.post.game} media`,
      game: item.post.game,
      createdAt: item.post.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching gallery media:', error);
    return [];
  }
}

export default async function Gallery() {
  const mediaItems = await getGalleryMedia();

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Media Gallery</h1>
          <p className="subtext">Screenshots, videos, and memorable gaming moments</p>
        </div>
      </div>

      <GalleryView mediaItems={mediaItems} />
    </div>
  );
}
