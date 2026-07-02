export default class Currency {

    static init(hasDollarSign = 'Y') {
        this.dollarsign = hasDollarSign;
    }

    static currencySign(id = 0) {
        const currencyObj = {
            1: { en: 'RMB', point: '!' }, // 中國 人民幣
            2: { en: 'TWD', point: '$' }, // 台灣 新台幣
            3: { en: 'USD', point: '$' }, // 美國 美元
            4: { en: 'KRW', point: '@' }, // 韓國 韓元
            5: { en: 'JPY', point: '!' }, // 日本 日圓 ¥
            6: { en: 'PHP', point: '#' }, // 菲律賓 披索 ₱
            7: { en: 'THB', point: '%' }, // 泰國 泰銖 ฿
            8: { en: 'MYR', point: '&' }, // 馬來西亞 令吉 RM
            9: { en: 'VND', point: '^' }, // 越南 越南盾 ₫
            10: { en: 'EUR', point: '*' }, // 歐洲 歐元 €
            11: { en: 'MMK', point: '_' }, // 緬甸 緬甸元 K
            12: { en: 'IDR', point: '(' }, // 印尼 盧比 ₨
            13: { en: 'AUD', point: '$' }, // 澳洲 澳元 $
            14: { en: 'SGD', point: '$' }, // 新加坡 新加坡元 $
            15: { en: 'GBP', point: '{' }, // 英國 英鎊 £
            16: { en: 'INR', point: '|' }, // 印度 盧比 ₹
            17: { en: 'VND(K)', point: '~' }, // 越南 越南盾 ₫(K)
            18: { en: 'IDR(K)', point: ')' }, // 印度 盧比 ₹(k)
            19: { en: 'HKD', point: '}' }, // 香港 港幣 (HK$)
            20: { en: 'CQP2', point: '-' }, // 美國 美元 (不顯示幣別符號)
            21: { en: 'MMKP1', point: '-' }, // 緬甸 緬甸元 (不顯示幣別符號)
            22: { en: 'CFC', point: '+' }, // 中國特殊幣 (不顯示幣別符號)
            23: { en: 'RUB', point: '>' }, // 俄羅斯盧布
            24: { en: 'PLN', point: '<' }, // 波蘭茲羅提
            25: { en: 'DIMC', point: '[' }, // 鑽石幣(越南盾)1 VND=0.1 DIMC
            26: { en: 'GODC', point: ']' }, // 黃金幣(越南盾) 1 VND=200 GODC
            27: { en: 'mBTC', point: 'A' }, // 比特幣(m) 虛擬貨幣(1mBTC=0.001BTC)
            28: { en: 'mETH', point: 'B' }, // 以太幣(m) 虛擬貨幣(1mETH=0.001ETH)
            29: { en: 'EOS', point: 'C' }, // 柚子幣 虛擬貨幣
            30: { en: 'mLTC', point: 'D' }, // 萊特幣(m) 虛擬貨幣(1mLTC=0.001LTC)
            31: { en: 'KHR', point: '?' }, // 柬埔寨幣
            32: { en: 'YGB', point: 'E' }, // 虛擬貨幣(1YGB=0.00006RMB)
            33: { en: 'EGC', point: '-' }, // 虛擬貨幣
            34: { en: 'KHR(Moha)', point: '-' } // 柬埔寨幣For Moha系統商
        };

        // 若沒帶幣別進來或是預設 0 的狀況返回空白符號
        if (id === undefined || id === 0) {
            return { en: '', point: '' };
        }

        if (this.dollarsign === 'N') {
            return { en: 'Empty', point: '-' };
        }

        return currencyObj[id];
    }
}
