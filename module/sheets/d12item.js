/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Item}
 */
 export class d12Item extends Item {
  static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["d12", "sheet", "item"],
          width: 600, //tailles des fiches items
          height: 400,
        });
    }
	/** @override */
  prepareData() {
    super.prepareData();
    const itemData = this.system;
    const data = itemData;
    const flags = itemData.flags;
  	if (itemData.type === 'arme') this._prepareItemData(itemData);
    if (itemData.type === 'talent') this._prepareItemData(itemData);
    if (itemData.type === 'faiblesse') this._prepareItemData(itemData);
    if (itemData.type === 'objet') this._prepareItemData(itemData);
    if (itemData.type === 'magie') this._prepareItemData(itemData);
  }

  _prepareItemData(itemData) {
    const data = itemData.system;
  }


  prepareBaseData() {
  }

  prepareDerivedData() {
  }
}