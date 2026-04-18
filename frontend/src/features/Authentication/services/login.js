export const handleLogin = async ({ email, password }) => {
    if (email === "test@gmail.com" && password === "123") {
        return {
            success: true,
            user: { email }
        };
    }
    return { success: false };
}
