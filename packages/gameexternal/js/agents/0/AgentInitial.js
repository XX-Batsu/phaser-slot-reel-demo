const exchangeData = {
    credit: 0,
    currencyTypeAry: []
};
const cashoutData = {
    currencyTypeAry: []
};
class currencyClass {
    constructor() {
        this.amount = -1, this.rate = -1, this.sort = -1, this.status = -1, this.typeID = -1, this.type = -1
    }
    setAmount(amount) {
        this.amount = amount
    }
    setRate(rate) {
        this.rate = rate
    }
    setSort(sort) {
        this.sort = sort
    }
    setStatus(status) {
        this.status = status
    }
    setTypeID(typeID) {
        this.typeID = typeID
    }
    setType(type) {
        this.type = type
    }
}
const AgentInitial = {
    transformLoginData(data) {
        exchangeData.credit = data.coin;
        this.setCookie(data.returnUrl, this.getCookie(data.returnUrl), 0);
        exchangeData.userName = data.userName
        if (!data.array_gameInfo || !data.array_userCoinQuota) {
            return exchangeData;
        }
        exchangeData.currencyTypeAry = this.transformCurrencyData(data.array_gameInfo, data.array_userCoinQuota);
        exchangeData.errCode = data.err;
        return exchangeData;
    },
    transformCurrencyData(gameInfo, userCoinQuota) {
        const currencyClassAry = [];
        const sortedAry = [];
        gameInfo.forEach((info, inx) => {
            currencyClassAry[inx] = new currencyClass();
            userCoinQuota.forEach((coinData, coinInx) => {
                if (info.type === coinData.type) {
                    currencyClassAry[inx].setAmount(coinData.amount);
                    currencyClassAry[inx].setTypeID(coinData.type);
                    currencyClassAry[inx].setType(this.transTypeStr(coinData.type));
                }
            }, this);
            currencyClassAry[inx].setRate(info.rate);
            currencyClassAry[inx].setSort(info.sort);
            currencyClassAry[inx].setStatus(info.status);
            sortedAry[currencyClassAry[inx].sort - 1] = currencyClassAry[inx];
        }, this);
        return sortedAry;
    },
    transformCashoutData(data) {
        const currencyStatusAry = [];
        Object.keys(data).forEach((key, inx) => {
            currencyStatusAry[inx] = {
                type: this.transCashoutTypeStr(key),
                amount: data[key]
            };
        }, this);
        cashoutData.currencyTypeAry = currencyStatusAry;
        return cashoutData;
    },
    transTypeStr(type) {
        let currencyTypeStr = '';
        const typeInt = +type;
        switch (typeInt) {
            case 1:
                currencyTypeStr = 'coin';
                break;
            case 2:
                currencyTypeStr = 'coupon';
                break;
            case 3:
                currencyTypeStr = 'ulgcoin';
                break;
            case 4:
                currencyTypeStr = 'bonus';
                break;
            default:
        }
        return currencyTypeStr;
    },
    transCashoutTypeStr(type) {
        let cashoutTypeStr = '';
        switch (type) {
            case 'Gold_out':
                cashoutTypeStr = 'coin';
                break;
            case 'Voucher_out':
                cashoutTypeStr = 'coupon';
                break;
            case 'ULB_out':
                cashoutTypeStr = 'ulgcoin';
                break;
            case 'Bonus_out':
                cashoutTypeStr = 'bonus';
                break;
            default:
        }
        return cashoutTypeStr;
    },
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    },
    getCookie(cname) {
        const name = cname + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }
};
