declare module Authentication {
  interface User {
    email?: string;
    email_verified?: boolean;
    name?: string;
    nickname?: string;
    picture?: string;
    sub?: string;
    updated_at?: string;
  }
}

declare module '*.svg' {
  const content: any;
  export default content;
}
