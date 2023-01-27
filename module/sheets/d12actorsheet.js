/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
 export class d12ActorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["d12", "sheet", "actor"],
          width: 1000, //defini la auteur et la largeurs de la fiche de perso
          height: 800,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    get template() {
        console.log(`liber | Récupération du fichier html ${this.actor.type}-sheet.`);
        if(this.actor.type=='pnj' || this.actor.type=='personnage'){
            return `systems/d12/templates/sheets/personnage-sheet.html`;
        }else {
            return `systems/d12/templates/sheets/${this.actor.type}-sheet.html`;
        }
    }

    getData(){
        const data = super.getData();
        data.dtypes = ["String", "Number", "Boolean"];
        console.log(data);        
		if (this.actor.type == 'personnage' || this.actor.type == 'pnj' || this.actor.type == 'monstre') { //les différents types d'actor
			this._prepareCharacterItems(data);
		}
        if (this.actor.type == 'personnage' || this.actor.type == 'pnj' ) {
            this._onStat(data);
        }
        console.log(data);
        return data;
    }
   
	_prepareCharacterItems(sheetData) {
        const actorData = sheetData.actor;

        // Initialize containers. Liste des différents items
        const peuple = [];
        const metier = [];
        const arme = [];
        const armure = [];
        const inventaire = [];
        const sort = [];
        const avantage = [];
        const desavantage = [];
        const competence = [];
        const talent = [];

        // Iterate through items, allocating to containers. Tri des différents items
        for (let i of sheetData.items) {
          let item = i.items;
          i.img = i.img || DEFAULT_TOKEN;
          if (i.type === 'peuple') {
            peuple.push(i);
          }else  if (i.type === 'metier') {
            metier.push(i);
          }else if (i.type === 'arme') {
            arme.push(i);
          }else if (i.type === 'armure') {
            armure.push(i);
          }else if (i.type === 'objet') {
            inventaire.push(i);
          }else if (i.type === 'magie') {
            sort.push(i);
          }else if (i.type === 'avantage') {
            avantage.push(i);
          }else if (i.type === 'desavantage') {
            desavantage.push(i);
          }else if (i.type === 'competence') {
            competence.push(i);
          }else if (i.type === 'talent') {
            talent.push(i);
          }
          
        }

        // Assign and return, assination des items
        actorData.peuple = peuple;
        actorData.metier = metier;
        actorData.arme = arme;
        actorData.armure = armure;
        actorData.inventaire = inventaire;
        actorData.sort = sort;
        actorData.avantage = avantage;
        actorData.desavantage = desavantage;
        actorData.competence = competence;
        actorData.talent = talent;
    }


    activateListeners(html){
        super.activateListeners(html);
        //edition items
        html.find('.item-edit').click(this._onItemEdit.bind(this));

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.delete();
            li.slideUp(200, () => this.render(false));
        });

        //Jet de des
        html.find('.item-utiliser').click(this._onRoll.bind(this));

    }


    getItemFromEvent = (ev) => {
        const parent = $(ev.currentTarget).parents(".item");
        return this.actor.items.get(parent.data("itemId"));
    }

    _onItemEdit(event){
        const item = this.getItemFromEvent(event);
        item.sheet.render(true);
    }
    _onStat(event){
      let vigueur=this.actor.system.vigueur;
      let pouvoir=this.actor.system.pouvoir;
      var pv=parseInt(vigueur*5);
      var pm=parseInt(pouvoir*5);
      var pvreg=Math.round(parseInt(vigueur)/2)
      var pmreg=Math.round(parseInt(pouvoir)/2)
      this.actor.update({"system.PV.max":pv,"system.PM.max":pm,"system.PV.reg":pvreg,"system.PM.reg":pmreg})
    }

    //lancer de dés
    _onRoll(event){
        let caract = event.target.dataset["caract"];
        let bonus = event.target.dataset["bonus"];
        let valeur = event.target.dataset["valeur"];
        const name = event.target.dataset["name"];
        const img = event.target.dataset["img"];
        if(caract=="vigueur"){
            var base=this.actor.system.vigueur;
        }else  if(caract=="coordination"){
            var base=this.actor.system.coordination;
        }else  if(caract=="logique"){
            var base=this.actor.system.logique;
        }else  if(caract=="empathie"){
            var base=this.actor.system.empathie;
        }else  if(caract=="instinct"){
            var base=this.actor.system.instinct;
        }else  if(caract=="pouvoir"){
            var base=this.actor.system.pouvoir;
        }else{
            var base=0;
        }
        var ajout=parseInt(bonus)+parseInt(valeur)
        const jetdeDesFormule = parseInt(base)+"d12+"+ajout; //formule du lancer (carta)D12+valeur

        let r = new Roll(jetdeDesFormule);
        var roll=r.evaluate({"async": false});
        var table=r.terms[0].results
        console.log(table); 
        var z=0;
        for (var i = table.length - 1; i >= 0; i--) {
            if(table[i].result>z){
                z=table[i].result;
            }
        } 
        var total=parseInt(z)+parseInt(ajout)
        var succes="";

        const texte = '<img src="'+img+'"  width="24" height="24"/><span style="left: 5px;top: -7px;position: relative;font-size: 1.2em;">Jet de ' + name + ' : <span style="color: #fff;background: #23221d;padding: 5px;">' +total+'</span></span>' ;//+" - "+succes+" réussite(s)";
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: texte
        });
    }
}