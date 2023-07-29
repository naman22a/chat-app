export default () => ({
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    db_url: process.env.DATABASE_URL,
    session_secret: process.env.SESSION_SECRET,
    origin: process.env.CORS_ORIGIN,
});
