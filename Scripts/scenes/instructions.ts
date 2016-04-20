/**
 * @module scenes
 */
module scenes {
    /**
     * This class expalins the instructions of the game
     * 
     * @class Instructions
     * @extends scenes.Scene
     */
    export class Instructions extends scenes.Scene {
        private _blocker: HTMLElement;
        private _stage: createjs.Stage;
        private _gameOverLabel: createjs.Text;
        private _restartButton: createjs.Bitmap;
        private _bg: createjs.Bitmap;
        private _instructions: createjs.Bitmap;

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
            canvas.style.backgroundColor = "#ffffff";
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
        }


        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {
            
            
            
            this._bg = new createjs.Bitmap(assets.getResult("bg"));
            this._bg.scaleX = 1;
            this._bg.scaleY = 1;
            this._stage.addChild(this._bg);
            
            this._instructions = new createjs.Bitmap(assets.getResult("Instuctions"));
            this._instructions.regX = this._instructions.getBounds().width * 0.5;
            this._instructions.regY = this._instructions.getBounds().height * 0.5;
            this._instructions.x = config.Screen.WIDTH * 0.5;
            this._instructions.y = (config.Screen.HEIGHT * 0.5);
            this._stage.addChild(this._instructions);

            this._restartButton = new createjs.Bitmap(assets.getResult("BackButton"));
            this._restartButton.regX = this._restartButton.getBounds().width * 0.5;
            this._restartButton.regY = this._restartButton.getBounds().height * 0.5;
            this._restartButton.x = config.Screen.WIDTH * 0.5;
            this._restartButton.y = (config.Screen.HEIGHT * 0.5) + 200;
            this._stage.addChild(this._restartButton);

            this._restartButton.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });

            this._restartButton.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });

            this._restartButton.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.MENU;
                changeScene();
            });
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