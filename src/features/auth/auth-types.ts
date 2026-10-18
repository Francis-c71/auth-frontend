
/** 
 * An interface is a blueprint for an object, defining what properties and methods it shoul HashChangeEvent,
 * it enforces type-checking, ensuring that objects adhere to a specific structure. 
 * An interface can be used to define a custom type for objects, functions, or classes.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
