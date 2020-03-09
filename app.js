'use strict'; //node.jsはファイルの読み書きは苦手なため、長いコードになる
//1 ファイルの読み込み
const fs = require('fs'); //読み込む
const readline = require('readline'); //
const rs = fs.createReadStream('./popu-pref.csv'); //どのファイルを読み込むか指定
const rl = readline.createInterface({ 'input': rs, 'output': {} });　//inputとoutputを指定
const prefectureDataMap = new Map();　//データ列の作成
rl.on('line', (lineString) => {　//１行分の文字列
  return(lineString);
});

//2010年と2015年を分ける
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
       let value = prefectureDataMap.get(prefecture);　//データ列の作成
       if (!value) {
           value = {
               popu10: 0,
               popu15: 0,
               change: null
           };
       }
       if (year === 2010) {
           value.popu10 = popu;
       }
       if (year === 2015) {
           value.popu15 = popu;
       }
       prefectureDataMap.set (prefecture, value);
    }
});

rl.on('close', () => {  //close は全ての処理が終わった後に反映
    for (let [key, value] of prefectureDataMap) { 　 //keyは都道府県、valueは数字たち
        value.change = value.popu15 / value.popu10;
      }
      const rankingArray = Array.from(prefectureDataMap).sort((pairs1, pairs2) => {
          return pairs2[1].change - pairs1[1].change;
      });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return `${key}:${value.popu10} => ${value.popu15} 変化率:${value.change}`;
    });
    console.log(rankingStrings);
    });