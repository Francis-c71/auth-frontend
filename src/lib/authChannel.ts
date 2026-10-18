// This code keeps authentication status synchronized across borwser tabs. 
// It uses BroadcastChannel if available, otherwise it does nothing. 
// The main idea is that signing out in one tab signs out all of them, 
// and signing in in one tab signs in all of them.

export type AuthMessage = 'signed-in' | 'signed-out';

// Check whether the browser supports BroadcastChannel. 
// If not, we will just do nothing, which is fine because the user can still sign in and out in each tab independently.
// If BroadcastChannel is supported, we create a channel named 'auth' that all tabs can use to communicate authentication events.
// Tabs on the same origin that creates a channel with the same name can communicate with each other. 
// The channel is automatically closed when the tab is closed, so we don't need to worry about cleaning it up.
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('auth') : null;


export function broadcastAuth(message: AuthMessage) {
  channel?.postMessage(message);
}

export function subscribeAuth(
  callback: (message: AuthMessage) => void,
) {
  // If the channel is unavailable, we return a no-op function, a harmless cleanup function.
  if (!channel) return () => undefined;

  // When a message arrives, we call the callback with the message data,
  // to pass the message to the listener, your application. 
  // The message data is of type AuthMessage.
  const listener = (event: MessageEvent<AuthMessage>) =>
    callback(event.data);

  // Add the event listener to the channel, so that when a message arrives, the listener is called.
  channel.addEventListener('message', listener);

  // Return a cleanup function that removes the event listener when the component unmounts 
  // or when the effect is cleaned up.
  return () => channel.removeEventListener('message', listener);
}