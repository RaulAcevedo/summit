/* AutoSurface.js */

define(function(require, exports, module) {

    var Surface = require('famous/core/Surface');
    var Entity = require('famous/core/Entity');

    function AutoSurface(options) {
        Surface.apply(this, arguments);
        this.trueHeight = 0;
        this._superCommit = Surface.prototype.commit;
    }

    AutoSurface.prototype = Object.create(Surface.prototype);

    AutoSurface.prototype.constructor = AutoSurface;

    AutoSurface.prototype.calculateHeight = function calculateHeight(domElement){
                                                return 0;
                                            };

    AutoSurface.prototype.notifyHeightChange = function notifyHeightChange(newHeight){
                                            };

    AutoSurface.prototype.commit = function commit(context) {
        this._superCommit(context);
        this.invalidate();
    }

    AutoSurface.prototype.invalidate = function invalidate() {
        var contentHeight  = this.calculateHeight(Entity.get(this.id)._currentTarget);
        if (this.trueHeight != contentHeight) {
            this.trueHeight = contentHeight;
            this.setSize([undefined,this.trueHeight]);
            this.notifyHeightChange(this.trueHeight);
        }
    }

    module.exports = AutoSurface;
});