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
