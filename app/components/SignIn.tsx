"use client";
import { signIn } from "@/src/authentication";
import { getPosts } from "@/src/post";
import { AltRoute } from "@mui/icons-material";

import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function SignIn() {
  const inputEmail = useRef<HTMLInputElement>(null);
  const inputPass = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleSignIn = async (e: any) => {
    e.preventDefault();
    if (
      inputEmail.current &&
      inputPass.current &&
      (await signIn(inputEmail.current.value, inputPass.current?.value))
    ) {
      router.push("./mainPage");
    } else {
      alert("ログイン失敗");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src="logo.png" />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            bgcolor: "rgba(255, 255, 255, 0.4)",
            borderRadius: "10px",
          }}
        >
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              inputRef={inputEmail}
              autoFocus
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              inputRef={inputPass}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignIn}
            >
              ログイン
            </Button>
            <Grid item>
              <Link href="./signUpPage" variant="body2">
                新規登録
              </Link>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
