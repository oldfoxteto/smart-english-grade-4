import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import admin from 'firebase-admin';

const sourceKeyPath = process.env.SOURCE_FIREBASE_SERVICE_ACCOUNT;
const targetKeyPath = process.env.TARGET_FIREBASE_SERVICE_ACCOUNT;
const sourceProjectId = process.env.SOURCE_FIREBASE_PROJECT_ID;
const targetProjectId = process.env.TARGET_FIREBASE_PROJECT_ID;

if (!sourceKeyPath || !targetKeyPath || !sourceProjectId || !targetProjectId) {
  console.error(
    'Missing required env vars: SOURCE_FIREBASE_SERVICE_ACCOUNT, TARGET_FIREBASE_SERVICE_ACCOUNT, SOURCE_FIREBASE_PROJECT_ID, TARGET_FIREBASE_PROJECT_ID',
  );
  process.exit(1);
}

const readJson = (filePath) => JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'));

const sourceApp = admin.initializeApp(
  {
    credential: admin.credential.cert(readJson(sourceKeyPath)),
    projectId: sourceProjectId,
  },
  'source',
);

const targetApp = admin.initializeApp(
  {
    credential: admin.credential.cert(readJson(targetKeyPath)),
    projectId: targetProjectId,
  },
  'target',
);

const sourceDb = sourceApp.firestore();
const targetDb = targetApp.firestore();

let copiedCollections = 0;
let copiedDocuments = 0;

async function copyCollection(sourceCollectionRef, targetCollectionRef) {
  copiedCollections += 1;
  const snapshot = await sourceCollectionRef.get();

  if (snapshot.empty) {
    console.log(`Skipping empty collection ${sourceCollectionRef.path}`);
    return;
  }

  let batch = targetDb.batch();
  let writesInBatch = 0;

  for (const docSnap of snapshot.docs) {
    batch.set(targetCollectionRef.doc(docSnap.id), docSnap.data(), { merge: false });
    writesInBatch += 1;
    copiedDocuments += 1;

    if (writesInBatch === 400) {
      await batch.commit();
      batch = targetDb.batch();
      writesInBatch = 0;
    }
  }

  if (writesInBatch > 0) {
    await batch.commit();
  }

  console.log(`Copied ${snapshot.size} docs from ${sourceCollectionRef.path}`);

  for (const docSnap of snapshot.docs) {
    const sourceSubcollections = await docSnap.ref.listCollections();
    for (const sourceSubcollection of sourceSubcollections) {
      const targetSubcollection = targetCollectionRef.doc(docSnap.id).collection(sourceSubcollection.id);
      await copyCollection(sourceSubcollection, targetSubcollection);
    }
  }
}

async function main() {
  const sourceCollections = await sourceDb.listCollections();
  for (const sourceCollection of sourceCollections) {
    const targetCollection = targetDb.collection(sourceCollection.id);
    await copyCollection(sourceCollection, targetCollection);
  }

  console.log(
    JSON.stringify(
      {
        sourceProjectId,
        targetProjectId,
        copiedCollections,
        copiedDocuments,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error('Firestore migration failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await Promise.all([sourceApp.delete(), targetApp.delete()]);
  });
