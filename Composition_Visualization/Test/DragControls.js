/**
 * Created by Yongnanzhu on 5/25/2014.
 */
ObjectDragControls = function ( camera, object, domElement, plane ) {

    var projector = new THREE.Projector();
    var mouse = new THREE.Vector3();
    var offset = new THREE.Vector3();

    var selected;
    var intersected;

    var _this = this;
    domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    domElement.addEventListener('mouseup', onDocumentMouseUp, false);

    function onDocumentMouseMove(event) {

        event.preventDefault();

        mouse.x = (event.clientX / domElement.width) * 2 - 1;
        mouse.y = -(event.clientY / domElement.height) * 2 + 1;

        var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
        projector.unprojectVector( vector, camera );

        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        if (selected) {
            var intersects = raycaster.intersectObject(plane);
            SELECTED.position.copy(intersects[ 0 ].point.sub(offset));
            return;
        }

        var intersects = raycaster.intersectObjects( objects );

        if (intersects.length > 0) {
            if ( intersected != intersects[ 0 ].object )
            {

                intersected = intersects[ 0 ].object;
                plane.position.copy( intersected.position );
                plane.lookAt( camera.position );

            }
            domElement.style.cursor = 'pointer';

        } else {

            domElement.style.cursor = 'auto';

        }

    }

    function onDocumentMouseDown(event) {

        event.preventDefault();

        mouse.x = (event.clientX / domElement.width) * 2 - 1;
        mouse.y = -(event.clientY / domElement.height) * 2 + 1;

        var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
        projector.unprojectVector( vector, camera );
        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
        var intersects = raycaster.intersectObjects( objects );

        if (intersects.length > 0) {
                                       //Here we could set the controls status
            selected = intersects[0].object; //selected = intersects[0]

            var intersects = raycaster.intersectObject( plane );
            offset.copy( intersects[ 0 ].point ).sub( plane.position );

            domElement.style.cursor = 'move';

        }

        if (_this.onHit)
            _this.onHit(intersects.length > 0);
    }

    function onDocumentMouseUp(event) {

        event.preventDefault();

        if (selected) {

            if (_this.onDragged)
                _this.onDragged();

            plane.position.copy( intersected.position );
            selected = null;
        }

        domElement.style.cursor = 'auto';

    }
}
