import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase-config";
import { User } from "firebase/auth";

//サインアップ時に実行userTableにユーザー情報を追加
export async function addUser(uid: string, email: string): Promise<boolean> {
  try {
    await setDoc(doc(db, "users", uid), {
      ID: uid,
      email: email,
      partner_email: null,
      partner_id: null,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function updateUsersPartner(
  partner_email: string
): Promise<boolean> {
  try {
    const user: User | null = auth.currentUser;
    if (user != null && partner_email != user.email) {
      console.log(user.email + "でログインしています");
      await updateDoc(doc(db, "users", user.uid), {
        partner_email: partner_email,
      });
      await isMatch(user.uid, partner_email);
      return true;
    } else {
      console.log("登録できません");
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
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
export async function getUser(user: User): Promise<DocumentData | null> {
  try {
    console.log(user.email + "でgetUserを呼び出しました。");
    if (user != null) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
    }
    console.log("ユーザーが見つかりません");
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
