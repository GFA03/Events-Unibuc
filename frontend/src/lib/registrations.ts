import apiClient from "@/lib/api";
import {Registration} from "@/types/registration";

export async function fetchUserRegistrationsClient(): Promise<Registration[]> {
    const response = await apiClient.get('/registrations/my');
    return response.data;
}
