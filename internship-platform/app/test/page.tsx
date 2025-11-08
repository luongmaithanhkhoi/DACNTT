// app/test/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TestPage() {
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState('')
    const [count, setCount] = useState<number | null>(null);
    useEffect(() => {
        testConnection()
    }, [])

    const testConnection = async () => {
        try {
        // Test query đơn giản
            //   const { data, error } = await supabase
            //     .from('Student')
            //     .select('full_name')
            //     .limit(1)
            const { data, count: total, error } = await supabase
                .from('Student')
                .select('full_name', { count: 'exact' })
            if (error) throw error
            setCount(total ?? 0)
            setConnected(true)
            console.log('Kết nối thành công!')
            } 
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định'
            setError(errorMessage)
            console.error('Lỗi kết nối:', err)
            }
    }

    return (
        <div style={{ padding: '2rem' }}>
        <h1>Test Supabase Connection</h1>
        {connected && <p style={{ color: 'green' }}>Kết nối thành công!</p>}
            <p style={{ color: 'red' }}>So luong student: {count}</p>
        {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

        </div>
    )
}