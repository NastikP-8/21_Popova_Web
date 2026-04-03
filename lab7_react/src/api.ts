import axios from 'axios';
import { Post, CatFact, RandomUser, UpdateUserData } from './types';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const CAT_FACT_API = 'https://catfact.ninja';
const RANDOM_USER_API = 'https://randomuser.me/api';

export const api = {
  getPosts: (): Promise<Post[]> => 
    axios.get(`${API_BASE_URL}/posts?_limit=5`).then(res => res.data),
  
  createPost: (title: string, body: string): Promise<Post> =>
    axios.post(`${API_BASE_URL}/posts`, { title, body, userId: 1 }).then(res => res.data),
  
  updatePost: (id: number, title: string, body: string): Promise<Post> =>
    axios.put(`${API_BASE_URL}/posts/${id}`, { title, body, userId: 1 }).then(res => res.data),
  
  deletePost: (id: number): Promise<void> =>
    axios.delete(`${API_BASE_URL}/posts/${id}`).then(res => res.data),
  
  getOneFact: (): Promise<CatFact> =>
    axios.get(`${CAT_FACT_API}/fact`).then(res => res.data),
  
  getThreeFacts: (): Promise<CatFact[]> =>
    Promise.all([
      axios.get(`${CAT_FACT_API}/fact`),
      axios.get(`${CAT_FACT_API}/fact`),
      axios.get(`${CAT_FACT_API}/fact`)
    ]).then(responses => responses.map(r => r.data)),
  
  getOneUser: (): Promise<RandomUser> =>
    axios.get(`${RANDOM_USER_API}/`).then(res => res.data.results[0]),
  
  getFiveUsers: (): Promise<RandomUser[]> =>
    axios.get(`${RANDOM_USER_API}/?results=5`).then(res => res.data.results),
  
  updateUser: (id: number, data: UpdateUserData): Promise<any> =>
    axios.patch(`${API_BASE_URL}/users/${id}`, data).then(res => res.data),
  
  deleteUser: (id: number): Promise<void> =>
    axios.delete(`${API_BASE_URL}/users/${id}`).then(res => res.data)
};