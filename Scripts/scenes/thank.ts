/**
 * @module scenes
 */
module scenes {
    /**
     * This class is where we say thanks for playing 
     * 
     * @class Thank
     * @extends scenes.Scene
     */
    export class Thank extends scenes.Scene {
        private _blocker: HTMLElement;
        private _stage: createjs.Stage;
        private _winLabel: createjs.Text;
        private _resetButton: createjs.Bitmap;
        private _thank: createjs.Bitmap;

        /**
         * Empty Contructor
         * 
         * @constructor
         */
        constructor() {
            super();

            this._initialize();
            this.start();
        }

        private _setupCanvas(): void {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.style.backgroundColor = "#FFFFFF";
        }

        /**
         * This method sets up default values for class member variables
         * and objects
         * 
         * @method _initialize
         * @return void
         */
        private _initialize(): void {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";

            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
            this._stage
        }


        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {

           this._thank = new createjs.Bitmap(assets.getResult("ThankYou"));
            this._thank.regX = this._thank.getBounds().width * 0.5;
            this._thank.regY = this._thank.getBounds().height * 0.5;
            this._thank.x = config.Screen.WIDTH * 0.5;
            this._thank.y = (config.Screen.HEIGHT * 0.5);
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
        }

        /**
         * The update method updates the animation loop and other objects
         * 
         * @method update
         * @return void
         */
        public update(): void {
            this._stage.update();
        }

        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         * 
         * @method resize
         * @return void
         */
        public resize(): void {
            this._setupCanvas();
        }

    }
}