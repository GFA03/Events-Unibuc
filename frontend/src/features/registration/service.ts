import { Registration } from '@/features/registration/model';
import { fetchRegistration, fetchUserRegistrations } from '@/features/registration/api';

class RegistrationService {
  async fetchMyRegistrations(): Promise<Registration[]> {
    const { data } = await fetchUserRegistrations();
    return data.map((dto) => Registration.fromDto(dto));
  }

  async fetchRegistration(eventId: string): Promise<Registration> {
    const { data } = await fetchRegistration(eventId);
    return Registration.fromDto(data);
  }
}

export const registrationService = new RegistrationService();
