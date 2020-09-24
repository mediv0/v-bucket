<template>
    <div class="shop">
        <div class="shop-items">
            <h4>Select item</h4>
            <div class="shop-items-container">
                <div
                    v-for="i in 12"
                    @click="addToTheList(i)"
                    :key="i"
                    class="shop-items-container-item"
                >
                    {{ i }}
                </div>
            </div>
        </div>
        <div class="shop-card">
            <h4>Shopping card</h4>
            <div class="shop-card-items">
                <div
                    v-for="(item, key) in list"
                    :key="key"
                    @click="removeFromList(item)"
                    class="shop-card-items-item"
                >
                    <div class="shop-card-items-item-remove">x</div>
                    <p>item number {{ item }} added</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from "vue";
import { useBucket } from "../../dist/v-bucket.esm-browser.prod";
export default {
    setup() {
        const bucket = useBucket();
        const addToTheList = id => {
            // run commit
            bucket.commit("shop/add", id);
        };
        const removeFromList = id => {
            bucket.commit("shop/remove", id);
        };

        const list = computed(() => {
            return bucket.getters["shop/getList"];
        });

        return {
            addToTheList,
            removeFromList,
            list
        };
    }
};
</script>

<style lang="scss" scoped>
.shop {
    margin: 0 auto;
    padding: 7px 15px;
    width: 900px;
    display: flex;
    border: 1px solid #e9e9e9;
    border-radius: 5px;

    &-items {
        margin-right: 15px;
        flex: 1;
        text-align: left;

        &-container {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            &-item {
                cursor: pointer;
                width: 100px;
                height: 100px;
                background: #dadada;
                border-radius: 15px;
                margin: 10px 5px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

    &-card {
        background: rgb(74, 74, 255);
        color: white;
        border-radius: 5px;
        width: 360px;

        &-items {
            padding: 0 20px;
            &-item {
                display: flex;
                align-items: center;

                & > div {
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    background: rgb(255, 52, 52);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 4px;
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>
