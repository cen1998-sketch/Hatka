import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth({
  ...authConfig,
  providers: [], // Отключаем провайдеры в Edge Runtime (ошибки MissingAdapter)
}).auth;


export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
