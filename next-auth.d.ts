// next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * NextAuth의 Session 타입을 확장합니다.
   * 이렇게 하면 session.user 객체에 id 속성을 추가할 수 있습니다.
   */
  interface Session {
    user: {
      id: string; // 여기에 'id' 속성을 추가합니다.
    } & DefaultSession["user"]; // 기존 DefaultSession의 user 속성들도 포함합니다.
  }

  /**
   * NextAuth의 JWT 타입을 확장합니다.
   * 토큰에 'sub' 속성이 'string' 타입임을 명시합니다.
   */
  interface JWT {
    sub: string;
  }
}
