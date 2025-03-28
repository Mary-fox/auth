import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const [message, setMessage] = useState("Загрузка...");
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Получаем токен из URL (если он есть)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");

        if (tokenFromUrl) {
            console.log("Новый токен из URL:", tokenFromUrl);
            localStorage.setItem("token", tokenFromUrl);
            window.history.replaceState({}, document.title, "/dashboard"); // Убираем токен из URL
        }

        // Проверяем токен в localStorage
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token) {
            axios.get("http://localhost:5000/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setMessage(response.data.message);
                if (response.data.username) {
                    setUsername(response.data.username);
                    localStorage.setItem("user", response.data.username);
                }
            })
            .catch(() => {
                setMessage("Ошибка доступа");
                localStorage.removeItem("token");
            });
        } else if (storedUser) {
            setUsername(storedUser);
            setMessage(`Добро пожаловать, ${storedUser}`);
        } else {
            setMessage("Нет доступа");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h4">Личный кабинет</Typography>
            <Typography variant="h6">{username ? `Привет, ${username}!` : message}</Typography>
            <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
                Выйти
            </Button>
        </Container>
    );
};

export default Dashboard;
