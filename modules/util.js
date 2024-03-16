export { num_str, svgAnimate, svgAnimateNow, svgNode, whole_num_str };

function num_str(num) {
    return Math.round(num * 100) / 100;
}

function whole_num_str(num) {
    return Math.floor(num);
}

function svgNode(name, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const [name, value] of Object.entries(attrs))
    {
        el.setAttributeNS(null, name, value);

    }
    return el;
}

function svgAnimate(node, animations, duration, repeatCount, delay) {
    const results = [];
    for (const [attribute, values] of Object.entries(animations))
    {
        const attrs = {
            attributeName: attribute,
            values: values,
            dur: duration,
        };
        if (repeatCount > 0) {
            attrs["repeatCount"] = repeatCount;
        }
        if (delay) {
            attrs["begin"] = delay;
        }
        const result = svgNode("animate", attrs)
        node.appendChild(result);
        results.push(result);
    }

    return results;
}

function svgAnimateNow(node, animations, duration, delay) {
    const results = svgAnimate(node, animations, duration, 0, delay);
    for (const node of results) {
        node.beginElement();
    }
    return results;
}