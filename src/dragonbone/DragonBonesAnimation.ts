/**
 * 龙骨动画
 */
class DragonBonesAnimation extends eui.Component
{
    public constructor()
    {
        super();
        this.frameListenerCallBack = {};
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageHandler, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStageHandler, this);
    }

    /**
     * 从舞台移除
     */
    protected onRemoveFromStageHandler(): void
    {
        this._dragonBonesDisplay.removeDBEventListener(dragonBones.EventObject.COMPLETE, this.completeCallBack, this);
        this._dragonBonesDisplay.removeDBEventListener(dragonBones.EventObject.FRAME_EVENT, this.frameEventHandler, this);

        if(this._dragonBonesDisplay.parent)
        {
            this._dragonBonesDisplay.parent.removeChild(this._dragonBonesDisplay);
        }

        this.dispose();

        this.frameListenerCallBack = {};

        this._dragonBonesDisplay = null;
    }

    /**
     * 添加到舞台
     */
    protected onAddToStageHandler(): void
    {
        if(this._dragonBonesDisplay == null)
        {
            console.warn("显示对象为空");
        }

        this._dragonBonesDisplay.addDBEventListener(dragonBones.EventObject.COMPLETE, this.completeCallBack, this);
        this._dragonBonesDisplay.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this.frameEventHandler, this);
    }

    /**
     * - 加载龙骨数据
     * @param dragonbonesName - 龙骨动画名称
     * @param armatureName - 骨架名称
     * @param binary - 是否二进制
     */
    public loadingDragonbones(dragonbonesName: string, armatureName: string, binary: boolean = false): void
    {
        if(DragonBonesManager.getInstance().parseDragonBonesData(dragonbonesName, binary))
        {
            this._dragonBonesDisplay = DragonBonesManager.getInstance().buildArmatureDisplay(armatureName);
        }

        this.addChildWithDragonBones();
    }

    /**
     * 将龙骨动画添加到舞台
     */
    private addChildWithDragonBones(): void
    {
        // 固定宽高，方便定位
        this._dragonBonesDisplay.width = 484;
        this._dragonBonesDisplay.height = 893;
        // 适配显示对象的大小
        this.width = this._dragonBonesDisplay.width;
        this.height = this._dragonBonesDisplay.height;

        if(this._dragonBonesDisplay.parent == this)
        {
            return;
        }
        else if(this._dragonBonesDisplay.parent)
        {
            this._dragonBonesDisplay.parent.removeChild(this._dragonBonesDisplay);
        }

        this.addChild(this._dragonBonesDisplay);
    }

    /**
     * 设置尺寸大小
     * @param width - 宽
     * @param height - 高
     */
    public setDisplaySize(width: number, height: number): void
    {
        this._dragonBonesDisplay.width = width;
        this._dragonBonesDisplay.height = height;

        this.width = width;
        this.height = height;
    }

    /**
     * 龙骨显示对象
     */
    protected _dragonBonesDisplay: dragonBones.EgretArmatureDisplay;

    /**
     * 龙骨动画状态
     */
    protected _dragonBonesState: dragonBones.AnimationState;

    /**
     * 播放模式
     */
    private _playType: boolean = true;

    /**
     * 是否正序播放，true为正序，false为倒序
     */
    public get playType(): boolean
    {
        return this._playType;
    }

    /**
     * 播放速度
     */
    public set timeScale(value: number)
    {
        this._dragonBonesState.timeScale = value;

        this._playType = value > 0 ? true : false;
    }

    /**
     * 设置回调
     * @param callBack
     * @param thisObj
     */
    private setCallBack(callBack: Function, thisObj: any): void
    {
        this.callBack = callBack;

        this.thisObj = thisObj;
    }

    /**
     * 动画完成的回调函数
     */
    private callBack: Function;

    /**
     * 回调函数指向的作用域
     */
    private thisObj: any;

    /**
     * 动画完成，执行回调函数
     */
    private completeCallBack(e: dragonBones.EgretEvent): void
    {
        if(this.callBack && this.thisObj)
        {
            let callback = this.callBack;
            let thisobj = this.thisObj;

            this.callBack = null;
            this.thisObj = null;

            callback.call(thisobj);
        }
    }

    /**
     * 龙骨动画帧事件
     */
    private frameEventHandler(e: dragonBones.EgretEvent): void
    {
        let callback = this.frameListenerCallBack[e.eventObject.name];

        // console.log("触发事件：", e.eventObject.name);

        if(callback != null)
        {
            callback.call();
        }
    }

    /**
     * 自定义事件列表
     */
    private frameListenerCallBack: {[key: string] : DragonBonesCustomListener};

    /**
     * 监听自定义事件
     * @param type - 事件类型
     * @param listener - 监听函数
     * @param thisObj - 监听函数指向的作用域
     */
    public addFrameEventListener(type: string, listener: Function, thisObj: any): void
    {
        let item = this.frameListenerCallBack[type];
        
        if(item == null)
        {
            item = new DragonBonesCustomListener();

            item.func = listener;

            item.thisObj = thisObj;

            this.frameListenerCallBack[type] = item;
        }
        else 
        {
            console.warn("该事件已有监听");
        }
    }

    /**
     * 移除监听
     * @param type - 事件类型
     * @param listener - 监听函数
     * @param thisObj - 监听函数指向的作用域
     */
    public removeFrameEventListener(type: string, listener: Function, thisObj: any): void
    {
        let item = this.frameListenerCallBack[type];

        if(item == null)
        {
            return;
        }

        if(item.func == listener && item.thisObj == thisObj)
        {
            delete this.frameListenerCallBack[type];
        }
    }

    /**
     * 播放动画
     * @param animationName - 动画名称
     * @param playTimes - 播放次数
     * @param thisObj - 回调函数指向的作用域
     * @param callBack - 回调函数
     */
    public play(animationName?: string, playTimes?: number, thisObj?: any, callBack?: Function): DragonBonesAnimation
    {
        this.setCallBack(callBack, thisObj);
        
        this._dragonBonesState = this._dragonBonesDisplay.animation.play(animationName, playTimes);

        return this;
    };

    /**
     * 从指定帧开始播放动画
     * @param animationName - 动画名称
     * @param frame - 指定的帧数
     * @param playTimes - 播放次数
     * @param thisObj - 回调函数指向的作用域
     * @param callBack - 回调函数
     */
    public playByFrame(animationName: string, frame: number, playTimes: number, thisObj?: any, callBack?: Function): DragonBonesAnimation
    {
        this.setCallBack(callBack, thisObj);

        this._dragonBonesState = this._dragonBonesDisplay.animation.gotoAndPlayByFrame(animationName, frame, playTimes);

        return this;
    }

    /**
     * 从指定进度开始播放动画
     * @param animationName
     * @param progress - 进度 [0~1]
     * @param playTimes
     * @param thisObj
     * @param callBack
     */
    public playByProgress(animationName: string, progress: number, playTimes: number, thisObj?: any, callBack?: Function): DragonBonesAnimation
    {
        this.setCallBack(callBack, thisObj);

        this._dragonBonesState = this._dragonBonesDisplay.animation.gotoAndPlayByProgress(animationName, progress, playTimes);

        return this;
    }

    /**
     * 暂停动画
     * @param animationName - 动画名称
     */
    public stop(animationName?: string): DragonBonesAnimation
    {
        this._dragonBonesDisplay.animation.stop(animationName);

        return this;
    }

    /**
     * 将动画停止到指定帧
     * - 直接停止到指定帧，而不是平滑过渡
     * @param animationName
     * @param frame
     */
    public stopByFrame(animationName: string, frame: number): DragonBonesAnimation
    {
        this._dragonBonesDisplay.animation.gotoAndStopByFrame(animationName, frame);

        return this;
    }

    /**
     * 清除动画
     */
    public reset(): DragonBonesAnimation
    {
        this._dragonBonesDisplay.animation.reset();

        return this;
    }

    /**
     * 获取插槽
     * @param slotName - 插槽名称
     */
    protected getSlot(slotName: string): dragonBones.Slot
    {
        return this._dragonBonesDisplay.armature.getSlot(slotName);
    }

    /**
     * 获取骨骼
     * @param boneName - 骨骼名称
     */
    protected getBone(boneName: string): dragonBones.Bone
    {
        return this._dragonBonesDisplay.armature.getBone(boneName);
    }

    /**
     * 显示插槽
     * @param slots - 插槽名称
     */
    public hideSlot(...slots: string[]): void
    {
        if(slots == null || slots.length == 0)
        {
            return;
        }

        for(let i = 0; i < slots.length; i ++)
        {
            let slot = this.getSlot(slots[i]);

            slot.visible = false;
        }
    }

    /**
     * 隐藏插槽
     * @param - slots 插槽名称
     */
    public showSlot(...slots: string[]): void
    {
        if(slots == null || slots.length == 0)
        {
            return;
        }

        for(let i = 0; i < slots.length; i ++)
        {
            let slot = this.getSlot(slots[i]);

            slot.visible = true;
        }
    }

    /**
     * 隐藏骨骼
     * - 目前发现对于序列帧动画骨骼无效，只会隐藏设置的那一帧，在序列帧播放到一下帧时又会显示回来
     * @param bones - 骨骼名称
     */
    public hideBone(...bones: string[]): DragonBonesAnimation
    {
        if(bones == null || bones.length == 0)
        {
            return this;
        }

        for(let i = 0; i < bones.length; i ++)
        {
            let bone = this.getBone(bones[i]);

            bone.visible = false;

            bone.invalidUpdate();
        }

        return this;
    }

    /**
     * 显示骨骼
     * @param bones - 骨骼名称
     */
    public showBone(...bones: string[]): DragonBonesAnimation
    {
        if(bones == null || bones.length == 0)
        {
            return this;
        }

        for(let i = 0; i < bones.length; i ++)
        {
            this.getBone(bones[i]).visible = true;
        }

        return this;
    }

    /**
     * 添加骨骼遮罩
     * - 被添加遮罩的骨骼会继续显示骨骼上的动画，其他未被添加遮罩的骨骼将会保持原样，不参与动画
     * @param bones - 骨骼名称
     */
    public addBoneMask(...bones: string[]): DragonBonesAnimation
    {
        if(bones == null || bones.length == 0)
        {
            return this;
        }

        for(let i = 0; i < bones.length; i ++)
        {
            this._dragonBonesState.addBoneMask(bones[i]);
        }

        return this;
    }

    /**
     * 删除指定骨骼遮罩
     * @param bones - 骨骼名称
     */
    public removeBoneMask(...bones: string[]): DragonBonesAnimation
    {
        if(bones == null || bones.length == 0)
        {
            return this;
        }

        for(let i = 0; i < bones.length; i ++)
        {
            this._dragonBonesState.removeBoneMask(bones[i]);
        }

        return this;
    }

    /**
     * 移除所有骨骼遮罩
     */
    public removeAllBoneMask(): DragonBonesAnimation
    {
        this._dragonBonesState.removeAllBoneMask();

        return this;
    }

    /**
     * 释放骨架
     */
    public dispose(): void
    {
        this._dragonBonesDisplay.armature.dispose();
    }

    /**
     * 隐藏
     */
    public hide(): DragonBonesAnimation
    {
        this.reset();

        this.visible = false;

        return this;
    }

    /**
     * 显示
     */
    public show(): DragonBonesAnimation
    {
        this.visible = true;

        return this;
    }

    /**
     * 边框
     */
    private line: eui.Rect;

    /**
     * 显示一个边框
     */
    public showLine(color: number = 0xFF0000, strokeWeight: number = 2): void
    {
        if(this.line == null)
        {
            this.line = new eui.Rect();
            this.addChild(this.line);
        }
        
        this.line.width = this.width;
        this.line.height = this.height;
        this.line.fillAlpha = 0;
        this.line.strokeColor = color;
        this.line.strokeWeight = strokeWeight;
    }

    /**
     * 隐藏边框
     */
    public hideLine(): void
    {
        if(this.line)
        {
            if(this.line.parent) this.line.parent.removeChild(this.line);
            this.line = null;
        }
    }
}

/**
 * 龙骨自定义事件
 */
class DragonBonesCustomEvent
{
    /**
     * - 合并动画第80帧
     */
    public static STRUGGLE_END: string = "STRUGGLE_END";

    /**
     * 合并的倒放动画第0帧
     */
    public static REVERSE_END: string = "REVERSE_END";

    /**
     * 绳子断掉的帧
     */
    public static CATTLE_LAUGH: string = "CATTLE_LAUGH";
}

/**
 * 自定义事件监听
 */
class DragonBonesCustomListener
{
    /**
     * 监听函数
     */
    func: Function;

    /**
     * 作用域
     */
    thisObj: any;

    /**
     * 执行回调
     */
    call(): void
    {
        this.func.call(this.thisObj);    
    }
}