export class NoOptionException extends Error {
    constructor(message) {
        super(message);
        this.name = "NoOptionException";
    }
}

export class InvalidModulePath extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidModulePath";
    }
}

export class ModuleNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = "ModuleNotFound";
    }
}

export class InvalidCommitException extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidCommitException";
    }
}

export class InvalidDispatchException extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidDispatchException";
    }
}

export class InvalidGetterException extends Error {
    constructor(message, namespace) {
        super(message);
        this.name = "InvalidGetterException";
        this._namespace = namespace;
    }

    static get namespace() {
        return this._namespace;
    }

    static set namespace(v) {
        this._namespace = v;
    }
}
