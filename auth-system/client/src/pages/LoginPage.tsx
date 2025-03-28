
import { Container, Typography } from "@mui/material";
import AuthButtons from "../components/AuthButtons";

const LoginPage = () => {
    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h4">Авторизация</Typography>
            <AuthButtons />
        </Container>
    );
};

export default LoginPage;
