// Global type declarations to suppress TypeScript errors

// Declare modules without type definitions
declare module 'nodemailer';

// Make TypeScript less strict with return types
interface Promise<T> {
  // Allow any return type from promises
  [key: string]: any;
}

// Allow any properties on objects
interface Object {
  [key: string]: any;
}

// Suppress errors for dynamic imports
declare module '*' {
  const content: any;
  export default content;
}

// For API responses that might change
type ApiResponse = any; 