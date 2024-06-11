import {
  setDoc,
  doc,
  query,
  DocumentData,
  collection,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import { auth, db, mapApiKey } from "./firebase-config";
import { PlaceInf } from "./types";
import axios from "axios";
import { id2Photo, id2Ping } from "./url2Photo";
export async function getPlaceInfo(placeId: string) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${mapApiKey}&language=ja`;
  try {
    const response = await axios.get(url);
    console.log("データ取得");
    const data = response.data;
    if (data.status === "OK" && data.result) {
      const result = data.result;
      const placeDetail: PlaceInf = {
        id: result.place_id,
        name: result.name,
        address: result.formatted_address,
        addressComponents: result.address_components,
        genres: result.types,
        overview: result.editorial_summary?.overview
          ? result.editorial_summary.overview
          : null,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        website: result.website ? result.website : null,
        postNum: 0,
      };
      return placeDetail;
    }
  } catch (error) {
    console.error("Error fetching spot information:", error);
    throw error;
  }
}
export async function addPlace(place_id: string) {
  try {
    const placeDoc = await getDoc(doc(db, "places", place_id));
    //placeに情報がなければデータベースに追加
    if (!placeDoc.exists()) {
      console.log("データベースにないスポットです。データベースに追加します。");
      const response = await fetch(`/api/?place_id=${place_id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.placeInf) {
        await setDoc(doc(db, "places", data.placeInf.id), data.placeInf);
        console.log("placeを追加しました。");
        return true;
      } else {
        console.log("結果が取得できませんでした");
        return false;
      }
    } else {
      console.log("placeがすでに存在します。");
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getLikePlace() {
  const user = auth.currentUser;
  if (user) {
    const q = query(collection(db, "likes"), where("user_id", "==", user.uid));
    try {
      const querySnapshot = await getDocs(q);
      const docs: DocumentData[] = [];
      if (!querySnapshot.empty) {
        for (const likeDoc of querySnapshot.docs) {
          const placeDoc = await getDoc(
            doc(db, "places", likeDoc.data().place_id)
          );
          if (placeDoc.exists()) {
            const placeData = placeDoc.data();
            if (placeData) {
              //ここをid2pingに変更するとマーカーが取得できる
              const imgUrl = await id2Photo(likeDoc.data().place_id);
              console.log("imgUrl:", imgUrl);
              docs.push({ ...placeData, imgUrl });
            }
          }
        }
      }
      console.log("likePlaceを取得しました");
      console.log(docs);
      return docs;
    } catch (error) {
      console.log(error);
      return null;
    }
  } else {
    console.log("ユーザが見つかりませんでした");
    return null;
  }
}
export async function getMatchPlace() {
  const user = auth.currentUser;
  const myDoc = await getDoc(doc(db, "users", user?.uid!));
  if (myDoc.exists()) {
    const partner_id = myDoc.data().partner_id;
    const q = query(
      collection(db, "matches"),
      where("partner_id", "==", partner_id)
    );
    try {
      const querySnapshot = await getDocs(q);
      const docs: DocumentData[] = [];
      if (!querySnapshot.empty) {
        for (const matchDoc of querySnapshot.docs) {
          const placeDoc = await getDoc(
            doc(db, "places", matchDoc.data().place_id)
          );
          if (placeDoc.exists()) {
            const placeData = placeDoc.data();
            if (placeData) {
              //ここをid2pingに変更するとマーカーが取得できる
              const imgUrl = await id2Photo(matchDoc.data().place_id);
              docs.push({ ...placeData, imgUrl });
            }
          }
        }
      }
      console.log("matchPlaceを取得しました");
      console.log(docs);
      return docs;
    } catch (error) {
      console.log(error);
      return null;
    }
  } else {
    console.log("ユーザが見つかりませんでした");
    return null;
  }
}
