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
        console.log(`Liber | Récupération du fichier html ${this.actor.type}-sheet.`);
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
        html.find('.jetdedes').click(this._onRoll.bind(this));

    }


    getItemFromEvent = (ev) => {
        const parent = $(ev.currentTarget).parents(".item");
        return this.actor.items.get(parent.data("itemId"));
    }

    _onItemEdit(event){
        const item = this.getItemFromEvent(event);
        item.sheet.render(true);
    }
    async _onStat(event){
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
        let monJetDeDes = event.target.dataset["dice"];
        let nbdes = event.target.dataset["attdice"];
        const name = event.target.dataset["name"];
        const jetdeDesFormule = nbdes+"d12"; //formule du lancer

        let r = new Roll(nbdes+"d6");
        var roll=r.evaluate({"async": false});
        let retour=r.result; 
        var succes="";

        const texte = "Jet de " + name + " : " +jetdeDesFormule ;//+" - "+succes+" réussite(s)";
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: texte
        });
    }
}