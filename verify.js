//FOR SERVER USE
const Discord = require('discord.js');
const client = new Discord.Client();

const token = 'NzUxMTcyNjI3MjYzMTI3NjAz.X1FOBg.ojQ5DpGnAWbYaODwIQ8YnLhbHeM';

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { serviceusage_v1beta1 } = require('googleapis');


//TO UPDATE THE BOT DATA FOR CHANNELS + REGEX
const verifyChannel = '751949524037271633';
const welcomeChanel = '597892982565371907';
const regexTest = /(\d{7})/;

client.on('message', msg => {
    if(msg.author.id != client.user.id){
        IDCHECKR(msg);
    }
})

async function IDCHECKR(msg){

    if(msg.author.id != client.user.id && msg.channel.id==verifyChannel){ //correct channel 
        console.log('initialinput: ',msg.content)
        let MSG = msg.content;
        console.log('MSG.content: ', MSG);
        var checked;
        var flag = false;
            checked = MSG.match(regexTest);
            flag = true;
            if(msg.content != null && flag == true && checked != null){ //checks if message is actually a brunel ID //ADD REGEX TO THIS AFTER
                //ID is found, running check
                var ID = checked[0];
                console.log('Checking Spreadsheet');
                accessSpreadsheet(msg, ID);
                
            }
            else{ //was not able to find a valid ID in message
                console.log('unable to find ID: ', msg.content)
                msg.reply('Could not find an ID in the message, please only type in your ID').then(msg => {
                    msg.delete({ timeout: 10000 })
                  })
                  .catch(console.error);
                msg.delete();
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
        exist0 = 1;

        if(sheet.getCellByA1(id).value != null){
            var exist0 = sheet.getCellByA1(id).value.localeCompare(userID);
            console.log(sheet.getCellByA1(fName).value,'a:', exist0, typeof exist0);
        }
        else{
            msg.reply('ID is not in the database, ask Bartek#1337 to update it').then(msg => {
                msg.delete({ timeout: 10000 })
              })
              .catch(console.error);
            console.log('Reached end of data inputs');
            msg.delete();
            break
        }
        
        if(exist0 === 0 || exist0 == 0 ){ //USED ID EXISTS IN SPREADSHEET
         
            if(sheet.getCellByA1(status).value == 'TRUE'){ //ID IS ALREADY USED
    
                msg.reply('ID is in use, message Bartek#1337 to sort this out').then(msg => {
                    msg.delete({ timeout: 10000 })
                  })
                  .catch(console.error);
                msg.delete();
                break
            }

            else if(sheet.getCellByA1(status).value == 'FALSE'){ //ID IS NOT USED
                sheet.getCellByA1(status).value = 'TRUE'; 
                sheet.getCellByA1(discID).value = msg.author.id;
                await sheet.saveUpdatedCells();
    
                msg.reply('ID found, adding role now').then(msg => {
                    msg.delete({ timeout: 10000 })
                  })
                  .catch(console.error);
                
                let { cache } = msg.guild.roles;
                let mRole = cache.find(role => role.name.toLocaleLowerCase() === 'member');
                let gRole = cache.find(role => role.name.toLocaleLowerCase() === 'guest');
                try {
                    msg.member.roles.add(mRole);
                    msg.member.roles.remove(gRole);
                    msg.reply('Role has been added').then(msg => {
                        msg.delete({ timeout: 10000 })
                      })
                      .catch(console.error);
                    msg.delete();
                break
                } catch (error) {
                    msg.reply('Error adding role').then(msg => {
                        msg.delete({ timeout: 10000 })
                      })
                      .catch(console.error);
                }
                
    
                
            }
        }
        else if(index == sheet.rowCount){ //USED ID DOESN'T EXISTS IN SPREADSHEET
            console.log('ID not found in sheet')
            msg.reply('Could not find your ID in the spreadsheet, message Bartek#1337 to update it').then(msg => {
                msg.delete({ timeout: 10000 })
              })
              .catch(console.error);
            msg.delete();
            break
        }
     }
}
 
client.login(token)