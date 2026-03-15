import { prisma } from "@/lib/prisma";

type CreateNotificationInput = {
  userId?: string | null;
  role: "Admin" | "User";
  type: "order" | "repair" | "status" | "user";
  title: string;
  message: string;
  link?: string;
};

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId ?? null,
      role: input.role,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link ?? "",
    },
  });
}

export async function createAdminNotification(
  type: CreateNotificationInput["type"],
  title: string,
  message: string,
  link = "",
) {
  return createNotification({ role: "Admin", type, title, message, link });
}

export async function createUserNotification(
  userId: string,
  type: CreateNotificationInput["type"],
  title: string,
  message: string,
  link = "",
) {
  return createNotification({ userId, role: "User", type, title, message, link });
}
