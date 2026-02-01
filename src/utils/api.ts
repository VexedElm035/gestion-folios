const API_URL = 'http://192.168.1.172:8000/api';

export const api = {
    checkPhone: async (telefono: string) => {
        const res = await fetch(`${API_URL}/auth/check-phone`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telefono }),
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Error checking phone');
        }
        return res.json();
    },

    sendCode: async (telefono: string) => {
        const res = await fetch(`${API_URL}/auth/code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telefono }),
        });
        if (!res.ok) throw new Error('Error sending code');
        return res.json();
    },

    verifyCode: async (telefono: string, code: string) => {
        const res = await fetch(`${API_URL}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telefono, code }),
        });
        if (!res.ok) throw new Error('Códgio inválido');
        return res.json(); // Should contain { verification_token }
    },

    register: async (data: any) => {
        const res = await fetch(`${API_URL}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Error registering');
        }
        return res.json();
    },

    getParticipants: async () => {
        const res = await fetch(`${API_URL}/participants`);
        if (!res.ok) throw new Error('Error fetching participants');
        return res.json();
    },

    deleteParticipant: async (id: string) => {
        const res = await fetch(`${API_URL}/participants/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error eliminando participante');
        return res.json();
    },

    updateParticipant: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/participants/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Error actualizando participante');
        }
        return res.json();
    }
};
