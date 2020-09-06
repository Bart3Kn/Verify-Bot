//FOR SERVER USE
const Discord = require('discord.js');
const client = new Discord.Client();

const token = 'NzUxMTcyNjI3MjYzMTI3NjAz.X1FOBg.5BLLC516TETPmlw4ExBxcSY70_Y';
const doc = new GoogleSpreadsheet('1tAAkyxHc889A6pXTkDO-atJC5p5n9ftNvNr6yP4waM8');

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { serviceusage_v1beta1 } = require('googleapis');


//TO UPDATE THE BOT DATA AND CHANNEL
const verifyChannel = '751949524037271633';
const welcomeChanel = '597892982565371907';
const regexTest = /^(\d{7})$/;


client.on('startup',() =>{ //Launch message for the bot
    console.log('Verify is now launching')
})

client.on('message', msg => {
    await IDCHECKR(msg);
})

async function IDCHECKR(msg){
    if(msg.author != client.user && msg.channel.id==verifyChannel){ //correct channel 
        output = null; //resets output from previous test
        let checkedMsg = msg.content.match(regexTest);
        if(checkedMsg != null){ //checks if message is actually a brunel ID
            //ID is found, running check
            await accessSpreadsheet(msg, checkedMsg);
        }
        else{ //was not able to find a valid ID in message
            msg.reply('Could not find an ID in the message, please only type in your ID').then(msg => {
                msg.delete(3000)
            }).catch(console.log('Error Deleting the message'))

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

        if(sheet.getCellByA1(id).value == userID){ //USED ID EXISTS IN SPREADSHEET
            
            if(sheet.getCellByA1(status).value == 'TRUE'){ //ID IS ALREADY USED

                msg.reply('ID is in use, message Bartek#1337 to sort this out').then(msg => {
                    msg.delete(3000)
                }).catch(console.log('Error Deleting the message'))

            }
            else{ //ID IS NOT USED
                sheet.getCellByA1(status).value = 'TRUE'; 
                sheet.getCellByA1(discID).value = msg.author.id;
                await sheet.saveUpdatedCells();

                msg.reply('ID found, adding role now').then(msg => {
                    msg.delete(3000)
                }).catch(console.log('Error Deleting the message'))
                
                let { cache } = msg.guild.roles;
                let mRole = cache.find(role => role.name.toLocaleLowerCase() === 'member');
                msg.member.roles.add(mRole);

                msg.reply('Role has been added').then(msg => {
                    msg.delete(3000)
                }).catch(console.log('Error Deleting the message'))

            }
        }
        else{ //USED ID DOESN'T EXISTS IN SPREADSHEET
        msg.reply('Could not find your ID in the spreadsheet, message Bartek#1337 to update it').then(msg => {
            msg.delete(3000)
        }).catch(console.log('Error Deleting the message'))
        }
     }
}

client.login(token)