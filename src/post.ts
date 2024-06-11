import {
  DocumentData,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "./firebase-config";
import { ref, uploadBytesResumable } from "firebase/storage";
import { addPlace } from "./Place";
import { addMatchInf } from "./match";

export async function addPost(
  placeId: string,
  comment: string | null,
  image: File | null,
  bluePing: File | null,
  pinkPing: File | null
) {
  try {
    //テーブルにpost情報を追加
    const user = auth.currentUser;
    if (user && (await addPlace(placeId))) {
      const admin = await getDoc(doc(db, "posts", "admin"));
      const postNum: number = admin.data()?.post_num;
      const now = new Date();

      await setDoc(doc(db, "posts", String(postNum)), {
        user_id: user.uid,
        timestamp: now,
        place_id: placeId,
        imgUrl: String(postNum) + ".jpg",
        comment: comment,
        query_index: postNum,
      });
      console.log(postNum);

      await updateDoc(doc(db, "posts", "admin"), {
        post_num: postNum + 1,
      });

      console.log("ドキュメントの追加");
      //ストレージに写真、ピンを追加
      if (image) {
        const storageRef = ref(storage, String(postNum) + ".jpg");
        const uploadTask = uploadBytesResumable(storageRef, image);
      }
      if (bluePing) {
        const storageRef = ref(storage, String(postNum) + "_ping_blue.jpg");
        const uploadTask = uploadBytesResumable(storageRef, bluePing);
      }
      if (pinkPing) {
        const storageRef = ref(storage, String(postNum) + "_ping_pink.jpg");
        const uploadTask = uploadBytesResumable(storageRef, pinkPing);
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function getPosts() {
  console.log("getPostsが実行されました");
  const admin = await getDoc(doc(db, "posts", "admin"));
  const postNum: number = admin.data()?.post_num;
  const numbers: number[] = [];
  const postList: {
    uid: string;
    timestamp: any;
    placeId: string;
    imgUrl: any;
    comment: any;
    placeInf: DocumentData | undefined;
    flag: boolean;
  }[] = [];
  while (numbers.length < 10) {
    const randomNumber = Math.floor(Math.random() * postNum);
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  try {
    const postPromises = numbers.map(async (index) => {
      const postDoc = await getDoc(doc(db, "posts", String(index)));
      if (postDoc.exists()) {
        const placeDoc = await getDoc(
          doc(db, "places", postDoc.data().place_id)
        );
        const flag: boolean = await addMatchInf(postDoc.data().place_id);
        if (placeDoc.exists()) {
          const post = {
            uid: postDoc.data().user_id,
            timestamp: postDoc.data().timestamp,
            placeId: postDoc.data().place_id,
            imgUrl: postDoc.data().imgUrl,
            comment: postDoc.data().comment,
            placeInf: placeDoc.data(),
            flag: flag,
          };
          postList.push(post);
        }
      }
    });

    // 全てのPromiseが解決されるのを待つ
    await Promise.all(postPromises);
    console.log(postList);
    // 全ての非同期操作が完了した後に結果をログ出力
    return postList;
  } catch (error) {
    console.log(error);
    return null;
  }
}
