/** Keeps tabs in sync: signing out in one tab signs out all of them. */
export type AuthMessage = 'signed-in' | 'signed-out';

const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('auth') : null;

export function broadcastAuth(message: AuthMessage) {
  channel?.postMessage(message);
}

export function subscribeAuth(callback: (message: AuthMessage) => void) {
  if (!channel) return () => undefined;
  const listener = (event: MessageEvent<AuthMessage>) => callback(event.data);
  channel.addEventListener('message', listener);
  return () => channel.removeEventListener('message', listener);
}
