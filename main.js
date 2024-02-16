import { Resource } from "/modules/resource.js";

window.addEventListener('load', function() {
    g.init();
})

window.g = {
    // Resources
    r: {},
    // Cached elements
    e: {},

    init: function() {
        this.r.Spheres = new Resource("Spheres");

        g.cacheElements("TheSphere");
        g.e.TheSphere.addEventListener("click", function() {
            g.r.Spheres.value++;
        })
    },

    updateSpheres: function() {
        g.e.SphereCount.innerHTML = g.spheres;
    },

    // Tools
    cacheElements: function(...names) {
        for (const name of names) {
            g.e[name] = document.getElementById(name);
        }
    },

};
