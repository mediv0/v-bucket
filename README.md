# v-bucket [![Codecov Coverage](https://img.shields.io/codecov/c/github/mediv0/v-bucket/coverage.svg?style=flat-square)](https://codecov.io/gh/mediv0/v-bucket) [![Code Grade](https://www.code-inspector.com/project/13923/status/svg)](https://www.code-inspector.com/project/13923/status/svg) [![maintainability](https://img.shields.io/codeclimate/maintainability/mediv0/v-bucket)](https://img.shields.io/codeclimate/maintainability/mediv0/v-bucket) [![License](https://img.shields.io/github/license/mediv0/v-bucket)](https://img.shields.io/github/license/mediv0/v-bucket)

> 📦 Fast, Simple, and Lightweight State Management for Vue 3.0 built with composition API, inspired by Vuex.

<p align="center">
  <img width="500px" src="https://i.imgur.com/6wQ0GRr.png">
</p>

## Table of Contents

### Main features

-   [installation](#installation)
-   [usage](#usage)
-   [using with composition api]("#using-with-composition-api")
-   [using with option api]("#using-with-option-api")
-   [states](#states)
-   [mutations](#mutations)
-   [getters](#getters)
-   [actions](#actions)
-   [modules](#modules)

### Access modules

-   [how to access module states](#how-to-access-module-states)
-   [how to access module getters](#how-to-access-module-getters)
-   [how to access module mutations](#how-to-access-module-mutations)
-   [how to access module actions](#how-to-access-module-actions)

### Advanced

-   [plugins](#plugins)
-   [plugin hooks](#plugin-hooks)

## Examples

-   [CodeSandbox](https://codesandbox.io/s/dank-waterfall-mrfzq)
-   [Counter](https://github.com/mediv0/v-bucket/blob/master/examples/components/counter.vue)
-   [Shopping Cart](https://github.com/mediv0/v-bucket/blob/master/examples/components/shop.vue)

Running the examples:

```bash
$ npm run dev
$ yarn dev
```

## Running tests

```bash
$ npm run test
$ yarn test
```

## installation

install this package from NPM:

```bash
$ npm install @mediv0/v-bucket
```

or yarn:

```bash
$ yarn add @mediv0/v-bucket
```

## usage

first you need to create your bucket.
create an index.js file, then import createBucket from v-bucket to start creating your store, like this:

```javascript
import { createBucket } from "@mediv0/v-bucket";

const bucket = createBucket({
    states: {
        // your states here
    },
    mutations: {
        // your mutations here
    },
    getters: {
        // your getters here
    },
    modules: {
        // your modules here
    }
});
export default bucket;
```

then import it in your app entry point, main.js like this:

```javascript
import { createApp } from "vue";
import App from "./dev.vue";
// importing your bucket
import bucket from "./bucket/index";

createApp(App)
    .use(bucket)
    .mount("#app");
```

## using with composition api

for using v-bucket inside the setup() function you need to import useBucket first. like this:

```javascript
<script>
import { useBucket } from "@mediv0/v-bucket"
export default {
    setup() {
        // get access to the v-bucket
        const bucket = useBucket();

        // ...

        return {
            // ....
        };
    }
};
</script>
```

## using with option api

like vue 2.X apps you can access v-bucket on the vue instance outside of the setup() function. like this:

```javascript
<script>
export default {
    mounted() {
        // accessing bucket on this
        this.$bucket

        // ...
    },
    methods: {
      click() {
        this.$bucket.commit("SET_ID", this.id);

        // ...
      }
    }
};
</script>
```

_you only import useBucket when you want to use it inside setup() function_

## states

this is a single object contains all your application states.

accessing states:

```javascript
 mounted() {
    // accessing id state in the root level
    this.$bucket.state.id

    // ...

    // accessing name state in the nested tree
    this.$bucket.state.module1.name
 },
```

declare states inside your bucket (index.js):

```javascript
import { createBucket } from "@mediv0/v-bucket";

const bucket = createBucket({
    states: {
        id: 1,
        name: "mahdi",
        phone: 120304
    },
    mutations: {
        // your mutations here
    },
    getters: {
        // your getters here
    },
    modules: {
        // your modules here
    }
});
export default bucket;
```

**NOTE:** states object will be reactive by default. that means they will react to changes and update based on it.

**NOTE:** it's better to use mutations or getters to access states.

## mutations

use mutations when you need to change a state value, all mutations will take 2 parameter:

-   state
-   payload

```javascript
const bucket = createBucket({
    mutations: {
        SET_ID(state, payload)
    },
});
```

with **state**, you can have access to states object and change its value by passing **payload**.

**NOTE:** payload is optional.

```javascript
const bucket = createBucket({
    states: {
      id: 0,
      count: 0
    }
    mutations: {
        SET_ID(state, payload) {
          // changing id value
          state.id = payload
        }
        COUNT_UP(state) {
          // without payload
          state.count++;
        }
    },
});
```

you can't access mutations directly. you have to call them with commit method. like this:

```javascript
methods: {
   click() {

     this.$bucket.commit("SET_ID", 5);
     this.$bucket.state.id // must be 5 now!

     // ...

     this.$bucket.commit("SET_ID"); // calling without a payload

   }
 }
```

## getters

you can use getters to access states and their values. getters are like Vue computed methods, they will cache the state and return it only when the state value change.

```javascript
const bucket = createBucket({
    states: {
      id: 0,
      name: "mahdi",
      phone: 893729837
    }
    getters: {
      GET_ID(state) {
        return state.id
      }
    },
});
```

all getters will take 1 parameter:

-   state (used to access states object)

using it in your vue app:

```javascript
methods: {
   click() {

     this.$bucket.getters["GET_ID"] // will return id state

     // ...
   }
 }
```

## actions

Actions are like mutations. the difference is:

-   They can handle asynchronous operations
-   Instead of mutating the state, actions commit mutations.

```javascript
const bucket = createBucket({
    states: {
      count: 0
    }
    mutations: {
      increment(state) {
        state.count++
      }
    },
    actions: {
      increment(context) {
        context.commit("increment");
      }

      // or using argument destructuring to simplify the code.
      anotherAction({ commit }) {
        // do some action!
        commit("someMutation");
      }
    }
});
```

also you can call other actions with context.dispatch. like this:

```javascript
const bucket = createBucket({
    actions: {
      actionOne(context) {
        context.commit("someMutation");
      }
      actionTwo(context) {
        context.dispatch("actionOne"); // dispatching actionOne from another action!
      }
    }
});
```

also you can't access actions directly. you have to call them with dispatch method. like this:

```javascript
methods: {
   click() {

     this.$bucket.dispatch("increment") // will call increment action

     // ...

   }
 }
```

**_the context parameter will return root instance of our bucket. this is useful when working with modules._**

## modules

from vuex docs:

-   _Due to using a single state tree, all states of our application are contained inside one big object. However, as our application grows in scale, the store can get really bloated. To help with that, Vuex allows us to divide our store into **modules**._

```javascript
const moduleA = {
  states: { ... },
  mutations: { ... },
  actions: { ... },
  modules: { ... }
}

const moduleB = {
  states: { ... },
  mutations: { ... },
  actions: { ... },
  modules: { ... }
}

const bucket = createBucket({
  modules: {
    // register modules
    moduleA,
    moduleB
  }
});

bucket.state.moduleA // `moduleA`'s state
bucket.state.moduleB // `moduleB`'s state
```

**every modules also can have their own states, mutations, actions or even modules**

## how to access module states

all modules will be installed under the root module. so by accessing the root state you can also have access to its children. like this:

```javascript
methods: {
   click() {

     this.$bucket.state.moduleA.name // `moduleA`'s name state
     this.$bucket.state.moduleB.id // `moduleB`'s id state

     // ...
   }
 }
```

## how to access module getters

if you remember we used bracket notation to access getters, you can access your module's getter by defining its path. like this:

```javascript
methods: {
   click() {

     this.$bucket.getters["moduleA/get_id"]; // `moduleA`'s getter
     this.$bucket.getters["moduleB/get_name]; // `moduleB`'s name state

     // you can go deep as many levels as you want
     this.$bucket.getters["moduleA/moduleB/moduleC/moduleH/...];


     // ...
   }
 }
```

they above code represent something like this:

-root

-----moduleA

-----moduleB

## how to access module mutations

mutations are like getters, you can access your module's mutation by defining its path. like this:

```javascript
methods: {
   click() {

     this.$bucket.commit("moduleA/set_id"); // we can access mutations by commit()
     this.$bucket.commit("moduleB/set_name); // we can access mutations by commit()

     // ...
   }
 }
```

## how to access module actions

actions are like getters, you can access your module's actions by defining its path. like this:

```javascript
methods: {
   click() {

     this.$bucket.dispatch("moduleA/set_id"); // we can access mutations by dispatch()
     this.$bucket.dispatch("moduleB/set_name); // we can access mutations by dispatch()

     // ...
   }
 }
```

sometimes you need to access another module's mutation or action within the current module

since the context parameter refer to the root module, you can access all of your modules by defining their path. like this:

```javascript
// inside module a
const moduleA = {
  actions: {
    commitModuleB(context) {
      context.commit("moduleB/set_name"); // commiting in module b from module a
    }
    dispatchModuleB(context) {
      context.dispatch("moduleB/request"); // dispatching in module b from module a
    }

    dispatchRoot(context) {
      context.dispatch("rootMutation") //  dispatching in root from module a
    }
  }
};

```

**NOTE:** if you want to access a module from another module like example, you need to define your paths from root

## plugins

v-bucket store accept the plugins option that exposes hooks for each mutation and actions. plugins will allow you to extend the functionality of v-bucket

a hello world plugin

```javascript
const helloWorld = () => {
    // called when the store is initialized
    console.log("hello world");
    return bucket => {
        // access bucket store
    };
};

export const bucket = createBucket({
    // other options
    // ...
    plugins: [helloWorld()]
});
```

the function that has the responsibility to be a plugin, need to return another function.
v-bucket will use that function to expose the root module and its hooks


## plugin hooks

there are two hooks available:

#### bucket.onMutation(callback(mutation))

this function will be called after every mutation.
also, it will return information about the mutation that has been fired.

this information contains: name, module and full path of that mutation.

#### bucket.onAction(callback(action))

this function will be called after every action.
also, it will return information about the action that has been fired.

this information contains: name, module and full path of that action.

**usage:**

```javascript
const myPlugin = socket => {
    return bucket => {
        socket.on("data", data => {
            store.commit("receiveData", data);
        });
        store.onMutation(mutation => {
            if ((mutation.name = "UPDATE_DATA")) {
                socket.emit("update", mutation.payload);
            }
        });
    };
};
```

if you want use Class syntaxt, no worries! do something like this:

```javascript
Class Snapshot {
  // other methods and options
  // ...
  constructor() {
    this.snapshots = [];
  }

  plugin() {
    return bucket => {
      bucket.onMutation(mutation => {
        if (mutation.name = "UPDATE_SNAPSHOT") {
          this.snapshots.push(mutation.payload);
        }
      })
    }
  }
}
```

easy right?

and use it like this in your store:

```javascript
export const bucket = createBucket({
    // other options
    // ...
    plugins: [new Snapshot().plugin()]
});
```

Since you have access to the bucket root module in the plugins, you also able to commit, dispatch and use getters.

## Contribution

Please make sure to read the [Contributing Guide](https://github.com/mediv0/v-bucket/blob/master/.github/contributing.md) before making a pull request.

**feel free to request new features!**

## License

[MIT](http://opensource.org/licenses/MIT)

## Todo

-   [ ] mapGetters
-   [ ] mapActions
-   [ ] optimization and refactoring
-   and more....
