/**
 * Created by Yongnan on 7/15/2014.
 */
function SpringY(params) {
        var graph = this.graph = params.graph || new Springy.Graph();
        var nodeFont = "10px Verdana, sans-serif";
        //var edgeFont = "8px Verdana, sans-serif";   //no edge font
        var stiffness = params.stiffness || 400.0;
        var repulsion = params.repulsion || 400.0;
        var damping = params.damping || 0.5;
        var edgeLabelsUpright = true;

        var compartmentX = params.boundingX;
        var compartmentY = params.boundingY;
        var compartmentWidth = params.boundingW;
        var compartmentHeight = params.boundingH;

        var canvas = params.canvas;
        var ctx = canvas.getContext("2d");

        var layout = this.layout = new Springy.Layout.ForceDirected(graph, stiffness, repulsion, damping);
        // calculate bounding box of graph layout.. with ease-in
        var currentBB = layout.getBoundingBox();
        var targetBB = {bottomleft: new Springy.Vector(-1, -1), topright: new Springy.Vector(1, 1)};

        // auto adjusting bounding box
        Springy.requestAnimationFrame(function adjust() {
            targetBB = layout.getBoundingBox();
            // current gets 20% closer to target every iteration
            currentBB = {
                bottomleft: currentBB.bottomleft.add( targetBB.bottomleft.subtract(currentBB.bottomleft)
                    .divide(10)),
                topright: currentBB.topright.add( targetBB.topright.subtract(currentBB.topright)
                    .divide(10))
            };

            Springy.requestAnimationFrame(adjust);
        });

        // convert to/from screen coordinates
        var toScreen = function(p) {
            var size = currentBB.topright.subtract(currentBB.bottomleft);
            //var sx = p.subtract(currentBB.bottomleft).divide(size.x).x * canvas.width;
            //var sy = p.subtract(currentBB.bottomleft).divide(size.y).y * canvas.height;
            var sx = p.subtract(currentBB.bottomleft).divide(size.x).x * compartmentWidth  +compartmentX;
            var sy = p.subtract(currentBB.bottomleft).divide(size.y).y * compartmentHeight +compartmentY;
            return new Springy.Vector(sx, sy);
        };

        var getTextWidth = function(node) {
            var text = (node.data.label !== undefined) ? node.data.label : node.id;
            if (node._width && node._width[text])
                return node._width[text];

            ctx.save();
            ctx.font = (node.data.font !== undefined) ? node.data.font : nodeFont;
            var width = ctx.measureText(text).width;
            ctx.restore();

            node._width || (node._width = {});
            node._width[text] = width;

            return width;
        };

        var getTextHeight = function(node) {
            return 10;
            // In a more modular world, this would actually read the font size, but I think leaving it a constant is sufficient for now.
            // If you change the font size, I'd adjust this too.
        };

        var getImageWidth = function(node) {
            var width = (node.data.image.width !== undefined) ? node.data.image.width : nodeImages[node.data.image.src].object.width;
            return width;
        };

        var getImageHeight = function(node) {
            var height = (node.data.image.height !== undefined) ? node.data.image.height : nodeImages[node.data.image.src].object.height;
            return height;
        };

        Springy.Node.prototype.getHeight = function() {
            var height;
            if (this.data.image == undefined) {
                height = getTextHeight(this);
            } else {
                if (this.data.image.src in nodeImages && nodeImages[this.data.image.src].loaded) {
                    height = getImageHeight(this);
                } else {height = 10;}
            }
            return height;
        };

        Springy.Node.prototype.getWidth = function() {
            var width;
            if (this.data.image == undefined) {
                width = getTextWidth(this);
            } else {
                if (this.data.image.src in nodeImages && nodeImages[this.data.image.src].loaded) {
                    width = getImageWidth(this);
                } else {width = 10;}
            }
            return width;
        };

        var renderer = this.renderer = new Springy.Renderer(layout,
            function clear() {
                ctx.clearRect(0,0,canvas.width,canvas.height);
            },
            function drawEdge(edge, p1, p2) {
                var x1 = toScreen(p1).x;
                var y1 = toScreen(p1).y;
                var x2 = toScreen(p2).x;
                var y2 = toScreen(p2).y;

                var direction = new Springy.Vector(x2-x1, y2-y1);
                var normal = direction.normal().normalise();

                var from = graph.getEdges(edge.source, edge.target);
                var to = graph.getEdges(edge.target, edge.source);

                var total = from.length + to.length;

                // Figure out edge's position in relation to other edges between the same nodes
                var n = 0;
                for (var i=0; i<from.length; i++) {
                    if (from[i].id === edge.id) {
                        n = i;
                    }
                }

                //change default to  10.0 to allow text fit between edges
                var spacing = 12.0;

                // Figure out how far off center the line should be drawn
                var offset = normal.multiply(-((total - 1) * spacing)/2.0 + (n * spacing));

                var paddingX = 6;
                var paddingY = 6;

                var s1 = toScreen(p1).add(offset);
                var s2 = toScreen(p2).add(offset);

                var boxWidth = edge.target.getWidth() + paddingX;
                var boxHeight = edge.target.getHeight() + paddingY;

                var intersection = intersect_line_box(s1, s2, {x: x2-boxWidth/2.0, y: y2-boxHeight/2.0}, boxWidth, boxHeight);

                if (!intersection) {
                    intersection = s2;
                }

                var stroke = (edge.data.color !== undefined) ? edge.data.color : '#000000';

                var arrowWidth;
                var arrowLength;

                var weight = (edge.data.weight !== undefined) ? edge.data.weight : 1.0;

                ctx.lineWidth = Math.max(weight *  2, 0.1);
                arrowWidth = 1 + ctx.lineWidth;
                arrowLength = 8;

                var directional = (edge.data.directional !== undefined) ? edge.data.directional : true;

                // line
                var lineEnd;
                if (directional) {
                    lineEnd = intersection.subtract(direction.normalise().multiply(arrowLength * 0.5));
                } else {
                    lineEnd = s2;
                }

                ctx.strokeStyle = stroke;
                ctx.beginPath();
                ctx.moveTo(s1.x, s1.y);
                ctx.lineTo(lineEnd.x, lineEnd.y);
                ctx.stroke();

                // arrow
                if (directional) {
                    ctx.save();
                    ctx.fillStyle = stroke;
                    ctx.translate(intersection.x, intersection.y);
                    ctx.rotate(Math.atan2(y2 - y1, x2 - x1));
                    ctx.beginPath();
                    ctx.moveTo(-arrowLength, arrowWidth);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(-arrowLength, -arrowWidth);
                    ctx.lineTo(-arrowLength * 0.8, -0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }

                // label
                if (edge.data.label !== undefined) {
                    text = edge.data.label;
                    ctx.save();
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";
                    ctx.font = (edge.data.font !== undefined) ? edge.data.font : edgeFont;
                    ctx.fillStyle = stroke;
                    var angle = Math.atan2(s2.y - s1.y, s2.x - s1.x);
                    var displacement = -8;
                    if (edgeLabelsUpright && (angle > Math.PI/2 || angle < -Math.PI/2)) {
                        displacement = 8;
                        angle += Math.PI;
                    }
                    var textPos = s1.add(s2).divide(2).add(normal.multiply(displacement));
                    ctx.translate(textPos.x, textPos.y);
                    ctx.rotate(angle);
                    ctx.fillText(text, 0,-2);
                    ctx.restore();
                }

            },

            function drawNode(node, p) {
                var s = toScreen(p);

                ctx.save();

                // Pulled out the padding aspect sso that the size functions could be used in multiple places
                // These should probably be settable by the user (and scoped higher) but this suffices for now
                var paddingX = 6;
                var paddingY = 6;

                var contentWidth = node.getWidth();
                var contentHeight = node.getHeight();
                var boxWidth = contentWidth + paddingX;
                var boxHeight = contentHeight + paddingY;

                // clear background
                ctx.clearRect(s.x - boxWidth/2, s.y - boxHeight/2, boxWidth, boxHeight);

                // fill background     //No deed to select node in Force drect

                ctx.fillStyle = "#FFFFFF";

                ctx.fillRect(s.x - boxWidth/2, s.y - boxHeight/2, boxWidth, boxHeight);

                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.font = (node.data.font !== undefined) ? node.data.font : nodeFont;
                ctx.fillStyle = "#000000";
                var text = (node.data.label !== undefined) ? node.data.label : node.id;
                ctx.fillText(text, s.x - contentWidth/2, s.y - contentHeight/2);
                ctx.restore();
            }
        );

        renderer.start();

        // helpers for figuring out where to draw arrows
        function intersect_line_line(p1, p2, p3, p4) {
            var denom = ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));

            // lines are parallel
            if (denom === 0) {
                return false;
            }

            var ua = ((p4.x - p3.x)*(p1.y - p3.y) - (p4.y - p3.y)*(p1.x - p3.x)) / denom;
            var ub = ((p2.x - p1.x)*(p1.y - p3.y) - (p2.y - p1.y)*(p1.x - p3.x)) / denom;

            if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
                return false;
            }

            return new Springy.Vector(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
        }

        function intersect_line_box(p1, p2, p3, w, h) {
            var tl = {x: p3.x, y: p3.y};
            var tr = {x: p3.x + w, y: p3.y};
            var bl = {x: p3.x, y: p3.y + h};
            var br = {x: p3.x + w, y: p3.y + h};

            var result;
            if (result = intersect_line_line(p1, p2, tl, tr)) { return result; } // top
            if (result = intersect_line_line(p1, p2, tr, br)) { return result; } // right
            if (result = intersect_line_line(p1, p2, br, bl)) { return result; } // bottom
            if (result = intersect_line_line(p1, p2, bl, tl)) { return result; } // left

            return false;
        }

        return this;
    }


