import GetProjectInfo from 'base/GetProjectInfo';

/**
 * 設定當前語系
 * @param {Array} langs 設定檔的所有語系設定
 * @return {String} 當前語系
 */
export default function getCurLangID(langs) {
    const curLang = GetProjectInfo.getUrlParams().language;

    return (langs.indexOf(curLang) === -1) ? 'zh-tw' : curLang;
}
