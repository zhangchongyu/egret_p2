class HomeView extends eui.Component
{
    public constructor()
    {
        super();
        this.once(egret.Event.COMPLETE, this.onUICompleteHandler, this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageHandler, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStageHandler, this);
        this.skinName = "HomeSkin";
    }

    public btn_start: eui.Label;

    protected onAddToStageHandler(e: egret.Event): void
    {

    }

    protected onRemoveFromStageHandler(e: egret.Event): void
    {

    }

    protected onUICompleteHandler(e: egret.Event): void
    {
        this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnStartHandler, this);
    }

    private btnStartHandler(e: egret.Event): void
    {
        // let game = new GameView();
        // game.width = this.stage.stageWidth;
        // game.height = this.stage.stageHeight;
        // this.stage.addChild(game);
        GameView.open();
    }

    public static open(): void
    {
        manager.LayerManager.getInstance().addChildWithClass(HomeView);
    }

    public static close(): void
    {
        manager.LayerManager.getInstance().removeChildWithClass(HomeView);
    }
}