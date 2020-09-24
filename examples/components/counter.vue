<template>
    <div class="counter">
        <h1>{{ counter }}</h1>
        <small>number</small>
        <div>
            <button @click="inc">increment</button>
            <button @click="desc">decrement</button>
        </div>
    </div>
</template>

<script>
import { computed } from "vue";
import { useBucket } from "../../dist/v-bucket.esm-browser.prod";
export default {
    setup() {
        const bucket = useBucket();
        let counter = computed(() => {
            return bucket.getters["counter/GET_COUNT"];
        });

        const inc = () => {
            bucket.commit("counter/inc");
        };
        const desc = () => {
            bucket.commit("counter/desc");
        };

        return {
            counter,
            inc,
            desc
        };
    }
};
</script>

<style scoped lang="scss">
div.counter {
    margin: 0 auto;
    width: 500px;
    height: 300px;
    border: 1px solid #e9e9e9;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        font-size: 90px;
        margin: 0;
        padding: 0;
    }

    small {
        margin-bottom: 40px;
    }
}

button {
    cursor: pointer;
    padding: 8px 30px;
    margin: 5px;
}
</style>
