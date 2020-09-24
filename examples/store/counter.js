const counter = {
    states: {
        count: 0
    },
    mutations: {
        inc(state) {
            state.count++;
        },
        desc(state) {
            if (state.count > 0) {
                state.count--;
            }
        }
    },
    getters: {
        GET_COUNT(state) {
            return state.count;
        }
    }
};

export default counter;
