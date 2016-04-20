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
     * This class is where we show the win scence
     *
     * @class Win
     * @extends scenes.Scene
     */
    var Win = (function (_super) {
        __extends(Win, _super);
        /**
         * Empty Contructor
         *
         * @constructor
         */
        function Win() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        Win.prototype._setupCanvas = function () {
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
        Win.prototype._initialize = function () {
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
        Win.prototype.start = function () {
            this._wbg = new createjs.Bitmap(assets.getResult("wbd"));
            this._wbg.scaleX = 2;
            this._wbg.scaleY = 2.2;
            this._stage.addChild(this._wbg);
            this._winLabel = new createjs.Text("", "60px Consolas", "#0000cc");
            this._winLabel.text = "CONGRATULATIONS! \n\n\n";
            this._winLabel.text += "You have \n\n finished \n\n successfully!";
            this._winLabel.lineWidth = 550;
            this._winLabel.lineHeight = 22;
            this._winLabel.textBaseline = "top";
            this._winLabel.textAlign = "center";
            //this._winLabel.y = 350;
            this._winLabel.regX = (this._winLabel.getMeasuredWidth() * 0.5);
            this._winLabel.regY = (this._winLabel.getMeasuredLineHeight() * 0.5);
            this._winLabel.x = (config.Screen.WIDTH * 0.5) + 940;
            this._winLabel.y = (config.Screen.HEIGHT * 0.5) - 250;
            this._stage.addChild(this._winLabel);
            this._resetButton = new createjs.Bitmap(assets.getResult("reset"));
            this._resetButton.regX = this._resetButton.getBounds().width * 0.5;
            this._resetButton.regY = this._resetButton.getBounds().height * 0.5;
            this._resetButton.x = config.Screen.WIDTH * 0.5;
            this._resetButton.y = (config.Screen.HEIGHT * 0.5) + 20;
            this._stage.addChild(this._resetButton);
            this._resetButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._resetButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._resetButton.on("click", function (event) {
                currentScene = config.Scene.PLAY;
                changeScene();
            });
        };
        /**
         * The update method updates the animation loop and other objects
         *
         * @method update
         * @return void
         */
        Win.prototype.update = function () {
            this._stage.update();
        };
        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         *
         * @method resize
         * @return void
         */
        Win.prototype.resize = function () {
            this._setupCanvas();
        };
        return Win;
    })(scenes.Scene);
    scenes.Win = Win;
})(scenes || (scenes = {}));

//# sourceMappingURL=win.js.map
