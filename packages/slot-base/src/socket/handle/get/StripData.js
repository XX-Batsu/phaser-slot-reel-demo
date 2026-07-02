import PlayModel from 'socket/model/PlayModel';

export default class StripData extends PlayModel {
    /**
     * 資料處理
     * @param  {Object} data  Server 拿到的 json 資料
     * @return {Array}  Strip Array
     */
    constructor(data) {
        super();
        const stripDataPacket = Object.create(null);
        stripDataPacket.stripData = Object.create(null);

        if (data.fakeDataMode) {
            stripDataPacket.stripData.baseStrip = (data.BGContext && data.BGContext.length > 0) ? this.handleFakeStrip(data.BGContext) : [];
            stripDataPacket.stripData.freeStrip = (data.FGContext && data.FGContext.length > 0) ? this.handleFakeStrip(data.FGContext) : [];
            return stripDataPacket;
        }

        return {
            stripData: {
                baseStrip: (data.BGContext && data.BGContext.length > 0) ? this.handleStrip(data.BGContext) : [],
                freeStrip: (data.FGContext && data.FGContext.length > 0) ? this.handleStrip(data.FGContext) : []
            }
        };
    }

    /**
     * @param  {Array} stripContext   Strip Array
     * @return {Array} Symbol ID Array
     */
    handleStrip(stripContext) {
        const newStripArr = [];

        stripContext.forEach((val, idx) => {
            if (newStripArr[idx] === undefined) {
                newStripArr.push([]);
            }
            val.forEach((strip) => {
                const singleReel = this.decryptStringAES(strip).split(',');

                newStripArr[idx].push(singleReel);
            });
        });
        return newStripArr;
    }

    /**
     * @param  {Array} stripContext   Strip Array
     * @return {Array} Symbol ID Array
     */
    handleFakeStrip(stripContext) {
        const newStripArr = [];

        stripContext.forEach((val, idx) => {
            if (newStripArr[idx] === undefined) {
                newStripArr.push([]);
            }
            val.forEach((strip) => {
                const singleReel = strip.split(',');

                newStripArr[idx].push(singleReel);
            });
        });
        return newStripArr;
    }
}
