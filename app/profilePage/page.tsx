"use client";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { getUser, updateUsersPartner } from "@/src/user";
import Loading from "../components/Loading";
import { auth } from "@/src/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "@/src/authentication";
import { useRouter } from "next/navigation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Header from "../components/Header";
interface UserData {
  ID: string;
  email: string;
  partner_email: string;
  partner_id: null | string;
}
export default function Page() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const data = await getUser(user);
          if (data) {
            setUserData({
              ID: data.ID,
              email: data.email,
              partner_email: data.partner_email,
              partner_id: data.partner_id,
            });
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const input = useRef<HTMLInputElement>(null);
  const registerEmail = async (e: any) => {
    e.preventDefault();
    if (await updateUsersPartner(input.current?.value!)) {
      alert("登録完了。ホーム画面に戻ります。");
      router.push("./mainPage");
    } else {
      alert("登録失敗");
    }
  };
  const handleSignOut = async (e: any) => {
    e.preventDefault();
    if (await signOut(auth)) {
      router.push("./");
    }
  };
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh", // Viewport height
          minWidth: "100vw", // Viewport width
        }}
      >
        <Loading />
        <Footer currentPage={"profile"} />
      </Box>
    );
  }
  if (userData) {
    return (
      <>
        <Box
          sx={{
            minHeight: "100vh", // Viewport height
            minWidth: "100vw", // Viewport width
          }}
        >
          <Header />
          <Typography component="h2" variant="h5">
            <AccountCircleIcon className=" text-gray-500 text-5xl " />
            {userData.email}
          </Typography>
          <Container maxWidth="sm">
            <Box
              sx={{
                marginTop: 10,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "rgba(255, 255, 255, 0.4)",
                borderRadius: "10px",
                maxWidth: "80%", // 画面の80%の幅に設定
                marginX: "auto",
              }}
            >
              {userData.partner_id == null ? (
                <>
                  {userData.partner_email != null ? (
                    <Typography component="h2" variant="h5">
                      <AccountCircleIcon className=" text-gray-500 text-5xl " />
                      {userData.partner_email}に設定中
                    </Typography>
                  ) : (
                    <></>
                  )}
                  <Typography component="h2" variant="h6">
                    パートナーIDを入力してください
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="ID"
                    label="e-mail"
                    name="ID"
                    autoComplete="ID"
                    inputRef={input}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={registerEmail}
                  >
                    パートナー登録
                  </Button>
                </>
              ) : (
                <>
                  <Typography component="h2" variant="h5">
                    パートナー
                  </Typography>
                  <Typography component="h2" variant="h5">
                    <AccountCircleIcon className=" text-gray-500 text-5xl " />
                    {userData.partner_email}
                  </Typography>
                  <Typography component="h2" variant="h5">
                    設定は完了しています
                  </Typography>
                </>
              )}
            </Box>
            <div className="w-1/2 mx-auto mb-4">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSignOut}
              >
                ログアウト
              </Button>
            </div>
          </Container>
        </Box>
        <Footer currentPage={"profile"} />
      </>
    );
  }
}
