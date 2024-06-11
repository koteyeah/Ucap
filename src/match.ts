import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase-config";

export async function addMatch(place_id: string) {
  try {
    const user = auth.currentUser;
    const myDoc = await getDoc(doc(db, "users", user?.uid!));
    if (myDoc.exists()) {
      const partner_email = myDoc.data().partner_email;
      const partner_id = myDoc.data().partner_id;
      const q = query(
        collection(db, "matches"),
        where("place_id", "==", place_id),
        where("partner_id", "==", partner_id)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const docRef = await addDoc(collection(db, "matches"), {
          place_id: place_id,
          partner_id: partner_id,
        });
        console.log("マッチテーブルに追加します。");
        return true;
      } else {
        console.log("すでにマッチしています。");
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function addMatchInf(place_id: string) {
  try {
    const user = auth.currentUser;
    const myDoc = await getDoc(doc(db, "users", user?.uid!));
    if (myDoc.exists()) {
      const partner_email = myDoc.data().partner_email;
      const partner_id = myDoc.data().partner_id;
      const q = query(
        collection(db, "likes"),
        where("place_id", "==", place_id),
        where("user_email", "==", partner_email)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
