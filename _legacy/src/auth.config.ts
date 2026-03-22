import type { NextAuthConfig } from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import nodemailer from "nodemailer";

// SMTP Accounts for rotation (Supporting up to 50 accounts)
const getSmtpAccounts = () => {
  const accounts = [];
  if (process.env.EMAIL_SERVER_HOST) {
    accounts.push({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT || 587),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      from: process.env.EMAIL_FROM,
    });
  }
  for (let i = 1; i <= 50; i++) {
    const host = process.env[`EMAIL_SERVER_HOST_${i}`];
    if (host) {
      accounts.push({
        host,
        port: Number(process.env[`EMAIL_SERVER_PORT_${i}`] || 587),
        auth: {
          user: process.env[`EMAIL_SERVER_USER_${i}`],
          pass: process.env[`EMAIL_SERVER_PASSWORD_${i}`],
        },
        from: process.env[`EMAIL_FROM_${i}`],
      });
    }
  }
  return accounts;
};

export const authConfig = {
  secret: process.env.AUTH_SECRET!,
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "localhost",
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASSWORD || "",
        },
      },
      from: process.env.EMAIL_FROM || "no-reply@hatka.ru",
      async sendVerificationRequest({ identifier: email, url }) {
        // ALWAYS print the magic link to the server console as a fail-safe
        console.log("\n--- [AUTH] MAGIC LINK (CONSOLE MODE) ---");
        console.log(`To: ${email}`);
        console.log(`Link: ${url}`);
        console.log("----------------------------------------\n");

        const accounts = getSmtpAccounts();
        // Filter out malformed empty strings from .env parsing like '""'
        const validAccounts = accounts.filter(acc => acc.host && acc.host.replace(/["']/g, '').trim().length > 0);
        
        if (validAccounts.length === 0) {
          return;
        }
        const accountIndex = Math.floor(Math.random() * validAccounts.length);
        const account = validAccounts[accountIndex];
        const transport = nodemailer.createTransport(account as any);
        const { host } = new URL(url);
        await transport.sendMail({
          to: email,
          from: account.from,
          subject: `Вход на сайт ${host}`,
          text: `Используйте эту ссылку для входа: ${url}`,
          html: `
            <div style="background: #f9f9f9; padding: 40px; font-family: sans-serif;">
              <div style="background: white; padding: 20px; border-radius: 12px; max-width: 500px; margin: auto; border: 1px solid #eee;">
                <h2 style="color: #111;">Вход в Хатку</h2>
                <p style="color: #666; line-height: 1.5;">Нажмите на кнопку ниже, чтобы войти в свой профиль.</p>
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #f97316; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Войти в профиль</a>
              </div>
            </div>
          `,
        });
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
