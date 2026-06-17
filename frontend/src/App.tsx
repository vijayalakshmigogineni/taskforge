import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  ClipboardList,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './components/ui/button';
import { Checkbox } from './components/ui/checkbox';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import * as api from './lib/api';
import type { Priority, Todo, User } from './lib/api';
import { cn } from './lib/utils';

const APP_NAME = 'TaskForge';
const TOKEN_KEY = 'taskforge_token';
const USER_KEY = 'taskforge_user';

const priorityStyles: Record<Priority, string> = {
  LOW: 'border-teal-200 bg-teal-50 text-teal-800',
  MEDIUM: 'border-amber-200 bg-amber-50 text-amber-800',
  HIGH: 'border-rose-200 bg-rose-50 text-rose-800',
};

type CompletionFilter = 'all' | 'true' | 'false';
type PriorityFilter = 'all' | Priority;

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem('todo_token'));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY) ?? localStorage.getItem('todo_user');
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [search, setSearch] = useState('');
  const [completion, setCompletion] = useState<CompletionFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [page, setPage] = useState(1);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [savingTodo, setSavingTodo] = useState(false);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.isCompleted).length;
    const high = todos.filter((todo) => todo.priority === 'HIGH' && !todo.isCompleted).length;
    return {
      completed,
      open: todos.length - completed,
      high,
      progress: todos.length ? Math.round((completed / todos.length) * 100) : 0,
    };
  }, [todos]);

  const loadTodos = useCallback(async () => {
    if (!token) return;

    const params = new URLSearchParams({
      page: String(page),
      limit: '10',
    });

    if (search.trim()) params.set('search', search.trim());
    if (completion !== 'all') params.set('isCompleted', completion);
    if (priorityFilter !== 'all') params.set('priority', priorityFilter);

    setLoadingTodos(true);
    try {
      setTodos(await api.listTodos(token, params));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load tasks');
    } finally {
      setLoadingTodos(false);
    }
  }, [completion, page, priorityFilter, search, token]);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === 'register') {
        await api.register(name, email, password);
        toast.success('Workspace created. Sign in to continue.');
        setAuthMode('login');
        setName('');
        return;
      }

      const response = await api.login(email, password);
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      localStorage.removeItem('todo_token');
      localStorage.removeItem('todo_user');
      setToken(response.token);
      setUser(response.user);
      toast.success('Welcome back');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleCreateTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !title.trim()) return;

    setSavingTodo(true);
    try {
      await api.createTodo(token, {
        title: title.trim(),
        description: description.trim(),
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      toast.success('Task added');
      await loadTodos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setSavingTodo(false);
    }
  }

  async function toggleTodo(todo: Todo) {
    if (!token) return;

    setTodos((items) =>
      items.map((item) => (item.id === todo.id ? { ...item, isCompleted: !item.isCompleted } : item)),
    );

    try {
      await api.updateTodo(token, todo.id, { isCompleted: !todo.isCompleted });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update task');
      await loadTodos();
    }
  }

  async function changePriority(todo: Todo, nextPriority: Priority) {
    if (!token) return;

    setTodos((items) =>
      items.map((item) => (item.id === todo.id ? { ...item, priority: nextPriority } : item)),
    );

    try {
      await api.updateTodo(token, todo.id, { priority: nextPriority });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update priority');
      await loadTodos();
    }
  }

  async function removeTodo(todo: Todo) {
    if (!token) return;

    try {
      await api.deleteTodo(token, todo.id);
      setTodos((items) => items.filter((item) => item.id !== todo.id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('todo_token');
    localStorage.removeItem('todo_user');
    setToken(null);
    setUser(null);
    setTodos([]);
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f7f2_0,#f8fafc_38%,#eef2ff_100%)] px-4 py-8">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_430px]">
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-3">
              <BrandMark />
              <span className="text-lg font-semibold text-foreground">{APP_NAME}</span>
            </div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1 text-sm font-medium text-teal-800 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Secure task operations for focused teams
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Turn scattered todos into a priority-driven work queue.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              Plan, filter, prioritize, and complete work from a clean dashboard backed by your Neon Postgres database.
            </p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              <ValuePill icon={Target} label="Priority first" />
              <ValuePill icon={Search} label="Fast search" />
              <ValuePill icon={BarChart3} label="Live progress" />
            </div>
          </div>

          <form onSubmit={handleAuth} className="panel border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase text-primary">{authMode === 'login' ? 'Welcome back' : 'Start free'}</p>
              <h2 className="mt-2 text-2xl font-semibold">{authMode === 'login' ? 'Sign in to TaskForge' : 'Create your workspace'}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use your account to access your private tasks and priorities.
              </p>
            </div>
            <div className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Vishnu"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <Button className="h-11 w-full" disabled={authLoading}>
                {authLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {authMode === 'login' ? 'Sign in' : 'Create account'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              >
                {authMode === 'login' ? 'Create a new account' : 'Use an existing account'}
              </Button>
            </div>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <h1 className="text-2xl font-semibold">{APP_NAME}</h1>
              <p className="text-sm text-muted-foreground">
                {user?.name ? `Welcome, ${user.name}` : user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadTodos}>
              <RefreshCw className={cn('h-4 w-4', loadingTodos && 'animate-spin')} />
              Sync
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b bg-[linear-gradient(135deg,#f8fafc_0%,#eefaf7_52%,#fff7ed_100%)]">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm font-medium text-primary shadow-sm">
              <Sparkles className="h-4 w-4" />
              Operational task dashboard
            </div>
            <h2 className="text-3xl font-semibold text-foreground">Today&apos;s execution queue</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {user?.name ? `${user.name}, keep the list tight` : 'Keep the list tight'}, push high priority work forward, and close the loop as soon as tasks are done.
            </p>
          </div>
          <div className="panel bg-white/85 p-5">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium">Completion</span>
              <span className="font-semibold text-primary">{stats.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stats.progress}%` }} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {stats.completed} of {todos.length} visible tasks completed
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-6">
          <form onSubmit={handleCreateTodo} className="panel p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Capture task</h2>
                <p className="mt-1 text-sm text-muted-foreground">Add the next useful unit of work.</p>
              </div>
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Prepare release checklist"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Notes</Label>
                <Textarea
                  id="description"
                  placeholder="Context, owner, next step..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="h-11 w-full" disabled={savingTodo}>
                {savingTodo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add task
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-3 gap-3">
            <Metric icon={Clock3} label="Open" value={stats.open} />
            <Metric icon={CheckCircle2} label="Done" value={stats.completed} />
            <Metric icon={Target} label="High" value={stats.high} />
          </div>
        </aside>

        <section className="space-y-4">
          <div className="panel p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_160px_160px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search tasks"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Select value={completion} onValueChange={(value) => setCompletion(value as CompletionFilter)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="false">Open</SelectItem>
                  <SelectItem value="true">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priority</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Task queue</h2>
                <p className="text-sm text-muted-foreground">Sorted by newest first</p>
              </div>
              <span className="text-sm text-muted-foreground">Page {page}</span>
            </div>
            {loadingTodos ? (
              <div className="flex min-h-[340px] items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading tasks
              </div>
            ) : todos.length === 0 ? (
              <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">
                <ClipboardList className="mb-3 h-11 w-11 text-primary" />
                <h3 className="text-lg font-semibold">No matching tasks</h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Create a task or relax the filters to bring more work into view.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {todos.map((todo) => (
                  <article
                    key={todo.id}
                    className="grid gap-4 px-5 py-4 transition-colors hover:bg-muted/40 md:grid-cols-[1fr_150px_44px]"
                  >
                    <div className="flex gap-3">
                      <Checkbox checked={todo.isCompleted} onCheckedChange={() => toggleTodo(todo)} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={cn('font-medium', todo.isCompleted && 'text-muted-foreground line-through')}>
                            {todo.title}
                          </h3>
                          <span className={cn('rounded-sm border px-2 py-0.5 text-xs font-semibold', priorityStyles[todo.priority])}>
                            {todo.priority}
                          </span>
                        </div>
                        {todo.description && (
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{todo.description}</p>
                        )}
                        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Select value={todo.priority} onValueChange={(value) => changePriority(todo, value as Priority)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeTodo(todo)} aria-label={`Delete ${todo.title}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </article>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between border-t px-5 py-4">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={todos.length < 10}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function BrandMark() {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
      <ClipboardList className="h-5 w-5" />
    </span>
  );
}

function ValuePill({ icon: Icon, label }: { icon: typeof Target; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-white/85 px-3 py-3 text-sm font-medium shadow-sm">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: number }) {
  return (
    <div className="panel p-4">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
        {value === 0 ? <Circle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

export default App;
