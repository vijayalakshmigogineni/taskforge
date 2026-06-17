export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type User = {
  id: string;
  name: string | null;
  email: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

type RequestOptions = RequestInit & {
  token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? 'Something went wrong');
  }

  return payload as T;
}

export function login(email: string, password: string) {
  return request<{ message: string; token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string) {
  return request<{ message: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function listTodos(token: string, params: URLSearchParams) {
  return request<Todo[]>(`/todos?${params.toString()}`, { token });
}

export function createTodo(
  token: string,
  data: { title: string; description?: string; priority: Priority },
) {
  return request<{ message: string; todo: Todo }>('/todos', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function updateTodo(
  token: string,
  id: string,
  data: Partial<Pick<Todo, 'title' | 'description' | 'isCompleted' | 'priority'>>,
) {
  return request<{ message: string; updatedTodo: Todo }>(`/todos/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
}

export function deleteTodo(token: string, id: string) {
  return request<{ message: string }>(`/todos/${id}`, {
    method: 'DELETE',
    token,
  });
}
