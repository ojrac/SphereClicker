import { GeneratorResource, Resource } from "./modules/resource.js";

window.addEventListener('load', function() {
    g.init();
})

window.data = {
    generators: {
        HolePunch: {
            cost: 10,
            cost_scale: 0.7,
            rate: 5,
        },
        MelonBaller: {
            cost: 100,
            rate: 75,
        },
    }
};

window.g = {
    // Resources
    r: {},
    generators: [],
    // Cached elements
    e: [],

    init: function() {
        let self = this;
        this.r.Sphere = new Resource("Sphere");
        for (const [key, genData] of Object.entries(data.generators)) {
            let gen = new GeneratorResource(key, genData);
            self.r[key] = gen;
            self.generators.push(gen);
        }

        g.cacheElements("TheSphere");
        g.e.TheSphere.addEventListener("click", function() {
            g.r.Sphere.value++;
        });

        g.tick();
    },

    tick: function() {
        var spheres = g.r.Sphere.value;
        for (const gen of g.generators) {
            spheres += gen.rate / 10;
        }
        g.r.Sphere.value = spheres;

        for (const gen of g.generators) {
            gen.refreshBuyButton(spheres);
        }

        setTimeout(g.tick, 100);
    },

    spend: function(amount, resource = "Sphere") {
        let res = this.r[resource];
        if (res.value < amount)
        {
            return false;
        }

        res.value -= amount;
        return true;
    },

    // Tools
    cacheElements: function(...names) {
        for (const name of names) {
            g.e[name] = document.getElementById(name);
        }
    },

};
