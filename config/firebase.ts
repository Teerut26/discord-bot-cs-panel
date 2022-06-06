import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG as string);
const config = {
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};
let firebaseAdmin: admin.app.App;

if (!admin.apps.length) {
    firebaseAdmin = admin.initializeApp(config);
} else {
    firebaseAdmin = admin.app();
}

export default firebaseAdmin;