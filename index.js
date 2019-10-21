const express = require('express')

const server = express()

server.use(express.json())

var projects = []

const logCount = (req, res, next) => {
    console.count('Números de chamdas na API')
    next()
}

server.use(logCount)

const isString = (req, res, next) => {
    const { id, title } = req.body;
    if ((typeof id !== "string") | (typeof title !== "string")) {
        return res.status(400).json('id and title must be string')
    }
    next()
}

const existProdduct = (req, res, next) => {
    const { id } = req.params
    let projectIndex = projects.findIndex( project => project.id === id )
    if (projectIndex < 0) {
        return res.status(404).json('project not found')
    }
    req.projectIndex = projectIndex
    next();
}

server.get('/projects', (req, res) => {
    return res.json(projects)
})

server.get('/projects/:id', existProdduct, (req, res) => {
    const projectIndex = req.projectIndex
    return res.json(projects[projectIndex])
})

server.post('/projects', isString, (req, res) => {
    let project = req.body
    project.tasks = []
    projects.push(project)
    return res.status(201).json('Dados cadastrados com sucesso')
})

server.put('/projects/:id', existProdduct, (req, res) => {
    const { id } = req.params
    const { title } = req.body
    const projectIndex = req.projectIndex

    if (projectIndex >= 0) {
        projects.find( project => {
            if (project.id === id ){
                project.title = title
                projects[projectIndex] = project
                return projects
            } 
        })
        return res.status(200).json('Dados alterados com sucesso')
    }
})

server.delete('/projects/:id', existProdduct, (req, res) => {
    const projectIndex = req.projectIndex
    if (projectIndex >= 0) {
        projects.splice(projectIndex, 1)
        return res.status(204).json({})
    }
})

server.post('/projects/:id/tasks', existProdduct, (req, res) => {
    const { id } = req.params
    const { title } = req.body
    const projectIndex = req.projectIndex

    if (projectIndex >= 0) {
        projects.find( project => {
            if (project.id === id ){
                project.tasks.push(title)
                projects[projectIndex] = project
                return
            } 
        })
        return res.status(200).json('Dados alterados com sucesso')
    }
})


server.listen(3000)
