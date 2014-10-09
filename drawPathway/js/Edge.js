/**
 * Created by Yongnan on 7/15/2014.
 */
function Edge(id, source, target, data) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.data = (data !== undefined) ? data : {};

    // Edge data field used by layout alorithm
    // this.data.length
    // this.data.type
}
