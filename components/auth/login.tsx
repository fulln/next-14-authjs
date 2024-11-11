"use client";

// library imports
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box, Button, Container, TextField, Typography, Paper, Grid } from "@mui/material";
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const searchParams = useSearchParams();
  const wechatLogin = "https://open.weixin.qq.com/connect/qrconnect?appid=wx17e57c60b80489cd&redirect_uri=http%3A%2F%2Freadlecture.cn&response_type=code&scope=snsapi_login&state=3d6be0a4035d839573b04816624a415e#wechat_redirect";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authenticated) {
      // Redirect to previous page or home page
      const next = searchParams.get("next") || "/";
      window.location.href = next;
    }
  }, [authenticated]);

  const login = async () => {
    signIn("github", { // 登录方法，第一个参数标注平台
      callbackUrl: `${window.location.origin}`, // 设置登录成功后的回调地址
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, type: "credentials" }),
      });

      if (res.ok) {
        setAuthenticated(true);
      } else {
        // handle error state here
        setError("Invalid credentials");
      }
    } catch (error) {
      // handle error state here
      console.error("Error during sign-in", error);
      setError("Internal server error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          登录
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Sign In
              </Button>
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error" align="center">
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
        <Box mt={2} textAlign="center">
          or
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              component={Link}
              href={wechatLogin}
              variant="contained"
              color="secondary"
              fullWidth
            >
              微信登录
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              fullWidth
              onClick={login}
            >
              Sign in with GitHub
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}