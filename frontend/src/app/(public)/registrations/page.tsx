'use client';

import { useEffect, useState } from 'react';
import {fetchUserRegistrationsClient} from "@/lib/registrations";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {Registration} from "@/types/registration";

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserRegistrationsClient()
            .then((data) => {
                setRegistrations(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load registrations.');
                setLoading(false);
            });
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="p-6 text-red-600">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Registrations</h1>
            {registrations.length === 0 ? (
                <p>No registrations yet.</p>
            ) : (
                <ul className="space-y-2">
                    {registrations.map((reg) => (
                        <li key={reg.id} className="bg-gray-100 rounded-md p-4">
                            <p className="font-semibold">{reg.eventDateTime.event.name}</p>
                            <p className="text-sm text-gray-600">
                                {new Date(reg.eventDateTime.startDateTime).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
