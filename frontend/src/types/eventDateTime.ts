export class EventDateTime {
  public readonly id: string;
  public readonly eventId: string;
  public readonly startDateTime: Date;
  public readonly endDateTime: Date;

  constructor(id: string, eventId: string, startDateTime: string, endDateTime: string) {
    this.id = id;
    this.eventId = eventId;
    this.startDateTime = new Date(startDateTime);
    this.endDateTime = new Date(endDateTime);
  }
}
