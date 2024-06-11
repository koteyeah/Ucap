import {
  query,
  collection,
  where,
  orderBy,
  limit,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db, mapApiKey, storage } from "./firebase-config";
import { StorageReference, ref, getDownloadURL } from "firebase/storage";

export async function getPostPhoto(imgUrl: string): Promise<string> {
  const imageRef: StorageReference = ref(storage, imgUrl);
  return getDownloadURL(imageRef)
    .then((url) => {
      // 画像を取得する
      return url;
    })
    .catch((error) => {
      console.log("Error getting download URL:", error);
      return "";
    });
}
// placeIDから画像urlを取得
export async function id2Photo(place_id: string): Promise<string> {
  const q = query(
    collection(db, "posts"),
    where("place_id", "==", place_id),
    limit(1)
  );
  let imgUrl: string = "";
  let accessUrl: string = "";
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      for (const post of querySnapshot.docs) {
        imgUrl = post.data().imgUrl;
        accessUrl = await getPostPhoto(imgUrl);
      }
    }
    return accessUrl;
  } catch (error) {
    console.log(error);
    return "";
  }
}
//idからマーカ画像を取得
export async function id2Ping(
  place_id: string,
  color: "blue" | "pink"
): Promise<string> {
  const q = query(
    collection(db, "posts"),
    where("place_id", "==", place_id),
    limit(1)
  );
  let imgUrl: string = "";
  let accessUrl: string = "";
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      for (const post of querySnapshot.docs) {
        imgUrl = post.data().query_index + "_ping_" + color + ".jpg";
        console.log(post.data());
        console.log(imgUrl);
        accessUrl = await getPostPhoto(imgUrl);
      }
    }
    return accessUrl;
  } catch (error) {
    console.log(error);
    return "";
  }
}
