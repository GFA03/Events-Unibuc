export enum EventType {
  WORKSHOP = 'WORKSHOP',
  EVENT = 'EVENT'
}

export const mapToType = (type: string) => {
  switch (type) {
    case 'WORKSHOP':
      return EventType.WORKSHOP;
    case 'EVENT':
      return EventType.EVENT;
    default:
      throw new Error(`Unknown role: ${type}`);
  }
};

export const eventTypeColor = (type: string) => {
  switch (type) {
    case 'WORKSHOP':
      return 'bg-amber-100 text-amber-800'
    case 'EVENT':
      return 'bg-indigo-100 text-indigo-800'
    default:
      return 'bg-red-100 text-red-800'
  }
}