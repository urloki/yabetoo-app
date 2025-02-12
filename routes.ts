/**
 * An array of routes that are public and can be accessed without authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/api/uploadthing",
  "/api/sentry-example-page",
  "/api/trigger",
];

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

/**
 * The prefix for the API authentication routes
 * Routes that start with this prefix are used for authentication
 * @type {string}
 */
export const apiAuthRoutes: string = "/api/auth";

/**
 * The default route to redirect to after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/balance";

export const adminRoute = "/admin";
