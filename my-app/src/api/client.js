import axios from 'axios';

// Configure axios with the direct backend URL
const client = axios.create({
    baseURL: 'https://server-test-1-cogx.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const todoApi = {
    getAll: () => client.get('/todos'),
    // Update create to accept an object payload
    create: (payload) => {
        // If payload is a string (legacy support/backward compatibility), treat it as text
        if (typeof payload === 'string') {
            return client.post('/todos', { text: payload, completed: false });
        }
        // Otherwise spread the object (text, image, etc.)
        return client.post('/todos', { ...payload, completed: false });
    },
    update: (id, updates) => client.patch(`/todos/${id}`, updates),
    delete: (id) => client.delete(`/todos/${id}`),
};

export default client;
