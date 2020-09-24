<template>
    <div class="content">
        <img src="https://i.imgur.com/i7USWPo.jpg" />
        <p>
            📦 Fast, Simple, and Lightweight State Management for Vue 3.0 built
            with composition API, inspired by Vuex.
        </p>
        <h5>Examples:</h5>
        <small><mark>click to launch</mark></small>
        <ul class="list">
            <li @click="showComponent('counter')">counter</li>
            <li @click="showComponent('shop')">shopping card</li>
        </ul>
        <component :is="componentName"></component>
    </div>
</template>

<script>
import { ref, computed } from "vue";
import counter from "./components/counter";
import shop from "./components/shop";
export default {
    components: {
        counter,
        shop
    },
    setup() {
        let component = ref("shop");

        const showComponent = value => {
            component.value = value;
        };

        const componentName = computed(() => {
            return component.value;
        });

        return {
            component,
            showComponent,
            componentName
        };
    }
};
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.content {
    img {
        width: 200px;
        height: auto;
    }

    h5 {
        margin: 50px 0 0 0;
        padding: 0;
    }

    small {
        font-size: 12px;
        display: inline-block;
    }

    ul {
        margin-top: 5px;
    }
}

.list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: blue;
    margin-bottom: 20px;

    li {
        cursor: pointer;
        list-style: none;
        padding: 5px 10px;
    }

    li:hover {
        color: darken($color: blue, $amount: 50);
    }
}
</style>
