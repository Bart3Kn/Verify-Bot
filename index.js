const Discord = require('discord.js');
const client = new Discord.Client();

const token = 'NzUxMTcyNjI3MjYzMTI3NjAz.X1FOBg.8_4oShaWbvQJDJHHY6HIBX-K98A';
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { serviceusage_v1beta1 } = require('googleapis');

client.on('ready',() =>{
    console.log('Launching')
})

let output;

client.on('message', msg=>{

    lolFuckJs(msg);
    
})

async function lolFuckJs(msg){
    output = 'kekw'
    if(msg.channel.id === '751191947472928828'){

        if(msg.author.id !== client.user.id){
            
            const input = msg.content;

            await accessSpreadsheet(msg, input);
        
            console.log(msg.content)
            console.log('in the main fucntion: ',output);
            
            if(output === 'nUSED'){
                    
                    msg.delete();
                    client.channels.cache.get('751176566851239986').send('<@'+msg.member.id+'>'+' Hello there');
                    let { cache } = msg.guild.roles;
                    let mRole = cache.find(role => role.name.toLocaleLowerCase() === 'member');
                    msg.member.roles.add(mRole);
            }   

            else if(output == 'USED'){
                msg.delete();
                msg.reply('This ID has already been used, if you believe this is an error, message Bartek#1337 or paypal.me/Bart3kn'); 

            }
            else{
                msg.delete();
                msg.reply('Try again');
            }
        }
    }
}

async function accessSpreadsheet(msg, userID){

    const doc = new GoogleSpreadsheet('1tAAkyxHc889A6pXTkDO-atJC5p5n9ftNvNr6yP4waM8');
    await doc.useServiceAccountAuth(require('./client_secret.json'));
    await doc.loadInfo();

    const sheet = doc.sheetsById[0];

    await sheet.loadCells('A1:E1000');
    const cellA1 = sheet.getCell(0, 0);
    
    for (let index = 2; index <= sheet.rowCount; index++) {
        let fName = 'A' + index;
        let sName = 'B' + index;
        let id = 'C' + index;
        let status = 'D' + index;
        let discID = 'E' + index;

        if(sheet.getCellByA1(id).value == userID){
            if(sheet.getCellByA1(status).value == 'TRUE'){
                output = 'USED'
                console.log('outputting: USED');
                //await firstAsync();
                return output;
            }
            else{
                sheet.getCellByA1(status).value = 'TRUE';
                sheet.getCellByA1(discID).value = msg.author.id;
                await sheet.saveUpdatedCells();
                output = 'nUSED'
                console.log('outputting: nUSED');
                //await firstAsync();
                return output;
            }
        }
     }
}

async function firstAsync() {
    let promise = new Promise((res, rej) => {
        setTimeout(() => res("Now it's done!"), 1000)
    });

    // wait until the promise returns us a value
    let result = await promise; 
  
}

client.login(token);