const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_EVENT_IMAGE = 'https://picsum.photos/seed/eventify-default/800/600';

export function resolveEventImageUrl(event: {
  id?: string | number;
  image?: string;
  imageUrl?: string;
  images?: { filePath?: string }[];
}): string {
  if (event.imageUrl?.startsWith('http')) return event.imageUrl;
  if (event.image?.startsWith('http')) return event.image;

  const filePath = event.images?.[0]?.filePath;
  if (filePath) {
    if (filePath.startsWith('http')) return filePath;
    return `${API_BASE}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  }

  if (event.id != null) {
    return `https://picsum.photos/seed/eventify-${event.id}/800/600`;
  }

  return DEFAULT_EVENT_IMAGE;
}

export function mapEventForCard(event: {
  id: string | number;
  title: string;
  startDate?: string;
  date?: string;
  price?: number | null;
  venue?: { name?: string; address?: string };
  location?: string;
  image?: string;
  imageUrl?: string;
  images?: { filePath?: string }[];
}) {
  const venue = event.venue;
  const location =
    event.location ??
    (venue
      ? [venue.name, venue.address].filter(Boolean).join(', ')
      : '');

  return {
    id: event.id,
    title: event.title,
    date: event.startDate ?? event.date ?? '',
    location,
    price: event.price ?? 0,
    image: resolveEventImageUrl(event),
  };
}
