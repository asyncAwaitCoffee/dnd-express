import { Router } from "express";
import * as handlers from "./rout_handlers.js";
import * as account from "./rout_account.js"
import * as character from "./rout_character.js"
import * as inventory from "./rout_inventory.js"
import * as game from "./rout_game.js"
import * as magic from "./rout_magic.js"
import * as feature from "./rout_features.js"

const router = new Router();

//регистрация
router.get("/auth/signup", account.signup_GET)
router.post("/auth/signup", account.signup_POST)
router.get("/auth/login", account.login_GET)
router.post("/auth/login", account.login_POST)
router.get("/auth/logout", account.logout_GET)

//информация об аккаунте
router.get("/account/info", account.account_GET)
router.get("/account/list-of-characters", character.getCharactersList_GET)

//взаимодействие с персонажем
//router.post("/account/character/effects", character.applyEffects)
router.get("/account/character/restore-hp", character.restoreHP)
router.get("/account/character/rest", character.longRest_GET)

//информация о персонаже
router.get("/account/character/info", character.getCharacter_GET)
//router.get("/account/api/character/stats", character.apiStats_GET)

//инвентарь персонажа
router.get("/account/inventory/equip", inventory.equipItem_GET)
router.get("/account/inventory/unequip", inventory.unequipItem_GET)
router.get("/account/inventory/delete", inventory.deleteItem)
router.get("/account/inventory/use", inventory.useItem)
router.get("/account/inventory/spend", inventory.spendItem)

//магия и навыки
router.get("/account/character/cast-spell", magic.castSpell)
router.get("/account/character/activate-feature", feature.activateClassFeature)
router.post("/account/custom-feature-add", feature.addCustomFeature_POST)
//router.get("/account/character/features", feature.getCustomFeature_GET)
router.get("/account/character/delete-custom-feature", feature.deleteCustomFeature_GET)

//создание нового персонажа
router.get("/account/new-character", character.newCharacter_GET)
router.get("/account/character/delete", character.deleteCharacter_GET)
router.post("/account/new-character", character.newCharacter_POST)

//игра
router.get("/account/game/next-round", game.nextRound)

//домашняя
router.get("/", handlers.home_GET)

export { router };