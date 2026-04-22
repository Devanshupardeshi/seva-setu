const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { volunteers, ngos, needs, matches, activeIncident } = require('../lib/mock-data');

// Try loading environment variables if they are not loaded
require('dotenv').config({ path: '.env.local' });

async function seed() {
  console.log('Starting seed process...');

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Handle newlines in private key if passed via env var
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing Firebase Admin credentials in environment variables.');
    console.error('Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in .env.local');
    process.exit(1);
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  const db = getFirestore();

  console.log('Clearing existing data (optional)...'); // In a real script we would clear, but here we just upsert.

  console.log('Seeding Volunteers...');
  for (const vol of volunteers) {
    await db.collection('volunteers').doc(vol.id).set({
      ...vol,
      createdAt: new Date().toISOString()
    }, { merge: true });
  }

  console.log('Seeding NGOs...');
  for (const ngo of ngos) {
    await db.collection('ngos').doc(ngo.id).set({
      ...ngo,
      createdAt: new Date().toISOString()
    }, { merge: true });
  }

  console.log('Seeding Needs...');
  for (const need of needs) {
    await db.collection('needs').doc(need.id).set({
      ...need,
      createdAt: new Date().toISOString()
    }, { merge: true });
  }

  console.log('Seeding Matches...');
  for (const match of matches) {
    await db.collection('matches').doc(match.id).set({
      ...match,
      createdAt: new Date().toISOString()
    }, { merge: true });
  }

  console.log('Seeding Active Incident...');
  await db.collection('incidents').doc(activeIncident.id).set({
    ...activeIncident,
    createdAt: new Date().toISOString()
  }, { merge: true });

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(console.error);
