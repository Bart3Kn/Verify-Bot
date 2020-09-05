const { GoogleSpreadsheet } = require('google-spreadsheet');

async function accessSpreadsheet(){

    const doc = new GoogleSpreadsheet('1tAAkyxHc889A6pXTkDO-atJC5p5n9ftNvNr6yP4waM8');
    await doc.useServiceAccountAuth(require('./client_secret.json'));
    await doc.loadInfo();

    const sheet = doc.sheetsById[0];

    await sheet.loadCells('A1:D1000');
    const cellA1 = sheet.getCell(0, 0);
    
    for (let index = 2; index <=sheet.rowCount; index++) {
        let fName = 'A'+index;
        let sName = 'B'+index;
        let id = 'C'+index;
        let check = 'D'+index;
        
        if(sheet.getCellByA1(id).value=='1713314'){
            sheet.getCellByA1(check).value = 'true';
            console.log(id,'  ',check)
            await sheet.saveUpdatedCells();
            break
        }
     }
     await sheet.saveUpdatedCells();
}

accessSpreadsheet()