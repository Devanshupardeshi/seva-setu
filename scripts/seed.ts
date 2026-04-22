import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { currentVolunteer, ngos, needs, matches, activeIncident } from '../lib/mock-data';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=');
        if (index !== -1) {
          const key = trimmed.substring(0, index).trim();
          let val = trimmed.substring(index + 1).trim();
          
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          
          // Unescape newlines
          const finalVal = val.replace(/\\n/g, '\n');
          process.env[key] = finalVal;
        }
      }
    });
  }
}

async function seed() {
  loadEnv();
  console.log('Starting seed process...');

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing Firebase Admin credentials in .env.local');
    process.exit(1);
  }

  // Debugging private key format (silently)
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.error('Private key does not contain BEGIN header');
  }

  if (getApps().length === 0) {
    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (e) {
      console.error('Failed to initialize Admin SDK:', e);
      process.exit(1);
    }
  }

  const db = getFirestore();

  console.log('Seeding Volunteers...');
  await db.collection('volunteers').doc(currentVolunteer.id).set({
    ...currentVolunteer,
    createdAt: new Date().toISOString()
  }, { merge: true });

  for (const ngo of ngos) {
    await db.collection('ngos').doc(ngo.id).set({
      ...ngo,
      createdAt: new Date().toISOString()
    }, { merge: true });
  }

  for (const need of needs) {
    await db.collection('needs').doc(need.id).set({
      ...need,
      createdAt: new Date().toISOString()
    }, { merge: true });
  }

  for (const match of matches) {
    await db.collection('matches').doc(match.id).set({
      ...match,
      createdAt: new Date().toISOString()
    }, { merge: true });
  }

  await db.collection('incidents').doc(activeIncident.id).set({
    ...activeIncident,
    createdAt: new Date().toISOString()
  }, { merge: true });

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
