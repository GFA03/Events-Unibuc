import { Registration } from '@/features/registration/model';
import {
  fetchEventRegistrationsCount,
  fetchRegistration,
  fetchUserRegistrations
} from '@/features/registration/api';

class RegistrationService {
  async fetchMyRegistrations(): Promise<Registration[]> {
    const { data } = await fetchUserRegistrations();
    return data.map((dto) => Registration.fromDto(dto));
  }

  async fetchRegistration(eventId: string): Promise<Registration> {
    const { data } = await fetchRegistration(eventId);
    return Registration.fromDto(data);
  }

  async getEventRegistrationsCount(eventId: string): Promise<number> {
    const { data } = await fetchEventRegistrationsCount(eventId);
    return data;
  }
}

export const registrationService = new RegistrationService();
