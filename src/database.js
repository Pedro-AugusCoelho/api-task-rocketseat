import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []
        
        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key , value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data] 
        }

        this.#persist()

        return data
    }

    update(table, id, data, isCompleted) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        const findTask = this.#database[table].find(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {
                id,
                title: data.title,
                description: data.description,
                completed_at: findTask.completed_at,
                updated_at: new Date(),
                created_at: findTask.created_at,
            }
            this.#persist()
            return true
        } else {
            return false
        }
    }

    completed(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        const findTask = this.#database[table].find(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {
                id,
                title: findTask.title,
                description: findTask.description,
                completed_at: findTask.completed_at ? null : new Date(),
                updated_at: new Date(),
                created_at: findTask.created_at,
            }
            this.#persist()
            return true
        } else {
            return false
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
            return true
        } else {
            return false
        }
    }
}