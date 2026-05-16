import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SEED_ORGANIZER_EMAIL = 'organizer@eventify.local';

async function main() {
  console.log('🌱 Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 10);
  const organizer = await prisma.user.upsert({
    where: { email: SEED_ORGANIZER_EMAIL },
    update: {},
    create: {
      firstName: 'Seed',
      lastName: 'Organizer',
      email: SEED_ORGANIZER_EMAIL,
      passwordHash,
    },
  });

  // Krijo një Venue nëse nuk ekziston
  let venue = await prisma.venue.findFirst();
  if (!venue) {
    venue = await prisma.venue.create({
      data: {
        name: "UBT Campus",
        address: "Prishtinë, Kosovo",
        capacity: 500
      }
    });
  }

  // Krijo disa Evente
  await prisma.event.createMany({
    data: [
      {
        title: "Tech Conference 2026",
        description: "Konferenca më e madhe teknologjike në Kosovë",
        startDate: new Date("2026-06-15T09:00:00"),
        endDate: new Date("2026-06-15T18:00:00"),
        price: 49.99,
        capacity: 300,
        venueId: venue.id,
        organizerId: organizer.id
      },
      {
        title: "Summer Music Festival",
        description: "Festivale me artistë të njohur",
        startDate: new Date("2026-07-20T20:00:00"),
        endDate: new Date("2026-07-21T02:00:00"),
        price: 35,
        capacity: 800,
        venueId: venue.id,
        organizerId: organizer.id
      },
      {
        title: "Startup Kosovo Summit",
        description: "Mbledhje e startup-eve dhe investitorëve",
        startDate: new Date("2026-05-25T10:00:00"),
        endDate: new Date("2026-05-25T17:00:00"),
        price: 0,
        capacity: 400,
        venueId: venue.id,
        organizerId: organizer.id
      }
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());