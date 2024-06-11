"use client";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "./Logo";
import { signUp } from "@/src/authentication";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const inputEmail = useRef<HTMLInputElement>(null);
  const inputPass = useRef<HTMLInputElement>(null);
  const inputPass2 = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleSignUp = async (e: any) => {
    e.preventDefault();
    if (
      await signUp(
        inputEmail.current?.value!,
        inputPass.current?.value!,
        inputPass2.current?.value!
      )
    ) {
      router.push("./mainPage");
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="確認のためもう一度入力"
              type="password"
              id="password2"
              inputRef={inputPass2}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignUp}
            >
              新規登録
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="./" variant="body2">
                  アカウントをお持ちの方はこちら
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
