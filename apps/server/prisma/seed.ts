import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@example.com'
  const userEmail = 'user@example.com'

  // Users
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: 'DEV_PASSWORD_admin123',
      firstName: 'Admin',
      lastName: 'User',
      ratingLevel: 3,
      isAdmin: true,
    },
  })

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      passwordHash: 'DEV_PASSWORD_user123',
      firstName: 'Test',
      lastName: 'User',
      ratingLevel: 3,
      isAdmin: false,
    },
  })

  // Wallets
  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, balance: 0 },
  })
  await prisma.wallet.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, balance: 0 },
  })

  // Products (sample from demo)
  const demoProducts = [
    { code: 'SAVINGS', title: 'Накопительный счёт', subtitle: 'Копите с процентами', icon: 'savings', iconColor: '#0ea5e9', iconBg: '#e0f2fe', category: 'saving', allowedRatings: [1,2,3,4,5] },
    { code: 'MORTGAGE', title: 'Ипотека', subtitle: 'Доступна при рейтинге 4+', icon: 'mortgage', iconColor: '#f59e0b', iconBg: '#fffbeb', category: 'credit', allowedRatings: [4,5] },
  ]

  for (const p of demoProducts) {
    await prisma.product.upsert({
      where: { code: p.code },
      update: {},
      create: { ...p, isActive: true },
    })
  }

  // Transactions (examples)
  const existingTx = await prisma.transaction.findFirst({ where: { userId: user.id } })
  if (!existingTx) {
    await prisma.transaction.createMany({
      data: [
        { userId: user.id, direction: 'credit', amountMinor: 150000, category: 'topup', counterpartyName: 'Admin top-up' },
        { userId: user.id, direction: 'debit', amountMinor: 25000, category: 'food', counterpartyName: 'Cafe' },
      ],
      skipDuplicates: true,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

