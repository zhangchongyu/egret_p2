namespace manager
{
    /**
     * 简单层级管理
     */
    export class LayerManager
    {
        public constructor()
        {

        }

        private static _instance: LayerManager;

        /**
         * LayerManager实例
         */
        public static getInstance(): LayerManager
        {
            if(LayerManager._instance == null)
            {
                LayerManager._instance = new LayerManager();
            }

            return LayerManager._instance;
        }

        private baseLayer: egret.DisplayObjectContainer;

        private modelLayer: egret.DisplayObjectContainer;

        /**
         * 初始化
         */
        public init(parent: egret.DisplayObjectContainer)
        {
            let stage = parent.stage;

            this.baseLayer = new eui.Group();
            this.baseLayer.touchEnabled = false;

            this.modelLayer = new eui.Group();
            this.modelLayer.touchEnabled = false;

            this.resizeHandler(stage.stageWidth, stage.stageHeight);

            stage.addChild(this.baseLayer);
            stage.addChild(this.modelLayer);

            stage.addEventListener(egret.Event.RESIZE, this.resizeStage, this);
        }

        /**
         * 舞台尺寸重置
         */
        private resizeStage(e: egret.Event): void
        {
            let stage: egret.Stage = e.currentTarget;

            this.resizeHandler(stage.stageWidth, stage.stageHeight);

            // this.resizeClass(stage.stageWidth, stage.stageHeight);
        }

        /**
         * 匹配图层大小
         */
        private resizeHandler(stageWidth: number, stageHeight: number)
        {
            this.baseLayer.width = stageWidth;
            this.baseLayer.height = stageHeight;

            this.modelLayer.width = stageWidth;
            this.modelLayer.height = stageHeight;
        }
        
        private resizeClass(stageWidth: number, stageHeight: number): void
        {
            for(let item in this.classDict)
            {
                this.classDict[item].width = stageWidth;
                this.classDict[item].height = stageHeight;
            }
        }

        /**
         * 限定类名字典
         */
        private classDict = {};

        /**
         * 添加到舞台
         */
        public addChildWithClass(clazz: any): void
        {
            let className: string = egret.getQualifiedClassName(clazz);

            console.log(`className:${className}`);

            let object: any = this.classDict[className];

            if(object == null)
            {
                object = new clazz();

                // object.width = this.baseLayer.width;
                // object.height = this.baseLayer.height;

                this.classDict[className] = object;
            }

            this.baseLayer.addChild(object);
        }

        /**
         * 移出舞台
         */
        public removeChildWithClass(clazz: any): void
        {
            let className = egret.getQualifiedClassName(clazz);

            if(clazz.parent != null)
            {
                clazz.parent.removeChild(clazz);
            }

            delete this.classDict[className];
        }
    }
}