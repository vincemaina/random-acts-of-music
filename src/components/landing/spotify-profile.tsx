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
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/spotify-profile');
                if (!response.ok) throw new Error('Failed to fetch profile');
                const data = await response.json();
                console.log(data);
                setProfile(data);
            } catch (err) {
                setError('Failed to load profile');
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

    if (error) return null;
    if (!profile) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none"
            >
                {profile.images?.[0]?.url ? (
                    <img
                        src={profile.images[0].url}
                        alt={profile.display_name}
                        className="w-8 h-8 rounded-full hover:ring-2 hover:ring-gray-300 transition-all"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                            {profile.display_name?.[0]}
                        </span>
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                    <div className="flex items-center space-x-3">
                        {profile.images?.[0]?.url && (
                            <img
                                src={profile.images[0].url}
                                alt="Profile"
                                className="w-12 h-12 rounded-full"
                            />
                        )}
                        <div>
                            <h2 className="font-semibold">{profile.display_name}</h2>
                            <p className="text-sm text-gray-600">{profile.email}</p>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                        <p className="text-gray-600">Followers: {profile.followers.total}</p>
                        <p className="text-gray-600">Country: {profile.country}</p>
                        <p className="text-gray-600">Plan: {profile.product}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
