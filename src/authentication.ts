import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as logOut,
  Auth,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { addUser } from "./user";
export async function signUp(
  email: string,
  password: string,
  password2: string
): Promise<boolean> {
  if (password !== password2) {
    alert("パスワードが一致しません");
    return Promise.reject(false);
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
      await addUser(auth.currentUser.uid!, auth.currentUser.email!);
      alert("初めまして" + email + "さん！");
      return Promise.resolve(true);
    } else {
      return Promise.reject(false);
    }
  } catch (error) {
    console.log(error);
    return Promise.reject(false);
  }
}
// develop env test
export async function signIn(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    alert("こんにちは" + email + "さん！");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function signOut(auth: Auth) {
  try {
    await logOut(auth);
    alert("ログアウト成功");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
