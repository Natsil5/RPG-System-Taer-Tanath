/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
 export class d12Actor extends Actor {
  prepareData() {
    super.prepareData();
    const actorData = this.system;
    const data = actorData;
    const flags = actorData.flags;
  	if (actorData.type === 'personnage') this._preparePJData(actorData);
  }

  _preparePJData(actorData) {
    const data = actorData.system;
    console.log(`d12 | Préparation Data PJ.\n`);
    console.log(data);    
  }

  prepareBaseData() {
  }

  prepareDerivedData() {
  }
}