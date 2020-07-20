/**
 * 龙骨动画管理
 */
class DragonBonesManager
{
    private static _instance: DragonBonesManager;

    public constructor()
    {
        this._dataPool = [];
    }

    /**
     * DragonBonesManager单例
     */
    public static getInstance(): DragonBonesManager
    {
        if(DragonBonesManager._instance == null)
        {
            DragonBonesManager._instance = new DragonBonesManager();
        }

        return DragonBonesManager._instance;
    }

    /**
     * 解析龙骨数据，获得龙骨显示对象
     * - 二进制格式的龙骨动画性能会比json龙骨的性能好
     * @param dragonBonesName - 龙骨名称
     * @param armatureName - 骨架名称
     * @param binary - 是否二进制
     * @return 龙骨显示对象
     */
    public getDragonBonesObject(dragonBonesName: string, armatureName: string, binary: boolean = false): dragonBones.EgretArmatureDisplay
    {
        if(this.parseDragonBonesData(dragonBonesName, binary))
        {
            return this.buildArmatureDisplay(armatureName);
        }
    }

    /**
     * 已经缓存的龙骨名称
     */
    private _dataPool: string[];

    /**
     * 添加已经缓存的龙骨
     * @param dragonBonesName - 龙骨名称
     */
    public push(dragonBonesName: string): boolean
    {
        this._dataPool.push(dragonBonesName);

        console.log(`添加龙骨缓存：${dragonBonesName}`);

        return true;
    }

    /**
     * 检测龙骨动画是否被缓存
     * @param dragonBonesName - 龙骨名称
     */
    public checkInPool(dragonBonesName: string): boolean
    {
        for(let i = 0; i < this._dataPool.length; i ++)
        {
            if(this._dataPool[i] == dragonBonesName)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * 解析龙骨数据并缓存到工厂
     * @param dragonBonesName - 龙骨名称
     * @param binary - 是否二进制
     */
    public parseDragonBonesData(dragonBonesName: string, binary: boolean = false): boolean
    {
        if(this.checkInPool(dragonBonesName))
        {
            return true;
        }

        let dragonbonesData = RES.getRes(`${dragonBonesName}_ske_${binary ? "dbbin" : "json"}`);
        let textureData = RES.getRes(`${dragonBonesName}_tex_json`);
        let texture = RES.getRes(`${dragonBonesName}_tex_png`);

        let egretFactory = dragonBones.EgretFactory.factory;

        egretFactory.parseDragonBonesData(dragonbonesData);
        egretFactory.parseTextureAtlasData(textureData, texture);

        return this.push(dragonBonesName);
    }

    /**
     * 获取龙骨工厂中缓存的龙骨显示对象
     * @param armatureName - 骨架名称
     * @return 龙骨显示对象
     */
    public buildArmatureDisplay(armatureName: string): dragonBones.EgretArmatureDisplay
    {
        let egretFactory = dragonBones.EgretFactory.factory;

        let armatureDisplay = egretFactory.buildArmatureDisplay(armatureName);

        return armatureDisplay;
    }

    /**
     * 局部换装(插槽换装)
     * @param dragonBonesName - 替换源的龙骨名称
     * @param armatureName - 替换源的骨架名称
     * @param slotName - 替换源的插槽名称
     * @param displayName - 替换源的显示对象名称（图片名称）
     * @param slot - 要进行替换的插槽
     * @param binary - 替换源数据是否为二进制
     * @param displayIndex 替换索引位置
     */
    public replaceSlotDisplay(dragonBonesName: string, armatureName: string, slotName: string, displayName: string, slot: dragonBones.Slot, binary: boolean = false, displayIndex?: number): boolean
    {
        if(this.parseDragonBonesData(dragonBonesName, binary))
        {
            let egretFactory = dragonBones.EgretFactory.factory;

            let result = egretFactory.replaceSlotDisplay(dragonBonesName, armatureName, slotName, displayName, slot, displayIndex);

            if(!result)
            {
                console.warn(`插槽 ${slot.slotData.name} 替换失败，详细信息：\n1.替换源龙骨：${dragonBonesName}\n2.替换源骨架：${armatureName}\n3.替换源插槽：${slotName}\n4.替换源显示对象：${displayName}\n5.二进制数据：${binary}\n6.替换索引位置：${displayIndex}`);

                console.log("====================================== 分割线 ======================================");
            }

            return result;
        }
    }

    /**
     * 局部换装(插槽数组批量换装)
     * @param dragonBonesName - 替换源的龙骨名称
     * @param armatureName - 替换源的骨架名称
     * @param slotName - 替换源的插槽名称
     * @param slot - 要进行替换的插槽
     * @param binary - 替换源数据是否为二进制
     */
    public replaceSlotDisplayList(dragonBonesName: string, armatureName: string, slotName: string, slot: dragonBones.Slot, binary: boolean = false): boolean
    {
        if(this.parseDragonBonesData(dragonBonesName, binary))
        {
            let egretFactory = dragonBones.EgretFactory.factory;

            let result = egretFactory.replaceSlotDisplayList(dragonBonesName, armatureName, slotName, slot);

            if(!result)
            {
                console.warn(`插槽 ${slot.slotData.name} 数组替换失败，详细信息：\n1.替换源龙骨：${dragonBonesName}\n2.替换源骨架：${armatureName}\n3.替换源插槽：${slotName}\n4.二进制数据：${binary}`);
            }

            return result;
        }
    }

    /**
     * 批量换装
     * -- 适用于以下情况
     * - 保证插槽名称和图片名称一致，对于同一个插槽里有多张图片的插槽不适用
     * - 要替换的资源以 <原资源名称+后缀> 的方式命名
     * - 例如 原资源为<slotName> 替换资源必须为 <slotName_Bule>
     * - 如果替换骨架中的资源和要被替换的资源名称一致，replaceName参数传空字符串
     * @param dragonBonesName - 龙骨名称
     * @param armatureName - 骨架名称
     * @param slotArr - 要进行替换的插槽组
     * @param replaceName - 对比于原插槽名称多出的后缀名
     * @param binary - 是否二进制
     */
    public replaceAll(dragonBonesName: string, armatureName: string, slotArr: dragonBones.Slot[], replaceName: string = "", binary: boolean = false): void
    {
        if(this.parseDragonBonesData(dragonBonesName, binary))
        {
            let len = slotArr.length;

            for(let i = 0; i < len; i ++)
            {
                let slot: dragonBones.Slot = slotArr[i];

                let slotName: string = `${slot.slotData.name}${replaceName}`;

                this.replaceSlotDisplay(dragonBonesName, armatureName, slotName, slotName, slot, binary);
            }
        }
    }

    /**
     * 清除缓存中的龙骨数据
     * - 清除缓存前请确保所有的骨架都已被释放，可通过以下方法进行释放
     * - 1. EgretArmatureDisplay.armature.dispose()
     * @param dragonBonesName - 龙骨名称
     */
    public dispose(dragonBonesName: string): void
    {
        let egretFactory = dragonBones.EgretFactory.factory;

        egretFactory.removeDragonBonesData(dragonBonesName, true);
        egretFactory.removeTextureAtlasData(dragonBonesName, true);

        for(let i = 0; i < this._dataPool.length; i ++)
        {
            if(this._dataPool[i] == dragonBonesName)
            {
                this._dataPool.splice(i, 1);

                console.log(`移除龙骨缓存：${dragonBonesName}`);

                return;
            }
        }
    }
}