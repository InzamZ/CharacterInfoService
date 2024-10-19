import { MongoClient } from 'mongodb';

// 创建数据库连接
const client = new MongoClient(process.env.MONGODB_ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
let db;

async function connectToDatabase() {
    if (!db) {
        await client.connect();
        db = client.db('CharacterProfiles');
    }
    return db;
}

export default async function handler(req, res) {
    const { userId } = req.query;

    console.log('userId:', userId);
    console.log('userId:', userId, typeof userId);

    try {
        const db = await connectToDatabase();
        const collection = db.collection('default');
        console.log('Collection found:', collection);
        const profile = await collection.findOne({ uuid: userId });
        console.log('Querying profile with uuid:', userId);
        console.log('Profile found:', profile);
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // 返回数据和元信息
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
}
