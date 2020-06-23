class DataModel
{
    private static _instance: DataModel;

    public static getInstance(): DataModel
    {
        if(this._instance == null)
        {
            this._instance = new DataModel();
        }

        return this._instance;
    }

    private _result: boolean;

    public get result(): boolean
    {
        return this._result;
    }
    public set result(value: boolean)
    {
        this._result = value;
    }
}