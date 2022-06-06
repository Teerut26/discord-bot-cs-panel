import { getFirestore } from "firebase-admin/firestore";
import firebaseAdmin from "./firebase";

const db = getFirestore(firebaseAdmin);

export default db