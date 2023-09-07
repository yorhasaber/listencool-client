/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
    const res = await fetch("https://v1.hitokoto.cn/?c=j");
    return await res.json();
}
