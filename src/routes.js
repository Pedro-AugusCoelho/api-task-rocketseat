import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.query

            let query = null

            if (title) {
                query = {
                    title: decodeURIComponent(title),
                }
            }

            if (description) {
                query = {
                    ...query,
                    description:  decodeURIComponent(description)
                }
            }
            
            const tasks = database.select('tasks', query)
 
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const task = ({
              id: randomUUID(),
              title,
              description,
              completed_at: null,
              created_at: new Date(),
              updated_at: new Date(),
            })
        
            database.insert('tasks', task)
        
            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
           const { id } = req.params

           const { title, description } = req.body

           if (title && description) {
                const returnData = database.update('tasks', id, { title, description})
                if (returnData) {
                    return res.writeHead(204).end()
                } else {
                    return res.writeHead(400).end('Registro não existe')
                }
           } else {
                return res.writeHead(400).end('Não foi informado título ou descrição da tarefa')
           }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const returnData = database.completed('tasks', id)
            if (returnData) {
                return res.writeHead(204).end()
            } else {
                return res.writeHead(400).end('Registro não existe')
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
           const { id } = req.params

           const returnData = database.delete('tasks', id)

           if (returnData) {
                return res.writeHead(204).end()
           } else {
                return res.writeHead(400).end('Registro não existe')
           }
        }
    },
]