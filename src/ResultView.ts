class ResultView extends egret.DisplayObjectContainer
{
    public constructor()
    {
        super();
    }

    protected onAddToStageHandler(): void
    {
        this.showResult();
    }

    protected onUICompleteHandler(): void
    {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
    }

    private touchHandler(e: egret.TouchEvent): void
    {
        // this.stage.stage.removeChild(GameView)
    }

    private showResult(): void
    {
        let rect = new eui.Rect();

        rect.alpha = 0.4;

        rect.width = this.width;
        rect.height = this.height;

        rect.x = 0;
        rect.y = 0;

        this.addChild(rect);

        let result: eui.Label = new eui.Label();

        result.verticalCenter = 0;
        result.horizontalCenter = 0;

        if(DataModel.getInstance().result)
        {
            result.text = `恭喜你，通关成功！`;
        }
        else
        {
            result.text = `很可惜，通关失败！`;
        }

        result.textColor = 0x000000;

        this.addChildAt(result, 99);
    }

}