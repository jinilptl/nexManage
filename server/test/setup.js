import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll, afterEach } from "vitest";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    process.env.MONGO_URI = uri;
    process.env.JWT_SECRET = "test-jwt-secret-key-for-testing";
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.SENDGRID_API_KEY = "test-key";
    process.env.FROM_EMAIL = "test@nexmanage.com";
    process.env.CLOUDINARY_CLOUD_NAME = "test";
    process.env.CLOUDINARY_API_KEY = "test";
    process.env.CLOUDINARY_API_SECRET = "test";

    await mongoose.connect(uri);
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});
