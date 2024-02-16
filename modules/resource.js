export { Resource };

class Resource {
    #value = 0;

    constructor(name) {
        this.root = document.getElementById(name);
        this.count = this.root.getElementsByClassName("count")[0];
    }

    set value(v) {
        this.#value = v;
        this.count.innerHTML = v;
    }
    get value() { return this.#value; }
}