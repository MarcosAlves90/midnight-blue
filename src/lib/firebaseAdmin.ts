import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// Variáveis esperadas: FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_PROJECT_ID

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID || !privateKey) {
    // Não inicializa em ambiente sem chave — útil para dev sem Admin
    // Isso evita erros em ambientes onde Admin não foi configurado
    console.warn('Firebase Admin não inicializado: faltam variáveis de ambiente');
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
}

export const adminAuth = admin.auth();
export const adminApp: App | undefined = admin.apps.length ? admin.app() : undefined;

export async function verifyIdToken(idToken: string) {
  if (!adminAuth) throw new Error('Firebase Admin não inicializado');
  return adminAuth.verifyIdToken(idToken);
}
