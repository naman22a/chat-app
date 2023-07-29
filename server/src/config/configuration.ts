export default () => ({
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    db_url: process.env.DATABASE_URL,
    origin: process.env.CORS_ORIGIN,
});
