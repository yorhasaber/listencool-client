export default {
    state: {
        token: false, // 用户是否登录
        showAside: false, // 是否显示侧边栏
        searchWord: "", // 搜索关键词
        activeNavName: "", // 导航栏名称
        showbigPlayer: false,//是否显示大歌曲页面
    },
    getters: {
        token: (state) => state.token,
        activeNavName: (state) => state.activeNavName,
        showAside: (state) => state.showAside,
        showbigPlayer: (state) => state.showbigPlayer,
        searchWord: (state) => state.searchWord,
    },
    mutations: {
        setToken: (state, token) => {
            state.token = token;
        },
        setActiveNavName: (state, activeNavName) => {
            state.activeNavName = activeNavName;
        },
        setShowAside: (state, showAside) => {
            state.showAside = showAside;
        },
        setshowbigPlayer: (state, showbigPlayer) => {
            state.showbigPlayer = showbigPlayer;
        },
        setSearchWord: (state, searchWord) => {
            state.searchWord = searchWord;
        },
    },
};
