import pg from "pg"
import {DBException} from "./Wrappers.js"
//import { host, port, database, user, password } from "../config/config.js"
//import { host, port, database, user, password } from "/etc/secrets/config.js"
import pkg from '/etc/secrets/config.js';
const { host, port, database, user, password } = pkg;

const { Pool } = pg;

const poolPG = new Pool({
    host,
    port,
    database,
    user,
    password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

export class DB {

    static async queryRow(queryText, ...args) {
        try {
            const clientPG = await poolPG.connect()
            const rows = await clientPG.query(queryText, args).then(value => value.rows)
            clientPG.release()
            return rows[0]
        } catch(e) {
            throw new DBException(`\nQUERY: ${queryText}\n -> WITH ARGS: ${args}\nERROR: ${e.message}`)
        } finally {
        }
    }
    
    static async queryRows(queryText, ...args) {
        try {
            const clientPG = await poolPG.connect()
            const rows = await clientPG.query(queryText, args).then(value => value.rows)
            clientPG.release()
            return rows
        } catch(e) {
            throw new DBException(`\nQUERY: ${queryText}\n -> WITH ARGS: ${args}\nERROR: ${e.message}`)
        } finally {
        }
    }    
}