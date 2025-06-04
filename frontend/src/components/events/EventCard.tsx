import { Event } from '@/features/event/model';
import GridEventCard from '@/components/events/GridEventCard';
import ListEventCard from '@/components/events/ListEventCard';

type EventProps = {
  event: Event;
  viewMode?: 'grid' | 'list';
};

export default function EventCard({ event, viewMode = 'list' }: EventProps) {
  if (viewMode === 'list') {
    return <ListEventCard event={event} />;
  }
  return <GridEventCard event={event} />;
}
