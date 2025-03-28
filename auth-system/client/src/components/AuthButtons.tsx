import { useState } from "react";
import { Button, Stack } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthButtons = () => {
  const navigate = useNavigate();
  const [, setToken] = useState(""); 


  const loginBasic = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/auth/basic", {
        username: "Mary",
        password: "password",
      });
  
      localStorage.setItem("user", data.user); 
      alert(`Вы вошли как ${data.user}`);
      navigate("/dashboard");
    } catch {
      alert("Ошибка входа: Попробуйте снова");
    }
  };
  

  const loginBasicToken = async () => {
    const { data } = await axios.post("http://localhost:5000/auth/basic-token", {
      username: "Mary",
      password: "password"
    });
    localStorage.setItem("token", data.accessToken);
    setToken(data.accessToken);
    navigate("/dashboard");
  };

  //  Basic Auth + Bearer-токен 
  const loginBearer = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/auth/bearer", {
        username: "Mary",
        password: "password"
      });
      console.log("Ответ сервера:", data); 
      if (!data.token) {
        throw new Error("Токен не получен");
      }
      
      localStorage.setItem("token", data.token);
      alert("Вы вошли через Basic Auth + Bearer");
      setToken(data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Ошибка входа:", error); 
      alert("Ошибка входа");
    }
  };

  // JWT (Access + Refresh Tokens)
  // Вход или обновление JWT
  const handleJWT = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (refreshToken) {
      try {
        const { data } = await axios.post("http://localhost:5000/auth/refresh", { refreshToken });
        localStorage.setItem("token", data.accessToken);
        setToken(data.accessToken);
        alert("Токен обновлён!");
        return;
      } catch {
        alert("Ошибка обновления токена, повторите вход");
      }
    }
    
    try {
      const { data } = await axios.post("http://localhost:5000/auth/jwt", {
        username: "Mary",
        password: "password"
      });
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setToken(data.accessToken);
      navigate("/dashboard");
    } catch {
      alert("Ошибка входа");
    }
  };

  //OAuth 2.0 (Yandex)
  const loginYandex = () => {
    window.location.href = "http://localhost:5000/auth/yandex";
  };

  return (
    <Stack spacing={2}>
      <Button variant="contained" onClick={loginBasic}>Basic Auth</Button>
      <Button variant="contained" onClick={loginBasicToken}>Basic + Token</Button>
       <Button variant="contained" onClick={loginBearer}>Bearer Auth</Button>
<Button variant="contained" onClick={handleJWT}>JWT (Вход / Обновление)</Button>
<Button variant="contained" onClick={loginYandex}>OAuth 2.0 (Yandex)</Button>



    </Stack>
  );
};

export default AuthButtons;





//   // 1️⃣ Basic Auth (Без токена)
//   const loginBasic = async () => {
//     try {
//       await axios.post("http://localhost:5000/auth/basic", {
//         username: "user",
//         password: "password",
//       });
//       alert("Вы вошли через Basic Auth");
//     } catch  {
//       alert("Ошибка входа");
//     }
//   };

//   // 2️⃣ Basic Auth + Token (Выдаёт токен 1 к 1, но не Bearer)
//   const loginBasicToken = async () => {
//     try {
//       const { data } = await axios.post("http://localhost:5000/auth/basic-token", {
//         username: "user",
//         password: "password"
//       });
//       localStorage.setItem("token", data.token);
//       alert("Вы вошли через Basic Auth + Token");
//       setToken(data.token);
//       navigate("/dashboard");
//     } catch  {
//       alert("Ошибка входа");
//     }
//   };

//   // 3️⃣ Basic Auth + Bearer-токен (Требует передачи в заголовке Authorization: Bearer <token>)
//   const loginBearer = async () => {
//     try {
//       const { data } = await axios.post("http://localhost:5000/auth/bearer", {
//         username: "user",
//         password: "password"
//       });
//       localStorage.setItem("token", data.token);
//       alert("Вы вошли через Basic Auth + Bearer");
//       setToken(data.token);
//       navigate("/dashboard");
//     } catch {
//       alert("Ошибка входа");
//     }
//   };

//   // 4️⃣ JWT (Access + Refresh Tokens)
//   // Вход или обновление JWT
//   const handleJWT = async () => {
//     const refreshToken = localStorage.getItem("refreshToken");
    
//     if (refreshToken) {
//       try {
//         const { data } = await axios.post("http://localhost:5000/auth/refresh", { refreshToken });
//         localStorage.setItem("token", data.accessToken);
//         setToken(data.accessToken);
//         alert("Токен обновлён!");
//         return;
//       } catch {
//         alert("Ошибка обновления токена, повторите вход");
//       }
//     }
    
//     try {
//       const { data } = await axios.post("http://localhost:5000/auth/jwt", {
//         username: "user",
//         password: "password"
//       });
//       localStorage.setItem("token", data.accessToken);
//       localStorage.setItem("refreshToken", data.refreshToken);
//       setToken(data.accessToken);
//       navigate("/dashboard");
//     } catch {
//       alert("Ошибка входа");
//     }
//   };

//   // 5️⃣ OAuth 2.0 (Google)
//   const loginOAuth = () => {
//     window.location.href = "http://localhost:5000/auth/google";
//   };

//   return (
//     <Stack spacing={2}>
//       <Button variant="contained" onClick={loginBasic}>Basic Auth</Button>
//       <Button variant="contained" onClick={loginBasicToken}>Basic + Token</Button>
//       <Button variant="contained" onClick={loginBearer}>Bearer Auth</Button>
//       <Button variant="contained" onClick={handleJWT}>JWT (Вход / Обновление)</Button>
//       <Button variant="contained" onClick={loginOAuth}>OAuth 2.0 (Google)</Button>
//     </Stack>
//   );
// };

// export default AuthButtons;
