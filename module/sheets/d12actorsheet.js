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
      console.log(`taerTanath | Récupération du fichier html ${this.actor.type}-sheet.`);
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

      //total competence
      html.find( ".total" ).each(function() {
        var v=$( this ).data('valeur');
        var b=$( this ).data('bonus');
        var t=parseInt(v)+parseInt(b)
        $( this ).html(t)
      });

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
      let vigueur=this.actor.system.attributs.vigueur;
      let coordination=this.actor.system.attributs.coordination;
      let logique=this.actor.system.attributs.logique;
      let empathie=this.actor.system.attributs.empathie;
      let instinct=this.actor.system.attributs.instinct;
      let pouvoir=this.actor.system.attributs.pouvoir;
      if(vigueur=="" || vigueur==undefined){vigueur=1;this.actor.update({"system.attributs.vigueur":1});}
      if(coordination=="" || coordination==undefined){coordination=0;this.actor.update({"system.attributs.coordination":1});}
      if(logique=="" || logique==undefined){logique=1;this.actor.update({"system.attributs.logique":1});}
      if(empathie=="" || empathie==undefined){empathie=1;this.actor.update({"system.attributs.empathie":1});}
      if(instinct=="" || instinct==undefined){instinct=1;this.actor.update({"system.attributs.instinct":1});}
      if(pouvoir=="" || pouvoir==undefined){pouvoir=1;this.actor.update({"system.attributs.pouvoir":1});}

      var pv=parseInt(vigueur*5);
      var pm=parseInt(pouvoir*5);        
      var pvreg=Math.round(parseInt(vigueur)/2);
      var pmreg=Math.round(parseInt(pouvoir)/2);
      this.actor.update({"system.stat.PV.max":pv,"system.stat.PM.max":pm,"system.stat.PV.reg":pvreg,"system.stat.PM.reg":pmreg});
  }
  //lancer de dés
  _onRoll(event){
      let caract = event.target.dataset["caract"];
      let bonus = event.target.dataset["bonus"];
      let valeur = event.target.dataset["valeur"];
      const name = event.target.dataset["name"];
      const img = event.target.dataset["img"];
      let jetdeDesFormule = '1d12';
      let ajout=0;
      if(valeur=="armes"){
          jetdeDesFormule = caract;
      }else {
          if(caract=="vigueur"){
              var base=this.actor.system.attributs.vigueur;
          }else  if(caract=="coordination"){
              var base=this.actor.system.attributs.coordination;
          }else  if(caract=="logique"){
              var base=this.actor.system.attributs.logique;
          }else  if(caract=="empathie"){
              var base=this.actor.system.attributs.empathie;
          }else  if(caract=="instinct"){
              var base=this.actor.system.attributs.instinct;
          }else  if(caract=="pouvoir"){
              var base=this.actor.system.attributs.pouvoir;
          }else{
              var base=0;
          }
          ajout=parseInt(bonus)+parseInt(valeur)
          jetdeDesFormule = parseInt(base)+"d12+"+ajout; //formule du lancer (caract)D12+valeur  
      }
      

      let r = new Roll(jetdeDesFormule);
      console.log(jetdeDesFormule)
      var roll=r.evaluate({"async": false});
      
      if(valeur=="armes"){
          var total=r.total;
      }else{
        var table=r.terms[0].results
          var z=0;
          for (var i = table.length - 1; i >= 0; i--) {
              if(table[i].result>z){
                  z=table[i].result;
              }
          } 
          var total=parseInt(z)+parseInt(ajout)
          var succes="";  
      }
      

      const texte = '<img src="'+img+'"  width="24" height="24"/><span style="left: 5px;top: -7px;position: relative;font-size: 1.2em;">Jet de ' + name + ' : <span style="color: #fff;background: #23221d;padding: 5px;">' +total+'</span></span>' ;//+" - "+succes+" réussite(s)";
      roll.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          flavor: texte
      });
  }
}