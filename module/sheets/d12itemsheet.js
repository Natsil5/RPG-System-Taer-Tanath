/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Item}
 */
 export class d12ItemSheet extends ItemSheet{
    get template(){
        console.log(`d12 | Récupération du fichier html ${this.item.type}-sheet.`);
        if(this.item.type=='peuple' || this.item.type=='metier' || this.item.type=='avantage' || this.item.type=='desavantage' || this.item.type=='talent'){
            return `systems/d12/templates/sheets/base-sheet.html`;
        }else {
            return `systems/d12/templates/sheets/${this.item.type}-sheet.html`;
        }
    }


    getData(){
        const data = super.getData();
        data.dtypes = ["String", "Number", "Boolean"];
        console.log(data);

        return data;
    }
}