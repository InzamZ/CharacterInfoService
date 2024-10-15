import Head from 'next/head';
import axios from 'axios';
import styles from '../../styles/profile.module.css';   // 引入 CSS 模块

// 默认用户信息
const defaultProfile = {
    _id: 'default',
    name: '名字',
    nickname: '昵称/外号',
    bio: '这是一个默认用户信息，系统无法获取实际数据时显示。',
    avatar: 'https://0.gravatar.com/avatar/9acb219d5805c74edec4117f1bcdb4e6ed704ac8670a95d05e923051ca0ef166?size=256 1x, https://0.gravatar.com/avatar/9acb219d5805c74edec4117f1bcdb4e6ed704ac8670a95d05e923051ca0ef166?size=512',  // 替换为你的默认头像 URL
    birthDate: '2000/01/01',
    joinDate: '2020/01/01 00:00',
    lastActive: '2024/01/01 00:00',
    gender: '未知',
    group: '未知'
};

export async function getServerSideProps({ params }) {
    try {
        const res = await axios.get(`https://your-vercel-url/api/profile?userId=${params.userId}`);
        const profile = res.data;

        return {
            props: {
                profile,
            },
        };
    } catch (error) {
        return {
            props: {
                profile: defaultProfile,
            },
        };
    }
}

export default function ProfilePage({ profile }) {
    return (
        <>
            <Head>
                <meta property="og:title" content={profile.name} />
                <meta property="og:description" content={profile.bio} />
                <meta property="og:image" content={profile.avatar} />
                <meta property="og:url" content={`https://your-vercel-url/profile/${profile._id}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={profile.name} />
                <meta name="twitter:description" content={profile.bio} />
                <meta name="twitter:image" content={profile.avatar} />
                <title>{profile.name}的个人信息</title>
            </Head>
            <div className={styles.container}>
                <img src={profile.avatar} alt="Profile Avatar" className={styles.avatar} />
                <h1>{profile.name}</h1>
                <p>{profile.bio}</p>
                <ul>
                    <li>生日: {profile.birthDate}</li>
                    <li>加入时间: {new Date(profile.joinDate).toLocaleString()}</li>
                    <li>上次活动时间: {new Date(profile.lastActive).toLocaleString()}</li>
                </ul>
                <button>了解更多</button>
            </div>
        </>
    );
}
