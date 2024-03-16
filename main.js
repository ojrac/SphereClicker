import { GeneratorResource, Resource } from "./modules/resource.js";
import { svgAnimate, svgAnimateNow, svgNode } from "./modules/util.js";

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
        g.cacheElements("GridSvg");
        g.cacheElements("SvgContainer");
        g.cacheElements("AnimatedMask");
        g.cacheElements("AnimatedMaskCircle");
        g.e.TheSphere.addEventListener("click", function() {
            g.r.Sphere.value++;
        });

        g.prepareSphereGrid();

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

    // Misc
    prepareSphereGrid: function() {
        const fromPoints = this.pointsAroundCircle(5, 102, 102, 62);
        for (var i = 0; i < 5; i++)
        {
            const pt = fromPoints[i];

            const sphereNode = svgNode("circle", {
                r: 29,
                fill: "#ccc",
                stroke: "#222",
                mask: "url(#mask)",
                cx: pt.x,
                cy: pt.y,
            });
            g.e.SvgContainer.appendChild(sphereNode);
            g.e["Sphere" + i] = sphereNode;

            // Temporary closure, shrug
            (function(idx) {
                sphereNode.addEventListener("click", function() {
                    g.animateSphereGrid(idx);
                });
            })(i);
        }
    },

    animateSphereGrid: function(clickedIndex) {
        var elements = g.e.SvgContainer.querySelectorAll("animate");
        for (const el of elements) {
            el.parentNode.removeChild(el);
        }

        const fromPoints = this.pointsAroundCircle(5, 102, 102, 62);
        const scaleUpMultiplier = 2.488 * 2;

        const oldCircleCenter = fromPoints[clickedIndex];

        const oldCircleToCenter = {
            x: 102 - oldCircleCenter.x,
            y: 102 - oldCircleCenter.y,
        };
        const newCircleToCenter = {
            x: oldCircleToCenter.x * scaleUpMultiplier,
            y: oldCircleToCenter.y * scaleUpMultiplier,
        };

        const newCenter = {
            x: 102 + newCircleToCenter.x,
            y: 102 + newCircleToCenter.y,
        };

        const newRadius = 62 * scaleUpMultiplier;

        const toPoints = this.pointsAroundCircle(5, newCenter.x, newCenter.y, newRadius);

        var lastAnimations = null;
        for (var i = 0; i < 5; i++)
        {
            const pt = fromPoints[i];
            const toPt = toPoints[i];

            const sphereNode = g.e["Sphere" + i];
            lastAnimations = svgAnimateNow(sphereNode, {
                    cx: `${pt.x};${toPt.x}`,
                    cy: `${pt.y};${toPt.y}`,
                    r: "29;100",
                    "stroke-width": "1;2",
                },
                "0.5s", "indefinite");
            g.e.SvgContainer.appendChild(sphereNode);
        }

        const animations = svgAnimate(g.e.AnimatedMaskCircle, {
            r:"100;0",
        }, "0.333s", "indefinite");
        animations[0].beginElementAt(0.5);
    },

    pointsAroundCircle: function(count, centerX, centerY, radius) {
        // In SVG, y=0 is at the top
        let yOffset = centerY - radius;
        let xOffset = centerX - radius;

        const radiansPerStep = 2 * Math.PI / count;

        var result = [];
        for (var i = 0; i < count; i++)
        {
            const radians = (radiansPerStep * i) + (3 * Math.PI / 2.0);
            result.push({
                x: (Math.cos(radians) + 1) * radius + xOffset,
                y: (Math.sin(radians) + 1) * radius + yOffset,
            });
        }

        return result;
    },

    // Tools
    cacheElements: function(...names) {
        for (const name of names) {
            g.e[name] = document.getElementById(name);
        }
    },

};
