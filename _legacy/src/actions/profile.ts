"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name?: string;
  lastName?: string;
  phone?: string;
  city?: string;
}) {
  try {
    // === Базовая защита (Валидация данных на сервере) ===
    if (data.name && data.name.length > 50) return { error: "Имя слишком длинное (макс 50 символов)" };
    if (data.lastName && data.lastName.length > 50) return { error: "Фамилия слишком длинная (макс 50 символов)" };
    if (data.city && data.city.length > 50) return { error: "Название города слишком длинное" };
    if (data.phone && data.phone.length > 25) return { error: "Телефон слишком длинный" };
    // ====================================================

    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Неавторизованный запрос" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name || null,
        lastName: data.lastName || null,
        phone: data.phone || null,
        city: data.city || null,
      },
    });

    // Очищаем кэш страницы профиля, чтобы сразу показать новые данные
    revalidatePath("/profile");
    
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Не удалось сохранить изменения" };
  }
}
