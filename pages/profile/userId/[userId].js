import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import styles from '../../../styles/profile.module.css';   // 引入 CSS 模块

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

// 默认用户信息
const defaultProfile = {
    _id: 'default',
    name: '名字',
    nickname: '昵称/外号',
    bio: '这是一个默认用户信息，系统无法获取实际数据时显示。',
    avatar: 'https://0.gravatar.com/avatar/9acb219d5805c74edec4117f1bcdb4e6ed704ac8670a95d05e923051ca0ef166?size=256',  // 替换为你的默认头像 URL
    birthDate: '2000/01/01',
    joinDate: '2020/01/01 00:00',
    lastActive: '2024/01/01 00:00',
    gender: 'female',
    group: '未知',
};

export async function getServerSideProps({ params }) {
    try {

        const userId = params.userId;

        console.log('userId:', userId);

        const db = await connectToDatabase();
        const collection = db.collection('default');
        let profile = await collection.findOne({ uuid: userId });
        console.log('profile:', profile);

        // 将 MongoDB 的 ObjectId 转换为字符串
        if (profile._id && profile._id instanceof ObjectId) {
            profile._id = profile._id.toString();
        }

        if (!profile) {
            profile = defaultProfile;
        }
        return {
            props: {
                profile,
            },
        };
    } catch (error) {
        console.log('error:', error);
        return {
            props: {
                profile: defaultProfile,
            },
        };
    }
}

export default function ProfilePage({ profile }) {
    // 根据性别动态设置头像框颜色
    const getAvatarClass = (gender) => {
        switch (gender) {
            case 'male':
                return `${styles.avatar} ${styles.male}`;
            case 'female':
                return `${styles.avatar} ${styles.female}`;
            case 'lgbtq':
                return `${styles.avatar} ${styles.lgbtq}`;
            default:
                return `${styles.avatar} ${styles.other}`;
        }
    };
    return (
        <>
            <Head>
                <meta property="og:title" content={profile.name} />
                <meta property="og:description" content={profile.bio} />
                <meta property="og:image" content={profile.avatar} />
                <meta property="og:url" content={`https://char.misaka19614.com/profile/userId/${profile.uuid}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={profile.name} />
                <meta name="twitter:description" content={profile.bio} />
                <meta name="twitter:image" content={profile.avatar} />
                <title>{profile.name}的个人信息</title>
            </Head>
            <div className={styles.container}>
                <img
                    src={profile.avatar}
                    alt="Profile Avatar"
                    className={getAvatarClass(profile.gender)}
                    style={{
                        width: '100px',       // 设定正方形的宽度
                        height: '100px',      // 设定正方形的高度
                        objectFit: 'cover',   // 图片等比例缩放并裁剪
                        objectPosition: 'top left', // 截取图片的左上角
                    }}
                />
                <h1>{profile.name}</h1>
                <p>{profile.bio}</p>
                <ul>
                    <li>来源：{profile.group}</li>
                </ul>
            </div>
        </>
    );
}
