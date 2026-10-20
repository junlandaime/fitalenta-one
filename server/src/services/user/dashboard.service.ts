import prisma from "../../config/prisma";

export async function getDashboardSummary(userId: number) {
  const [user, latestRegistration, unreadNotifications] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    }),
    prisma.registration.findFirst({
      where: { userId },
      orderBy: { registrationDate: "desc" },
      include: {
        program: {
          select: { id: true, name: true, programFormat: true, location: true },
        },
        selectionStatuses: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true, notes: true, evaluatedAt: true },
        },
        placementStatuses: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true, companyName: true, placementDate: true },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            amount: true,
            amountPaid: true,
            dueDate: true,
            notes: true,
          },
        },
      },
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  const selectionStatus = latestRegistration?.selectionStatuses?.[0] ?? null;
  const placementStatus = latestRegistration?.placementStatuses?.[0] ?? null;
  const latestPayment = latestRegistration?.payments?.[0] ?? null;

  return {
    program: latestRegistration?.program ?? null,
    registrationStatus: latestRegistration?.registrationStatus ?? null,
    registrationCode: latestRegistration?.registrationCode ?? null,
    selectionStatus: selectionStatus
      ? {
          status: selectionStatus.status,
          notes: selectionStatus.notes,
          evaluatedAt: selectionStatus.evaluatedAt,
        }
      : null,
    placementStatus: placementStatus
      ? {
          status: placementStatus.status,
          companyName: placementStatus.companyName,
          placementDate: placementStatus.placementDate,
        }
      : null,
    payment: latestPayment
      ? {
          id: latestPayment.id,
          invoiceNumber: latestPayment.invoiceNumber,
          status: latestPayment.status,
          amount: latestPayment.amount,
          amountPaid: latestPayment.amountPaid,
          dueDate: latestPayment.dueDate,
          notes: latestPayment.notes,
        }
      : null,
    unreadNotifications,
    hasRegistration: latestRegistration !== null,
  };
}
