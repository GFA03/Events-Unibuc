import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useEvent } from '@/features/event/hooks/useEvent';
import { useRegistration } from '@/features/registration/hooks';
import { Role } from '@/features/user/types/roles';
import apiClient from '@/lib/api';

export function useEventDetails() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const queryClient = useQueryClient();

  const { data: event, isLoading, isError } = useEvent(id);
  const { user, isAuthenticated } = useAuth();
  const { data: registration } = useRegistration(id);

  const isOrganizer = user?.id === event?.organizerId;
  const isAdmin = user?.role === Role.Admin;
  const canManageEvent = isOrganizer || isAdmin;
  const isRegistered = !!registration;

  const handleJoin = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isRegistered) {
      toast.error('You are already registered for this event.');
      return;
    }

    try {
      await apiClient.post('registrations', {
        eventId: event?.id
      });
      toast.success('Registration successful!');
      await queryClient.invalidateQueries({ queryKey: ['event', id] });
      await queryClient.invalidateQueries({ queryKey: ['registration', id] });
      await queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Registration failed!', error);
        toast.error(error.response?.data?.message || 'Registration failed!');
        return;
      }
      console.error('Registration failed!', error);
      toast.error('Registration failed!');
    }
  };

  const handleUnjoin = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isRegistered) {
      toast.error('You are not registered for this event.');
      return;
    }

    try {
      await apiClient.delete(`registrations/${registration?.id}`);
      toast.success('Unregistration successful!');
      await queryClient.invalidateQueries({ queryKey: ['event', id] });
      await queryClient.invalidateQueries({ queryKey: ['registration', id] });
      await queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Unregistration failed!', error);
        toast.error(error.response?.data?.message || 'Unregistration failed!');
        return;
      }
      console.error('Unregistration failed!', error);
      toast.error('Unregistration failed!');
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;

    try {
      await apiClient.delete(`events/${id}`);
      toast.success('Event deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['myEvents'] });
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['event', id] });
      router.push('/events');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Failed to delete event!', error);
        toast.error(error.response?.data?.message || 'Failed to delete event!');
        return;
      }
      console.error('Failed to delete event!', error);
      toast.error('Failed to delete event!');
    }
  };

  return {
    event,
    isLoading,
    isError,
    isRegistered,
    canManageEvent,
    handleJoin,
    handleUnjoin,
    handleDelete
  };
}
