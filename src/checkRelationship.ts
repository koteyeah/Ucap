import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase-config";
//マッチしたユーザーがいればパートナーテーブルを作成しIDをユーザーテーブルに格納する
export async function isMatch(
  uid: string,
  partner_email: string
): Promise<boolean> {
  try {
    const myDoc = await getDoc(doc(db, "users", uid));
    if (myDoc.exists()) {
      const myData = myDoc.data();
      const myEmail = myData.email;
      const q = query(
        collection(db, "users"),
        where("partner_email", "==", myEmail),
        where("email", "==", partner_email),
        where("partner_id", "==", null)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = await addDoc(collection(db, "partners"), {
          email1: uid,
          email2: querySnapshot.docs[0].id,
        });
        await updateDoc(doc(db, "users", uid), {
          partner_id: docRef.id,
        });
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            partner_id: docRef.id,
          });
        });
        alert("パートナーとマッチしました");
        return true;
      } else {
        alert("パートナーは現在いません");
        return false;
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    return false;
  }
}
