type SessionData<TContext = Record<string, unknown>> = {
  userId: string;
  createdAt: number;
  updatedAt: number;
  context: TContext; // Stores per-server or global context
  activeTools?: string[];
};

export class SessionManager<TContext = Record<string, unknown>> {
  private sessions: Map<string, SessionData<TContext>> = new Map();
  private sessionTTL: number; // TTL in milliseconds

  constructor(ttl: number = 1000 * 60 * 60) {
    this.sessionTTL = ttl;
  }

  // Create or update a session
  setSession(userId: string, context: TContext = {} as TContext) {
    const now = Date.now();
    this.sessions.set(userId, {
      userId,
      context,
      createdAt: now,
      updatedAt: now,
    });
  }

  getSession(userId: string): SessionData<TContext> | null {
    const session = this.sessions.get(userId);
    if (!session) return null;

    if (Date.now() - session.updatedAt > this.sessionTTL) {
      this.sessions.delete(userId);
      return null;
    }

    return session;
  }

  updateSession(userId: string, newContext: Partial<TContext>) {
    const session = this.getSession(userId);
    if (!session) return;

    session.context = { ...session.context, ...newContext };
    session.updatedAt = Date.now();
    this.sessions.set(userId, session);
  }

  setActiveTools(userId: string, tools: string[]) {
    const session = this.getSession(userId);
    if (!session) return;
    session.activeTools = tools;
    session.updatedAt = Date.now();
    this.sessions.set(userId, session);
  }

  getActiveTools(userId: string): string[] {
    const session = this.getSession(userId);
    return session?.activeTools || [];
  }

  deleteSession(userId: string) {
    this.sessions.delete(userId);
  }

  cleanup() {
    const now = Date.now();
    for (const [userId, session] of this.sessions) {
      if (now - session.updatedAt > this.sessionTTL) {
        this.sessions.delete(userId);
      }
    }
  }
}
