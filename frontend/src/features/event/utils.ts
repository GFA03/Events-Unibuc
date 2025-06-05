import { Event } from './model';
import toast from 'react-hot-toast';

export const handleShare = async (e: React.MouseEvent, event: Event) => {
  e.preventDefault();
  e.stopPropagation();

  const { id, name } = event;

  const shareUrl = `${window.location.origin}/events/${id}`;
  const shareData = {
    title: name,
    text: `Check out this event: ${name}`,
    url: shareUrl
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Event link copied to clipboard!');
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};
