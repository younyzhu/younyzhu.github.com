/**
 * Created by Yongnanzhu on 7/16/2014.
 * WindowResize modified from THREEx.WindowResize
 */
WindowResize	= function(canvas){
	var callback	= function(){

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
	};
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
};
