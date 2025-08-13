import { PrismaClient, Prisma, ProductCategory, TransactionDirection, TransactionCategory } from '@prisma/client'
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
    { code: 'OVERDRAFT', title: 'Подключить овердрафт', subtitle: 'Для непредвиденных трат', icon: 'overdraft', iconColor: '#166534', iconBg: '#dcfce7', category: ProductCategory.credit, allowedRatings: [3,4,5] },
    { code: 'CONSUMER_CREDIT', title: 'Потребительский кредит', subtitle: 'До 5 млн рублей на любые цели', icon: 'card', iconColor: '#166534', iconBg: '#dcfce7', category: ProductCategory.credit, allowedRatings: [3,4,5] },
    { code: 'MORTGAGE', title: 'Ипотека', subtitle: 'Чтобы открыть ипотеку необходимо повысить рейтинг', icon: 'lock', iconColor: '#6b7280', iconBg: '#e5e7eb', category: ProductCategory.credit, allowedRatings: [4,5] },
    { code: 'DEPOSIT', title: 'Открыть вклад', subtitle: 'От 18% годовых', icon: 'plus', iconColor: '#166534', iconBg: '#dcfce7', category: ProductCategory.saving, allowedRatings: [1,2,3,4,5] },
    { code: 'SAVINGS', title: 'Накопительный счёт', subtitle: 'До 14% годовых с возможностью снятия', icon: 'percent', iconColor: '#166534', iconBg: '#dcfce7', category: ProductCategory.saving, allowedRatings: [1,2,3,4,5] },
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
        { userId: user.id, direction: TransactionDirection.credit, amountMinor: 150000, category: TransactionCategory.topup, counterpartyName: 'Admin top-up' },
        { userId: user.id, direction: TransactionDirection.debit, amountMinor: 25000, category: TransactionCategory.food, counterpartyName: 'Cafe' },
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

