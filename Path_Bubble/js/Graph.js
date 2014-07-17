/**
 * Created by Yongnan on 7/15/2014.
 */
function Graph() {
    this.nodeSet = {};
    this.nodes = [];
    this.edges = [];
    this.adjacency = {};

    this.nextNodeId = 0;
    this.nextEdgeId = 0;
    this.eventListeners = [];

    // Array.forEach implementation for IE support..
    //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
    if ( !Array.prototype.forEach ) {
        Array.prototype.forEach = function( callback, thisArg ) {
            var T, k;
            if ( this == null ) {
                throw new TypeError( " this is null or not defined" );
            }
            var O = Object(this);
            var len = O.length >>> 0; // Hack to convert O.length to a UInt32
            if ( {}.toString.call(callback) != "[object Function]" ) {
                throw new TypeError( callback + " is not a function" );
            }
            if ( thisArg ) {
                T = thisArg;
            }
            k = 0;
            while( k < len ) {
                var kValue;
                if ( k in O ) {
                    kValue = O[ k ];
                    callback.call( T, kValue, k, O );
                }
                k++;
            }
        };
    }
}
Graph.prototype = {
    setBoundingCB: function(boundingX,boundingY,boundingW,boundingH){
        this.boundingX = boundingX;
        this.boundingY=boundingY;
        this.boundingW=boundingW;
        this.boundingH=boundingH;
    },
    addNode: function (node) {
        if (!(node.id in this.nodeSet)) {
            this.nodes.push(node);
        }
        this.nodeSet[node.id] = node;

        this.notify();
        return node;
    },
    addNodes: function () {
        // accepts variable number of arguments, where each argument
        // is a string that becomes both node identifier and label
        for (var i = 0; i < arguments.length; i++) {
            var node = new Node(arguments[i].name, arguments[i] );
            this.addNode(node);
        }
    },
    addEachNode:function(nodeId, object)
    {
        var node = new Node(nodeId, object );
        this.addNode(node);
    },
    addEdge: function (edge) {
        var exists = false;
        this.edges.forEach(function (e) {
            if (edge.id === e.id) {
                exists = true;
            }
        });

        if (!exists) {
            this.edges.push(edge);
        }

        if (!(edge.source.id in this.adjacency)) {
            this.adjacency[edge.source.id] = {};
        }
        if (!(edge.target.id in this.adjacency[edge.source.id])) {
            this.adjacency[edge.source.id][edge.target.id] = [];
        }

        exists = false;
        this.adjacency[edge.source.id][edge.target.id].forEach(function (e) {
            if (edge.id === e.id) {
                exists = true;
            }
        });

        if (!exists) {
            this.adjacency[edge.source.id][edge.target.id].push(edge);
        }

        this.notify();
        return edge;
    },
    addEachLink: function(beginId, endId){
        var node1 = this.nodes[beginId];
        if (node1 == undefined) {
            throw new TypeError("invalid node: " + beginId);
        }
        var node2 = this.nodes[endId];
        if (node2 == undefined) {
            throw new TypeError("invalid node: " + endId);
        }
        this.newEdge(node1, node2);
    },
    addLinks: function () {
        // accepts variable number of arguments, where each argument
        // is a triple [nodeid1, nodeid2, attributes]
        for (var i = 0; i < arguments.length; i++) {
            var e = arguments[i];
            var node1 = this.nodes[e.source.name];
            if (node1 == undefined) {
                throw new TypeError("invalid node: " + e.source);
            }
            var node2 = this.nodes[e.target.name];
            if (node2 == undefined) {
                throw new TypeError("invalid node: " + e.target);
            }
            //var attr = e[2];

            this.newEdge(node1, node2);
        }
    },
    addEdges: function () {
        // accepts variable number of arguments, where each argument
        // is a triple [nodeid1, nodeid2, attributes]
        for (var i = 0; i < arguments.length; i++) {
            var e = arguments[i];
            var node1 = this.nodeSet[e[0]];
            if (node1 == undefined) {
                throw new TypeError("invalid node name: " + e[0]);
            }
            var node2 = this.nodeSet[e[1]];
            if (node2 == undefined) {
                throw new TypeError("invalid node name: " + e[1]);
            }
            var attr = e[2];

            this.newEdge(node1, node2, attr);
        }
    },
    newNode: function (data) {
        var node = new Node(this.nextNodeId++, data);
        this.addNode(node);
        return node;
    },
    newEdge: function (source, target, data) {
        var edge = new Edge(this.nextEdgeId++, source, target, data);
        this.addEdge(edge);
        return edge;
    },
    loadJSON: function (json) {
        /**
         Springy's simple JSON format for graphs.

         historically, Springy uses separate lists
         of nodes and edges:

         {
             "nodes": [
                 "center",
                 "left",
                 "right",
                 "up",
                 "satellite"
             ],
             "edges": [
                 ["center", "left"],
                 ["center", "right"],
                 ["center", "up"]
             ]
         }

         **/
        // parse if a string is passed (EC5+ browsers)
        if (typeof json == 'string' || json instanceof String) {
            json = JSON.parse(json);
        }

        if ('nodes' in json || 'edges' in json || 'links' in json) {
            this.addNodes.apply(this, json['nodes']);
            //this.addEdges.apply(this, json['edges']);
            this.addLinks.apply(this, json['links']);
        }
    },


// find the edges from node1 to node2
    getEdges: function (node1, node2) {
        if (node1.id in this.adjacency
            && node2.id in this.adjacency[node1.id]) {
            return this.adjacency[node1.id][node2.id];
        }

        return [];
    },

// remove a node and it's associated edges from the graph
    removeNode: function (node) {
        if (node.id in this.nodeSet) {
            delete this.nodeSet[node.id];
        }

        for (var i = this.nodes.length - 1; i >= 0; i--) {
            if (this.nodes[i].id === node.id) {
                this.nodes.splice(i, 1);
            }
        }

        this.detachNode(node);
    },

// removes edges associated with a given node
    detachNode: function (node) {
        var tmpEdges = this.edges.slice();
        tmpEdges.forEach(function (e) {
            if (e.source.id === node.id || e.target.id === node.id) {
                this.removeEdge(e);
            }
        }, this);

        this.notify();
    },

// remove a node and it's associated edges from the graph
    removeEdge: function (edge) {
        for (var i = this.edges.length - 1; i >= 0; i--) {
            if (this.edges[i].id === edge.id) {
                this.edges.splice(i, 1);
            }
        }

        for (var x in this.adjacency) {
            for (var y in this.adjacency[x]) {
                var edges = this.adjacency[x][y];

                for (var j = edges.length - 1; j >= 0; j--) {
                    if (this.adjacency[x][y][j].id === edge.id) {
                        this.adjacency[x][y].splice(j, 1);
                    }
                }

                // Clean up empty edge arrays
                if (this.adjacency[x][y].length == 0) {
                    delete this.adjacency[x][y];
                }
            }

            // Clean up empty objects
            if (isEmpty(this.adjacency[x])) {
                delete this.adjacency[x];
            }
        }
        function isEmpty(obj) {
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
        this.notify();
    },

    /* Merge a list of nodes and edges into the current graph. eg.
     var o = {
     nodes: [
     {id: 123, data: {type: 'user', userid: 123, displayname: 'aaa'}},
     {id: 234, data: {type: 'user', userid: 234, displayname: 'bbb'}}
     ],
     edges: [
     {from: 0, to: 1, type: 'submitted_design', directed: true, data: {weight: }}
     ]
     }
     */
    merge: function (data) {
        var nodes = [];
        data.nodes.forEach(function (n) {
            nodes.push(this.addNode(new Node(n.id, n.data)));
        }, this);

        data.edges.forEach(function (e) {
            var from = nodes[e.from];
            var to = nodes[e.to];

            var id = (e.directed)
                ? (id = e.type + "-" + from.id + "-" + to.id)
                : (from.id < to.id) // normalise id for non-directed edges
                ? e.type + "-" + from.id + "-" + to.id
                : e.type + "-" + to.id + "-" + from.id;

            var edge = this.addEdge(new Edge(id, from, to, e.data));
            edge.data.type = e.type;
        }, this);
    },

    filterNodes: function (fn) {
        var tmpNodes = this.nodes.slice();
        tmpNodes.forEach(function (n) {
            if (!fn(n)) {
                this.removeNode(n);
            }
        }, this);
    },
    filterEdges: function (fn) {
        var tmpEdges = this.edges.slice();
        tmpEdges.forEach(function (e) {
            if (!fn(e)) {
                this.removeEdge(e);
            }
        }, this);
    },
      addGraphListener: function (obj) {
        this.eventListeners.push(obj);
    },
    notify: function () {
        this.eventListeners.forEach(function (obj) {
            obj.graphChanged();
        });
    }

};

