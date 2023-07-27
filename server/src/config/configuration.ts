export default () => ({
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    origin: process.env.CORS_ORIGIN,
});
