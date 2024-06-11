import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { auth, db, firebaseConfig } from "./firebase-config";
import { User, getAuth } from "firebase/auth";

export async function addLike(place_id: string): Promise<false | true> {
  const user: User | null = auth.currentUser;
  try {
    const placeDoc = await getDoc(doc(db, "places", place_id));
    if (placeDoc.exists()) {
      if (user) {
        console.log(user.uid);
        console.log(placeDoc.data().name);
        //まだライクしていなければ追加
        const q = query(
          collection(db, "likes"),
          where("user_id", "==", user.uid),
          where("place_id", "==", place_id)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          await addDoc(collection(db, "likes"), {
            user_id: user.uid,
            user_email: user.email,
            place_id: place_id,
          });
          console.log("likeしました")
          return true;
        } else {
          console.log("すでにライクしています");
          return true;
        }
      } else {
        console.log("ユーザが見つかりません");
        return false;
      }
    } else {
      console.log("place情報が見つかりません");
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
