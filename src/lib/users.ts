export interface StoredUser {
  id: string;
  name: string;
  email: string;
  neighborhood: string;
  password: string;
}

const users: StoredUser[] = [];
let nextId = 1;

export function createUser(data: {
  name: string;
  email: string;
  neighborhood: string;
  password: string;
}): StoredUser | null {
  const exists = users.find((u) => u.email === data.email);
  if (exists) return null;

  const user: StoredUser = { id: String(nextId++), ...data };
  users.push(user);
  return user;
}

export function findUserByCredentials(email: string, password: string): StoredUser | undefined {
  return users.find((u) => u.email === email && u.password === password);
}