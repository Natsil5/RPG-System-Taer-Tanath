/*Import des autres fichiers*/
import { d12Actor } from"./sheets/d12actor.js";
import { d12ActorSheet } from "./sheets/d12actorsheet.js";
import { d12Item } from "./sheets/d12item.js";
import { d12ItemSheet } from "./sheets/d12itemsheet.js";

/*Initialisation du Template*/
Hooks.once("init", async function() {
    console.log("JDR-Jr | Initialisation du système JDR-Jr");
	CONFIG.Actor.documentClass = d12Actor;
    CONFIG.Item.documentClass = d12Item;

    CONFIG.Combat.initiative = {
	    formula: "1d6",//formule pour l'initiative des personnage
	    decimals: 2
	};

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("d12", d12ItemSheet, { makeDefault: true });

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("d12", d12ActorSheet, { makeDefault: true });
});

