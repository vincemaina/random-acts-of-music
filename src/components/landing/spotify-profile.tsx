"use client";

import { useEffect, useState } from 'react';

interface SpotifyProfile {
    display_name: string;
    email: string;
    images: { url: string }[];
    followers: { total: number };
    country: string;
    product: string;
}

export default function SpotifyProfile() {
    const [profile, setProfile] = useState<SpotifyProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/spotify-profile');
                if (!response.ok) throw new Error('Failed to fetch profile');
                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError('Failed to load profile');
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

    if (error) return <div className="text-red-500">{error}</div>;
    if (!profile) return <div>Loading...</div>;

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
                {profile.images?.[0]?.url && (
                    <img
                        src={profile.images[0].url}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                    />
                )}
                <div>
                    <h2 className="text-xl font-bold">{profile.display_name}</h2>
                    <p className="text-gray-600">{profile.email}</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <p>Followers: {profile.followers.total}</p>
                <p>Country: {profile.country}</p>
                <p>Subscription: {profile.product}</p>
            </div>
        </div>
    );
}
