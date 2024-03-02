export { GeneratorResource, Resource };
    import { num_str, whole_num_str } from "./util.js";

class Resource {
    _num_str = num_str;
    _value = 0;
    _e = {};
    _data = {};
    _events = {};

    constructor(name, data) {
        this._e.root = document.getElementById(name);
        this._e.value = this.getFirstByClass("value");
        this._data = data

        if (name == "Sphere")
        {
            this._num_str = whole_num_str;
        }
    }

    addEventListener(event, handler) {
        this._events[event] ??= [];
        this._events[event].push(handler);
    }
    _onEvent(eventName, ...args) {
        for (const evt of this._events[eventName] ?? []) {
            evt(...args);
        }
    }

    set value(v) {
        if (v == this._value)
        {
            return;
        }
        let previous = this._value;
        this._value = v;
        this._e.value.innerHTML = this._num_str(v);

        this._onEvent("value_change", previous, v);
    }
    get value() { return this._value; }

    // Helpers
    getFirstByClass(className) {
        let elements = this._e.root.getElementsByClassName(className);
        if (elements)
        {
            return elements[0];
        }

        return null;
    }
}

class GeneratorResource extends Resource {
    _rate = 0;
    set rate(v) {
        this._rate = v;
        this._e.rate.innerHTML = num_str(v);
    }
    get rate() { return this._rate; }

    get cost() {
        return Math.ceil(this._data.cost * ((this._value * (this._data.cost_scale ?? 1)) + 1));
    }

    refreshBuyButton(currentSpheres) {
        this._e.buy.disabled = this.cost > currentSpheres;
    }

    constructor(name, data) {
        super(name, data);

        this._e.buy = this.getFirstByClass("buy");
        this._e.cost = this.getFirstByClass("cost");
        this._e.rate = this.getFirstByClass("rate");

        this._e.cost.innerHTML = this.cost;
        this._e.rate.innerHTML = this.rate;

        let self = this;
        this._e.buy.addEventListener("click", function() {
            let cost = self.cost;
            if (!g.spend(cost))
            {
                return;
            }

            self.value++;
            self.rate = self._data.rate * self.value / 10;
            self._e.cost.innerHTML = self.cost;
        });
    }
}