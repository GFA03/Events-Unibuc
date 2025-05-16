import {registrationEventDateTime} from "@/types/registrationEventDateTime";

export interface Registration {
    id: string;
    eventDateTime: registrationEventDateTime;
    registrationDate: Date;
}