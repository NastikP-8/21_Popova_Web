export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface CatFact {
  fact: string;
  length: number;
}

export interface RandomUser {
  name: { first: string; last: string; };
  email: string;
  location: { city: string; };
  phone?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}