'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface EnterpriseProfileData {
    user: {
        id: string;
        email: string;
        role: 'ENTERPRISE';
    };
    enterprise: {
        id: string;
        name: string;
        description?: string;
        industry?: string;
        image_url?: string;
        website?: string;
        contact_email?: string;
        location?: string;
        address?: string;
        created_at: string;
        updated_at: string;
    };
}

export function useEnterpriseProfile() {
    const router = useRouter();
    const [data, setData] = useState<EnterpriseProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
                return;
            }

            const res = await fetch('/api/enterprises/me', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`, // ← THÊM DÒNG NÀY
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                    return;
                }
                const errJson = await res.json();
                throw new Error(errJson.error || 'Không thể tải thông tin doanh nghiệp');
            }

            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
            console.error('Fetch enterprise profile error:', err);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error };
}