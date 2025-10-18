/**
 * %_ko_%한국어%_ja_%...%_en_%... 형식의 문자열을 파싱합니다.
 * @param {string} str - 파싱할 문자열
 * @param {string} lang - 'ko', 'en', 'ja' 등 현재 언어 코드
 * @param {string} [fallbackLang='en'] - 기본 언어
 * @returns {string} - 현재 언어에 맞는 문자열
 */
const parseMultilingual = (str, lang, fallbackLang = 'en') => {
    if (typeof str !== 'string' || !str.startsWith('%_')) {
        return str; // 일반 문자열이면 그대로 반환
    }

    // 정규식을 사용해 언어별로 텍스트를 추출합니다.
    const regex = /%_([a-z]{2})_%(.*?)(?=%_|$)/g;
    const translations = {};
    let match;

    while ((match = regex.exec(str)) !== null) {
        // match[1] = 언어 코드 (예: 'ko'), match[2] = 텍스트
        translations[match[1]] = match[2];
    }

    // 현재 언어 -> 기본 언어 -> 'en' -> 첫 번째 값 -> 원본 순서로 반환
    return translations[lang]
        || translations[fallbackLang]
        || translations['en']
        || (Object.keys(translations).length > 0 ? Object.values(translations)[0] : str);
};

/**
 * API 응답 데이터(객체 또는 배열)를 재귀적으로 순회하며
 * 모든 다국어 문자열을 현재 언어의 문자열로 변환합니다.
 * @param {*} data - API 응답 원본
 * @param {string} lang - 현재 언어 코드
 * @returns {*} - 변환된 데이터
 */
export const translateData = (data, lang) => {
    if (!data) return data;

    // 1. 배열인 경우
    if (Array.isArray(data)) {
        return data.map(item => translateData(item, lang));
    }

    // 2. 객체인 경우 (JSON Schema의 'properties' 포함)
    if (typeof data === 'object') {
        const newObj = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // 재귀적으로 내부 값 변환
                newObj[key] = translateData(data[key], lang);
            }
        }
        return newObj;
    }

    // 3. 문자열인 경우
    if (typeof data === 'string') {
        return parseMultilingual(data, lang);
    }

    // 4. 그 외 (숫자, 불리언 등)
    return data;
};