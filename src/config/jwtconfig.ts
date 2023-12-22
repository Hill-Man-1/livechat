const JWT_TOKEN = process.env.SECRET_TOKEN;

if (!JWT_TOKEN) {
    console.error('SECRET_TOKEN is not defined in .env file');
    process.exit(1);
}

export default JWT_TOKEN;