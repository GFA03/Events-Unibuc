import apiClient from '@/lib/api';
import { RegistrationDto } from '@/features/registration/types/registrationDto';

export async function fetchUserRegistrations() {
  return apiClient.get<RegistrationDto[]>('/registrations/my');
}

export async function fetchRegistration(eventId: string) {
  return apiClient.get<RegistrationDto | null>(`/registrations/${eventId}`);
}

export async function fetchEventRegistrationsCount(eventId: string) {
  return apiClient.get<number>(`/registrations/count/${eventId}`);
}
