import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, CatFact, RandomUser, UpdateUserData } from '../types';
import { api } from '../api';

interface PostsState {
  posts: Post[];
  loading: boolean;
  createResult: string | null;
  updateResult: string | null;
  deleteResult: string | null;
}

const initialPostsState: PostsState = {
  posts: [],
  loading: false,
  createResult: null,
  updateResult: null,
  deleteResult: null,
};

export const fetchPosts = createAsyncThunk('posts/fetch', async () => {
  return await api.getPosts();
});

export const createPost = createAsyncThunk('posts/create', async ({ title, body }: { title: string; body: string }) => {
  return await api.createPost(title, body);
});

export const updatePost = createAsyncThunk('posts/update', async ({ id, title, body }: { id: number; title: string; body: string }) => {
  return await api.updatePost(id, title, body);
});

export const deletePost = createAsyncThunk('posts/delete', async (id: number) => {
  await api.deletePost(id);
  return id;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: initialPostsState,
  reducers: {
    clearPostsResults: (state) => {
      state.createResult = null;
      state.updateResult = null;
      state.deleteResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => { state.loading = false; })
      .addCase(createPost.pending, (state) => { state.loading = true; })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.createResult = `✅ Создано! Номер: ${action.payload.id}`;
      })
      .addCase(createPost.rejected, (state) => {
        state.loading = false;
        state.createResult = `❌ Ошибка создания`;
      })
      .addCase(updatePost.pending, (state) => { state.loading = true; })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.updateResult = `✅ Запись ${action.payload.id} изменена`;
      })
      .addCase(updatePost.rejected, (state) => {
        state.loading = false;
        state.updateResult = `❌ Ошибка изменения`;
      })
      .addCase(deletePost.pending, (state) => { state.loading = true; })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = `✅ Запись ${action.payload} удалена`;
        state.posts = state.posts.filter(p => p.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state) => {
        state.loading = false;
        state.deleteResult = `❌ Ошибка удаления`;
      });
  },
});

interface FactsState {
  oneFact: CatFact | null;
  threeFacts: CatFact[];
  loading: boolean;
}

const initialFactsState: FactsState = {
  oneFact: null,
  threeFacts: [],
  loading: false,
};

export const fetchOneFact = createAsyncThunk('facts/one', async () => {
  return await api.getOneFact();
});

export const fetchThreeFacts = createAsyncThunk('facts/three', async () => {
  return await api.getThreeFacts();
});

const factsSlice = createSlice({
  name: 'facts',
  initialState: initialFactsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOneFact.pending, (state) => { state.loading = true; })
      .addCase(fetchOneFact.fulfilled, (state, action) => {
        state.loading = false;
        state.oneFact = action.payload;
      })
      .addCase(fetchOneFact.rejected, (state) => { state.loading = false; })
      .addCase(fetchThreeFacts.pending, (state) => { state.loading = true; })
      .addCase(fetchThreeFacts.fulfilled, (state, action) => {
        state.loading = false;
        state.threeFacts = action.payload;
      })
      .addCase(fetchThreeFacts.rejected, (state) => { state.loading = false; });
  },
});

interface UsersState {
  oneUser: RandomUser | null;
  fiveUsers: RandomUser[];
  loading: boolean;
  updateResult: string | null;
  deleteResult: string | null;
}

const initialUsersState: UsersState = {
  oneUser: null,
  fiveUsers: [],
  loading: false,
  updateResult: null,
  deleteResult: null,
};

export const fetchOneUser = createAsyncThunk('users/one', async () => {
  return await api.getOneUser();
});

export const fetchFiveUsers = createAsyncThunk('users/five', async () => {
  return await api.getFiveUsers();
});

export const updateUser = createAsyncThunk('users/update', async ({ id, data }: { id: number; data: UpdateUserData }) => {
  return await api.updateUser(id, data);
});

export const deleteUser = createAsyncThunk('users/delete', async (id: number) => {
  await api.deleteUser(id);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: initialUsersState,
  reducers: {
    clearUsersResults: (state) => {
      state.updateResult = null;
      state.deleteResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOneUser.pending, (state) => { state.loading = true; })
      .addCase(fetchOneUser.fulfilled, (state, action) => {
        state.loading = false;
        state.oneUser = action.payload;
      })
      .addCase(fetchOneUser.rejected, (state) => { state.loading = false; })
      .addCase(fetchFiveUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchFiveUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.fiveUsers = action.payload;
      })
      .addCase(fetchFiveUsers.rejected, (state) => { state.loading = false; })
      .addCase(updateUser.pending, (state) => { state.loading = true; })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.updateResult = `✅ Пользователь обновлён`;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
        state.updateResult = `❌ Ошибка обновления`;
      })
      .addCase(deleteUser.pending, (state) => { state.loading = true; })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteResult = `✅ Пользователь ${action.payload} удалён`;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.loading = false;
        state.deleteResult = `❌ Ошибка удаления`;
      });
  },
});

export const { clearPostsResults } = postsSlice.actions;
export const { clearUsersResults } = usersSlice.actions;

export const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
    facts: factsSlice.reducer,
    users: usersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;