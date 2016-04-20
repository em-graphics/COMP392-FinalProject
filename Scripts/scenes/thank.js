var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @module scenes
 */
var scenes;
(function (scenes) {
    /**
     * This class is where we say thanks for playing
     *
     * @class Thank
     * @extends scenes.Scene
     */
    var Thank = (function (_super) {
        __extends(Thank, _super);
        /**
         * Empty Contructor
         *
         * @constructor
         */
        function Thank() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        Thank.prototype._setupCanvas = function () {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.style.backgroundColor = "#ccccff";
        };
        /**
         * This method sets up default values for class member variables
         * and objects
         *
         * @method _initialize
         * @return void
         */
        Thank.prototype._initialize = function () {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";
            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
            this._stage;
        };
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        Thank.prototype.start = function () {
            this._thank = new createjs.Bitmap(assets.getResult("thank"));
            this._thank.scaleX = 2.2;
            this._thank.scaleY = 2.23;
            this._stage.addChild(this._thank);
            /* this._winLabel = new createjs.Text(
                 "THANK YOU FOR PLAYING",
                 "60px Consolas",
              "#0000cc");   */
            /*     this._winLabel.regX = (this._winLabel.getMeasuredWidth() * 0.5);
                this._winLabel.regY = (this._winLabel.getMeasuredLineHeight() * 0.5);
                this._winLabel.x = (config.Screen.WIDTH * 0.5)+ 10;
                this._winLabel.y = (config.Screen.HEIGHT * 0.5) - 250;
                this._stage.addChild(this._winLabel); */
            /*   this._resetButton = new createjs.Bitmap(assets.getResult("reset"));
               this._resetButton.regX = this._resetButton.getBounds().width * 0.5;
               this._resetButton.regY = this._resetButton.getBounds().height * 0.5;
               this._resetButton.x = config.Screen.WIDTH * 0.5;
               this._resetButton.y = (config.Screen.HEIGHT * 0.5) +20 ;
               this._stage.addChild(this._resetButton);
               
   
               this._resetButton.on("mouseover", (event: createjs.MouseEvent) => {
                   event.target.alpha = 0.7;
               });
   
               this._resetButton.on("mouseout", (event: createjs.MouseEvent) => {
                   event.target.alpha = 1.0;
               });
   
               this._resetButton.on("click", (event: createjs.MouseEvent) => {
                   currentScene = config.Scene.PLAY;
                   changeScene();
               });
               */
        };
        /**
         * The update method updates the animation loop and other objects
         *
         * @method update
         * @return void
         */
        Thank.prototype.update = function () {
            this._stage.update();
        };
        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         *
         * @method resize
         * @return void
         */
        Thank.prototype.resize = function () {
            this._setupCanvas();
        };
        return Thank;
    }(scenes.Scene));
    scenes.Thank = Thank;
})(scenes || (scenes = {}));

//# sourceMappingURL=thank.js.map
