import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { todoApi } from '../../api/client';

// Async Thunks
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await todoApi.getAll();
    return response.data;
});

// Updated to accept an object with text and optional image
export const addNewTodo = createAsyncThunk('todos/addNewTodo', async ({ text, image }) => {
    const payload = { text, image, completed: false };
    // The API client's create method might need adjustment if it expects just 'text'
    // But usually we can just pass the whole object or adjust the client.
    // Let's assume we'll update client.js or just pass the payload directly if client.create takes an object.
    // Checking client.js... client.create takes (text). We should update it or use a generic post.
    // Actually, client.js create method: create: (text) => client.post('/todos', { text, completed: false }),
    // We should probably update the API client first or bypass it here. 
    // Let's update this thunk to use the client.post directly or update client.js.
    // For now, let's assume we will update client.js to be more flexible or just use the axios client directly here?
    // No, better to stick to the pattern. I will update client.js in the next step to support payload objects.
    // Wait, I can't update two files in one step efficiently if I don't plan it.
    // Let's check client.js content again.
    // "create: (text) => client.post('/todos', { text, completed: false })"
    // I will assume I will update client.js to take a payload object.

    // For this file, I'll call a hypothetical todoApi.createV2 or just expect todoApi.create to handle it.
    // Let's rewrite the thunk to pass the full object.
    const response = await todoApi.create({ text, image });
    return response.data;
});

export const toggleTodoStatus = createAsyncThunk('todos/toggleTodoStatus', async ({ id, completed }) => {
    const response = await todoApi.update(id, { completed });
    return response.data;
});

export const updateTodoText = createAsyncThunk('todos/updateTodoText', async ({ id, text }) => {
    const response = await todoApi.update(id, { text });
    return response.data;
});

export const deleteTodoItem = createAsyncThunk('todos/deleteTodoItem', async (id) => {
    await todoApi.delete(id);
    return id;
});

export const clearCompletedTodos = createAsyncThunk('todos/clearCompletedTodos', async (_, { getState }) => {
    const completedTodos = getState().todos.items.filter(t => t.completed);
    const ids = [];
    for (const todo of completedTodos) {
        await todoApi.delete(todo.id);
        ids.push(todo.id);
    }
    return ids;
});

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        filter: 'all',
        searchQuery: '',
    },
    reducers: {
        setFilter(state, action) {
            state.filter = action.payload;
        },
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNewTodo.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(toggleTodoStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateTodoText.fulfilled, (state, action) => {
                const index = state.items.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteTodoItem.fulfilled, (state, action) => {
                state.items = state.items.filter(todo => todo.id !== action.payload);
            })
            .addCase(clearCompletedTodos.fulfilled, (state, action) => {
                const removedIds = action.payload;
                state.items = state.items.filter(todo => !removedIds.includes(todo.id));
            });
    },
});

export const { setFilter, setSearchQuery } = todosSlice.actions;

export const selectAllTodos = (state) => state.todos.items;
export const selectTodosStatus = (state) => state.todos.status;
export const selectTodosError = (state) => state.todos.error;
export const selectTodosFilter = (state) => state.todos.filter;
export const selectSearchQuery = (state) => state.todos.searchQuery;

export const selectFilteredTodos = (state) => {
    const todos = selectAllTodos(state);
    const filter = selectTodosFilter(state);
    const search = selectSearchQuery(state).toLowerCase();

    let filtered = todos;

    // 1. Filter by status
    if (filter === 'completed') {
        filtered = filtered.filter((t) => t.completed);
    } else if (filter === 'active') {
        filtered = filtered.filter((t) => !t.completed);
    }

    // 2. Filter by search
    if (search) {
        filtered = filtered.filter(t => t.text.toLowerCase().includes(search));
    }

    return filtered;
};

export const selectStats = (state) => {
    const todos = selectAllTodos(state);
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
};

export default todosSlice.reducer;
