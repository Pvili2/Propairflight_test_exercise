function svgLineCreator(x1, x2, y1, y2, color, strokeWidth) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", strokeWidth);
    line.setAttribute("id", "pitch-indicator-line");

    return line;
}

function svgTextCreator(x, y, textContent) {
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('class', 'text');
    text.textContent = textContent;
    text.setAttribute("fill", "white")

    return text;
}

function svgRectCreator(x, y, width, height, fill) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x)
    rect.setAttribute("y", y)
    rect.setAttribute("width", width)
    rect.setAttribute("height", height)
    rect.setAttribute("stroke", "white")
    rect.setAttribute("stroke-width", "5")

    return rect;
}

function createPitchIndicatorYellowLine(svg, x1, x2, y1, y2, vx1, vx2, vy1, vy2) {
    const horizontalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    horizontalLine.setAttribute("x1", x1);
    horizontalLine.setAttribute("y1", y1);
    horizontalLine.setAttribute("x2", x2);
    horizontalLine.setAttribute("y2", y2);
    horizontalLine.setAttribute("stroke", "yellow");
    horizontalLine.setAttribute("stroke-width", "4");

    const verticalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    verticalLine.setAttribute("x1", vx1);
    verticalLine.setAttribute("y1", vy1);
    verticalLine.setAttribute("x2", vx2);
    verticalLine.setAttribute("y2", vy2);
    verticalLine.setAttribute("stroke", "yellow");
    verticalLine.setAttribute("stroke-width", "4");

    svg.appendChild(horizontalLine);
    svg.appendChild(verticalLine);
}