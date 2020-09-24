const shop = {
    states: {
        list: []
    },
    mutations: {
        add(state, payload) {
            state.list.push(payload);
        },
        remove(state, payload) {
            const index = state.list.indexOf(payload);
            state.list.splice(index, 1);
        }
    },
    getters: {
        // your getters here
        getList(state) {
            return state.list;
        }
    }
};

export default shop;
