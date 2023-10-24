import { DB } from "./DB";

class Mapping {

    static async getHTMLMap() {
        console.log("HTMLMap created")
        return await DB.queryRow(
            "select $1", 42
        )
    }
}

export const HTMLMap = Mapping.getHTMLMap()