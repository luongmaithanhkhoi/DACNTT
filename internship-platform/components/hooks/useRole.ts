"use client";

import { useState, useEffect } from 'react';

export function useRole() {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [enterpriseId, setEnterpriseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem('user_role');
    const savedUserId = localStorage.getItem('app_user_id');
    const savedEnterpriseId = localStorage.getItem('enterprise_id');

    setRole(savedRole);
    setUserId(savedUserId);
    setEnterpriseId(savedEnterpriseId);
    setLoading(false);
  }, []);

  return { role, userId, enterpriseId, loading };
}