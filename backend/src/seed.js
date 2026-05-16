import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@eventify.local' },
    update: {},
    create: {
      id: 'user-organizer-1',
      firstName: 'Demo',
      lastName: 'Organizer',
      email: 'organizer@eventify.local',
      passwordHash: await bcrypt.hash('password123', 10),
    },
  });

  // Krijo Venue
  const venue = await prisma.venue.upsert({
    where: { id: 'venue-1' },
    update: {},
    create: {
      id: 'venue-1',
      name: "UBT Amphitheatre",
      address: "Prishtinë, Kosovo",
      capacity: 450
    }
  });

  // Krijo Evente
  await prisma.event.createMany({
    data: [
      {
        id: "event-1",
        title: "Tech Conference 2026",
        description: "Konferenca vjetore e teknologjisë dhe inovacionit",
        startDate: new Date("2026-06-15T09:00:00"),
        endDate: new Date("2026-06-15T17:00:00"),
        price: 49.99,
        capacity: 300,
        venueId: venue.id,
        organizerId: organizer.id
      },
      {
        id: "event-2",
        title: "Dua Lipa Live in Prishtina",
        description: "Koncert special me Dua Lipa",
        startDate: new Date("2026-07-10T21:00:00"),
        endDate: new Date("2026-07-10T23:30:00"),
        price: 85,
        capacity: 1200,
        venueId: venue.id,
        organizerId: organizer.id
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Seed completed! 2 events created.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());