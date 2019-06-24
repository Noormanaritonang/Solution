const fs = require("fs");
const rp = require('request-promise');
const $ = require('cheerio');
const Promise = require("bluebird");
const url='https://www.bankmega.com';
const urlScrapping = 'https://www.bankmega.com/promolainnya.php?';

global.kategoris;
global.links=[];
global.data = {};
global.func = [];
const page = [5,7,14,1,0,1];

async function get(i,kategori){
    tmp=[];
    var konten = [];
    for(let j=1;j<=page[i-1];j++){
        await rp(urlScrapping+"&subcat="+i+"&page="+j).then(async function(html){
                for(let k = 0;k<6;k++){
                    try{
                        var link_tmp = await url+"/"+$('#promolain > li > a',html)[k].attribs.href;
                        await rp(link_tmp).then(async function(html){    
                            console.clear();
                            console.log("Scrapping Data Bank Mega");
                            console.log("Scrapping Kategori : "+kategori);
                            tmp = {
                                    title:  $('.titleinside > h3', html).text(),
                                    link: link_tmp,
                                    area:  $('.area > b', html).text(),
                                    periode:  $('.periode > b',html).text(),
                                    image:   url+$('img',html)[11].attribs.src
                                    
                                }
                                konten.push(tmp);
                            });
                    }catch(err){
                        k++;
                    }
                }
            });
        data[kategori] = konten;
    }        
}

async function main(){
    for(let i=1;i<7;i++){
        await rp(urlScrapping+"&subcat="+i).then(async function(html){
                    kategoris = $('#subcatselected >  img',html)[0].attribs.title;
        })
        func.push(get(i,kategoris));        
    }
    Promise.all(func).then(function(){
        obj = JSON.stringify(data,null,2);
        fs.writeFile("./solution.json", obj, (err) => {
            if (err) {
                console.error("Gagal Menulis file ke dalam JSON...");
                return;
            };
            console.clear();
            console.log("Scrapping Bank Mega Selesai Lihat Hasil dalam Folder")
        });
    },function(){
        console.log("Fail...");
    });
}

main();