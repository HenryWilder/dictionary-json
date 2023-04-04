export interface ITone {
    impliedTone?: 'pos'|'neg'|'neu';
    possibleTones?: Set<('pos'|'neg'|'neu')>;
    intensity?: 'ex'|'hi'|'lo';
}
export interface IWord {
    tone: ITone;
}
export interface IWordSet {
    [word: string]: IWord;
}
export interface IEnglishDictionary {
    adjective: IWordSet;
    // adverbs: IWordSet;
    // article: IWordSet;
    // conjunction: IWordSet;
    // determiner: IWordSet;
    // interjection: IWordSet;
    noun: IWordSet;
    // numeral: IWordSet;
    // participle: IWordSet;
    // preposition: IWordSet;
    // pronoun: IWordSet;
    verb: IWordSet;
}
export const partsOfSpeechList = [
    "adjective",
    // "adverb",
    // "article",
    // "conjunction",
    // "determiner",
    // "interjection",
    "noun",
    // "numeral",
    // "participle",
    // "preposition",
    // "pronoun",
    "verb"
];
const defaultDictionary: IEnglishDictionary =
    await fetch('./words.jsonc')
        .then(resp => resp.json())
        .then(data => data);

        
export interface IWordRelationship {
    similar: string[];
    opposite: string[];
}
export interface IEnglishThesaurus {
    [word: string]: IWordRelationship;
}
const defaultThesaurus: IEnglishThesaurus =
    await fetch('./word-relationships.jsonc')
        .then(resp => resp.json())
        .then(data => data);


export interface IWordInfo {
    wordstr: string;
    meaning: IWord;
    related: IWordRelationship|undefined;
}
export const getWordInfo = (searchWord: string): IWordInfo|null => {
    for (const partOfSpeech in partsOfSpeechList) {
        const wordsOfType: IWordSet = defaultDictionary[partOfSpeech];
        if (wordsOfType === undefined) continue;
        const dictionaryResult = wordsOfType[searchWord];
        if (dictionaryResult === undefined) continue;
        const thesaurusResult: IWordRelationship|undefined = defaultThesaurus[searchWord];
        return { wordstr:searchWord, meaning:dictionaryResult, related:thesaurusResult };
    }
    return null;
}
