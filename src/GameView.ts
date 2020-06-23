class GameView extends eui.Component
{
    public constructor()
    {
        super();
        this.once(egret.Event.COMPLETE, this.onUICompleteHandler, this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageHandler, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStageHandler, this);
        this.skinName = "GameSkin";
    }

    /*********************************************************************************************************************************** */

    public L1: eui.Label;
    public L2: eui.Label;
    public L3: eui.Label;
    public L4: eui.Label;
    public L5: eui.Label;
    public L6: eui.Label;
    public L7: eui.Label;
    public L8: eui.Label;

    private updateLabel(): void
    {
        // let v = this.leaderBody.velocity;

        // let velocity = Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));

        // this.L1.text = `rolePool length: ${this.rolePool.length}`;
        // this.L2.text = `world stepping: ${this.world.stepping}`;
        // this.L3.text = `stageX: ${this.mousePoint.x}`;
        // this.L4.text = `stageY: ${this.mousePoint.y}`;
        // this.L5.text = `ball X: ${this.leaderDisplay.x}, Y: ${this.leaderDisplay.y}`;
        // this.L6.text = `guide X: ${this.rect_arrow.x}, Y: ${this.rect_arrow.y}`;
        // this.L7.text = `leaderBody velocity: ${this.leaderBody.velocity}`;
        // this.L8.text = `leaderBody velocity value: ${velocity}`;

        this.world.step(this.dt);

        this.updateLeaderIndex();
    }

    /************************************************************************************************************************************ */

    /**
     * 物理世界频率
     */
    private dt: number = 1/60;

    private timeSinceLastCalled: number;

    private maxSubSteps: number;

    /**
     * 时间
     */
    public lbl_time: eui.Label;

    /**
     * 球
     */
    public ball: eui.Rect;

    /**
     * 指引
     */
    public rect_arrow: eui.Rect;

    /**
     * 方向
     */
    public direction: eui.Rect;

    /**
     * 触摸点中心
     */
    public center: eui.Rect;

    // /**
    //  * 结果
    //  */
    // public result: eui.Label;

    /**
     * 触摸点中心深色球
     */
    public deep_center: eui.Rect;

    /**
     * 添加到舞台
     */
    protected onAddToStageHandler(e: egret.Event): void
    {
        this.creatWorld();

        this.creatPlane();

        this.addRoleToStage();

        this.hideAll();

        // this.result.visible = false;

        // this.result.parent.setChildIndex(this.result, 99);

        // egret.Ticker.getInstance().register(this.updateLabel, this);
    }

    /**
     * 移出舞台
     */
    protected onRemoveFromStageHandler(e: egret.Event): void
    {

    }

    /**
     * 加载完成
     */
    protected onUICompleteHandler(e: egret.Event): void
    {
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);

        // this.result.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

        //     this.stage.removeChild(this);

        // }, this);

        this.addEventListener(egret.Event.ENTER_FRAME, this.updateLabel, this);
        // this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEndHandler, this);   
    }

    /**
     * 隐藏组件
     */
    private hideAll(): void
    {
        this.rect_arrow.visible = false;
        this.direction.visible = false;
        this.center.visible = false;
        this.deep_center.visible = false;
    }

    /**
     * 触摸点所在位置
     */
    private mousePoint: egret.Point = new egret.Point();

    /**
     * 开始按下
     */
    private touchBeginHandler(e: egret.TouchEvent): void
    {
        // 放慢频率10倍，实现子弹时间效果
        this.dt = 1/600;

        this.mousePoint.x = e.stageX;
        this.mousePoint.y = e.stageY;

        this.center.x = e.stageX;
        this.center.y = e.stageY;

        this.deep_center.x = e.stageX;
        this.deep_center.y = e.stageY;

        this.showDirection(e, true);

        this.rect_arrow.visible = true;
        this.direction.visible = true;
        this.center.visible = true;
        this.deep_center.visible = true;
    }

    /**
     * 手指移动中
     */
    private touchMoveHandler(e: egret.TouchEvent): void
    {
        this.mousePoint.x = e.stageX;
        this.mousePoint.y = e.stageY;

        this.rect_arrow.visible = true;

        this.showDirection(e);
    }

    /**
     * 移动结束
     */
    private touchEndHandler(e: egret.TouchEvent): void
    {
        // 结束后，恢复原来的步进频率
        this.dt = 1/60;

        this.hideAll();

        this.leaderLaunch();
    }

    /**
     * 操作圆显示
     */
    private showDirection(e: egret.TouchEvent, noMove?: boolean): void
    {
        let centerX: number = this.center.x;
        let centerY: number = this.center.y;

        let stageX: number = e.stageX;
        let stageY: number = e.stageY;

        // 点击但未移动时，给予一个固定的值
        if(noMove)
        {
            stageX = centerX;

            stageY = centerY - 80;
        }

        // 指引球圆心到中心球圆心的距离
        let length: number = this.center.width / 2 + this.direction.width / 2;

        // 触摸点到中心球圆心的x,y之差
        let distanceX: number = stageX - centerX;
        let distanceY: number = stageY - centerY;

        // 触摸点到中心球圆心的距离
        let distanceLength: number = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

        // 长度比例
        let times: number = length / distanceLength;

        // 利用相似三角形的定理，求出指引球的圆心坐标
        let targetX: number = centerX - times * (centerX - stageX);
        let targetY: number = centerY - times * (centerY - stageY);

        this.direction.x = targetX;
        this.direction.y = targetY;
    }

    /**
     * 每一帧都重绘egret舞台，实时更新物理世界中各个刚体的位置
     */
    private updateLeaderIndex(): void
    {
        let len: number = this.rolePool.length;

        if(len == 0)
        {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.updateLabel, this);

            // this.result.text = `You Win!\nCilck Me`;

            // this.result.visible = true;

            DataModel.getInstance().result = true;
        }

        let arrId: number[] = [];

        for(let i: number = 0; i < len; i ++)
        {
            let body: p2.Body = this.rolePool[i];

            if(body.world == null || body.world == undefined)
            {
                arrId.push(i);
            }
            else
            {
                let display:egret.DisplayObject = body.displays[0];

                display.x = body.position[0];
                display.y = body.position[1];
            }  
        }

        for(let i: number = 0; i < arrId.length; i ++)
        {
            this.rolePool.splice(arrId[i], 1);
        }

        this.leaderDisplay.x = this.leaderBody.position[0];
        this.leaderDisplay.y = this.leaderBody.position[1];

        if(this.rect_arrow.visible)
        {
            this.updateGuide();
        }
    }

    /**
     * 重新绘制路径
     */
    private updateGuide(): void
    {
        this.rect_arrow.x = this.leaderDisplay.x;
        this.rect_arrow.y = this.leaderDisplay.y;

        // 定义向量
        let vector: number[] = [this.direction.x - this.center.x, this.direction.y - this.center.y];

        // 拉伸到鼠标的位置
        // this.rect_arrow.scaleY = Math.sqrt(Math.pow(this.mousePoint.x - this.leaderDisplay.x, 2) + Math.pow(this.mousePoint.y - this.leaderDisplay.y, 2)) / 100;

        // // 因为egret坐标系和正常坐标系的Y轴是相反的，所以要取反
        // let rotation = Math.atan2(this.mousePoint.x - this.leaderDisplay.x, this.leaderDisplay.y - this.mousePoint.y) / Math.PI * 180;

        this.rect_arrow.scaleY = 2;

        let rotation: number = Math.atan2(vector[0], -vector[1]) / Math.PI * 180;

        this.rect_arrow.rotation = rotation;
    }

    /**
     * 发射小球
     */
    private leaderLaunch(): void
    {
        // 施加力之前，先将速度减为0，使得以恒定的速度发射

        this.leaderBody.velocity = [0, 0]

        // 倍率
        let count: number = 500;

        // let x: number = (this.mousePoint.x - this.leaderBody.position[0]) * count;

        // let y: number = (this.mousePoint.y - this.leaderBody.position[1]) * count;

        // let vector = p2.vec2.fromValues(x, y);

        // 要施加的力，以向量方式表示
        let vector: number[] = [(this.direction.x - this.center.x) * count, (this.direction.y - this.center.y) * count];

        // 相对于球心给球施加力
        this.leaderBody.applyForce(vector, [this.leaderBody.position[0], this.leaderBody.position[1]]);
    }

    /**
     * 碰撞检测
     * - 开始碰撞
     * - 此处p2.ImpactEvent只是用于定义，方便调用，其在p2.js为p2.world.ImpactEvent
     */
    private beginCollision(e: p2.ImpactEvent): void
    {
        console.log("开始碰撞");
        let bodyA: p2.Body = e.bodyA;
        let bodyB: p2.Body = e.bodyB;

        if(bodyA.id == this.leaderBody.id || bodyB.id == this.leaderBody.id)
        {
            for(let i: number = 0; i < this.boomPool.length; i ++)
            {
                if(bodyA.id == this.boomPool[i].id || bodyB.id == this.boomPool[i].id)
                {
                    this.removeEventListener(egret.Event.ENTER_FRAME, this.updateLabel, this);

                    DataModel.getInstance().result = false;

                    return;
                }
            }

            for(let i: number = 0; i < this.rolePool.length; i ++)
            {
                if(bodyA.id == this.rolePool[i].id || bodyB.id == this.rolePool[i].id)
                {
                    if(this.removeBodyPool == undefined)
                    {
                        this.removeBodyPool = [];
                    }

                    this.removeBodyPool.push(this.rolePool[i]);

                    return;
                }
            }
        }
    }

    /**
     * 碰撞检测
     * - 碰撞结束
     */
    private endCollision(e: p2.ImpactEvent): void
    {
        console.log("碰撞结束");
        let bodyA: p2.Body = e.bodyA;
        let bodyB: p2.Body = e.bodyB;

        if(bodyA.id == this.leaderBody.id || bodyB.id == this.leaderBody.id)
        {
            
        }
    }

    /**
     * 步后函数
     */
    private postStepHandler(): void
    {
        if(this.removeBodyPool != undefined && this.removeBodyPool.length > 0)
        {
            for(let i: number = 0; i < this.removeBodyPool.length; i ++)
            {
                let display: egret.DisplayObject = this.removeBodyPool[i].displays[0];

                this.removeChild(display);

                this.world.removeBody(this.removeBodyPool[i]);
            }

            this.removeBodyPool = [];
        }
    }

    /**
     * 等待移除的刚体
     */
    private removeBodyPool: p2.Body[];

    /**
     * 统一材质
     */
    private Material: p2.Material;

    /**
     * p2物理世界
     */
    private world: p2.World;

    /**
     * 创建世界
     */
    private creatWorld(): void
    {
        this.world = new p2.World();

        // 设置此物理世界的刚体休眠策略，刚体休眠时，可以提高性能
        this.world.sleepMode = p2.World.BODY_SLEEPING;

        // 设置重力，值以向量表示，要设置正常的重力时，可设置为[0, -9.8]
        this.world.gravity = [0, 0];
        this.world.applySpringForces = true;
        this.world.frictionGravity = 0;

        // 实例化材质
        this.Material = new p2.Material(1);

        // 材质接触约束
        // firction 摩擦因数 将其设置为0，可以使碰撞的时候损失的能量忽略不计
        // restitution 弹力因数
        let contactMaterial = new p2.ContactMaterial(this.Material, this.Material, <p2.ContactMaterialOptions>{friction: 0, restitution: 1});

        // 将约束添加到物理世界
        this.world.addContactMaterial(contactMaterial);

        // 监听开始碰撞和结束碰撞事件，由于on监听函数的参数不带对象，所以要自己bind一个对象
        this.world.on("beginContact", this.beginCollision.bind(this));
        this.world.on("endContact", this.endCollision.bind(this));
        this.world.on("postStep", this.postStepHandler.bind(this));
    }

    /**
     * 创建墙壁和地板
     */
    private creatPlane(): void
    {
        // 天花板
        let topShape: p2.Plane = new p2.Plane();
        let topBody: p2.Body = new p2.Body({
            position: [this.stage.stageWidth, 0],
        });

        // 地板
        let bottomShape: p2.Plane = new p2.Plane();
        let bottomBody: p2.Body = new p2.Body({
            position: [0, this.stage.stageHeight],
            angle: Math.PI,
        });

        //左墙
        let leftShape: p2.Plane = new p2.Plane();
        let leftBody: p2.Body = new p2.Body({
            position: [0, 0],
            angle: -Math.PI/2,
        });

        // 右墙
        let rightShape: p2.Plane = new p2.Plane();
        let rightBody: p2.Body = new p2.Body({
            position: [this.stage.stageWidth, 0],
            angle: Math.PI/2,
            mass: 0
        });

        // 设置形状材质
        topShape.material = this.Material;
        bottomShape.material = this.Material;
        leftShape.material = this.Material;
        rightShape.material = this.Material;

        // 将形状添加到刚体
        topBody.addShape(topShape);
        bottomBody.addShape(bottomShape);
        leftBody.addShape(leftShape);
        rightBody.addShape(rightShape);  

        //设置阻尼
        topBody.damping = 0;
        bottomBody.damping = 0;
        leftBody.damping = 0;
        rightBody.damping = 0;

        // 将刚体添加到世界
        this.world.addBody(topBody);
        this.world.addBody(bottomBody); 
        this.world.addBody(leftBody);
        this.world.addBody(rightBody);
    }

    /**
     * 主角显示对象
     */
    private leaderDisplay: egret.DisplayObject;

    /**
     * 主角刚体
     */
    private leaderBody: p2.Body;

    /**
     * 创建主角
     */
    private creatLeader(): egret.DisplayObject
    {
        let circle: p2.Shape = new p2.Circle({radius: 30});

        // 设置材质
        circle.material = this.Material;

        let x: number = this.stage.stageWidth / 2;
        let y: number = this.stage.stageHeight - 300;

        // 初始化刚体
        // mass 质量 1KG
        // position 刚体在物理世界的位置
        // 将刚体添加到物理世界时，刚体的锚点在其中心
        this.leaderBody = new p2.Body({mass: 1, position: [x, y]});

        // 设置刚体运动类型 
        // Static 刚体不会动，不响应力或者碰撞
        // Dynamic 刚体会动，响应力和碰撞
        // Kinematic 刚体仅根据自身属性运动，不响应力或者碰撞
        this.leaderBody.type = p2.Body.DYNAMIC;

        this.leaderBody.addShape(circle);

        this.leaderBody.damping = 0;

        this.world.addBody(this.leaderBody);

        let display = new eui.Image("qiu_png");

        display.width = (<p2.Circle>circle).radius * 2;
        display.height = (<p2.Circle>circle).radius * 2;

        display.anchorOffsetX = (<p2.Circle>circle).radius;
        display.anchorOffsetY = (<p2.Circle>circle).radius;

        // 绑定egret显示对象，使刚体在舞台中具现
        this.leaderBody.displays = [display];

        return display;
    }

    /**
     * 将角色添加到舞台
     */
    private addRoleToStage(): void
    {
        let leader: egret.DisplayObject = this.creatLeader();

        this.leaderDisplay = leader;

        this.leaderDisplay.x = this.leaderBody.position[0];

        this.leaderDisplay.y = this.leaderBody.position[1];

        this.addChild(this.leaderDisplay);

        this.rolePool = [];

        this.boomPool = [];

        for(let i: number = 0; i < 15; i ++)
        {
            let display: egret.DisplayObject = this.creatRole();

            this.addChild(display);
        }

        for(let i: number = 0; i < 10; i ++)
        {
            let display: egret.DisplayObject = this.creatBoom();

            this.addChild(display);
        }
    }

    /**
     * 炸弹对象池
     */
    private boomPool: p2.Body[];

    /**
     * 创建炸弹
     */
    private creatBoom(): egret.DisplayObject
    {
        let circle: p2.Circle = new p2.Circle({radius: 30});

        circle.material = this.Material;

        let position = this.getEnemyIndex(circle);

        let shapeBody: p2.Body = new p2.Body({mass: 0, position: position});

        shapeBody.type = p2.Body.DYNAMIC;

        shapeBody.addShape(circle);

        shapeBody.damping = 0;

        this.world.addBody(shapeBody);

        let display = new eui.Image("boom_png");

        let times = circle.radius * 2 / 173;

        display.height = circle.radius * 2;

        display.width = times * 193;

        display.anchorOffsetX = circle.radius;
        display.anchorOffsetY = circle.radius;

        shapeBody.displays = [display];

        display.x = shapeBody.position[0];
        display.y = shapeBody.position[1];

        this.boomPool.push(shapeBody);

        return display;
    }

    /**
     * 角色对象池
     */
    private rolePool: p2.Body[];

    /**
     * 创建角色
     */
    private creatRole(): egret.DisplayObject
    {
        // 创建圆形状
        let circle: p2.Shape = new p2.Circle({radius: 30});

        circle.material = this.Material;

        let position = this.getEnemyIndex(circle);

        let shapeBody: p2.Body = new p2.Body({mass: 0, position: position});

        shapeBody.type = p2.Body.DYNAMIC;

        shapeBody.addShape(circle);

        shapeBody.damping = 0;

        this.world.addBody(shapeBody);

        let random = Math.floor(Math.random() * 9) + 1;

        let display = new eui.Image(`enemy_3_3_${random}_png`);

        display.width = (<p2.Circle>circle).radius * 2;
        display.height = (<p2.Circle>circle).radius * 2;

        display.anchorOffsetX = display.width / 2;
        display.anchorOffsetY = display.height / 2;

        shapeBody.displays = [display];

        display.x = shapeBody.position[0];

        display.y = shapeBody.position[1];

        this.rolePool.push(shapeBody);

        return display;
    }

    /**
     * 获取不与其他球重合的坐标
     */
    private getEnemyIndex(role: p2.Shape): number[]
    { 
        let radius: number = (<p2.Circle>role).radius;

        let x = Math.random() * (this.stage.stageWidth - (radius * 2)) + radius;
        let y = Math.random() * (this.stage.stageHeight - (radius * 2)) + radius;

        // 与敌人球重合
        for(let i: number = 0; i < this.rolePool.length; i ++)
        {
            let otherRadius: number = (<p2.Circle>this.rolePool[i].shapes[0]).radius;

            let distance: number = Math.sqrt(Math.pow(x - this.rolePool[i].position[0], 2) + Math.pow(y - this.rolePool[i].position[1], 2));

            if(distance < radius + otherRadius)
            {
                return this.getEnemyIndex(role);
            }
        }

        // 与炸弹重合
        for(let i: number = 0; i < this.boomPool.length; i ++)
        {
            let otherRadius: number = (<p2.Circle>this.boomPool[i].shapes[0]).radius;

            let distance: number = Math.sqrt(Math.pow(x - this.boomPool[i].position[0], 2) + Math.pow(y - this.boomPool[i].position[1], 2));

            if(distance < radius + otherRadius)
            {
                return this.getEnemyIndex(role);
            }
        }

        let distance: number = Math.sqrt(Math.pow(x - this.leaderBody.position[0], 2) + Math.pow(y - this.leaderBody.position[1], 2));

        if(distance < radius + (<p2.Circle>this.leaderBody.shapes[0]).radius)
        {
            return this.getEnemyIndex(role);
        }

        return [x, y];
    }

    public static open(): void
    {
        manager.LayerManager.getInstance().addChildWithClass(GameView);
    }

    public static close(): void
    {
        manager.LayerManager.getInstance().removeChildWithClass(GameView);
    }
}