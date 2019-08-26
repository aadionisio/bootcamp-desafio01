const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let numRequests = 0;

function logRequests(req, res, next) {
  numRequests++;

  console.log(`O numero de requisições é: ${numRequests}`);

  return next();
}

server.use(logRequests);

function checkExistsId(req, res, next) {
  const { id } = req.body;

  const exists = projects.find(p => p.id === id);

  if (!exists) {
    return res.status(400).json({ message: "Project not found" });
  }

  next();
}

server.get("/projects", (req, res) => {
  return res.send(projects);
});

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkExistsId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.put("/projects/:id", checkExistsId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  // localizando dentro do array o registro com o conteudo do campo ID igual ao enviado no parametro
  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkExistsId, (req, res) => {
  const { id } = req.params;
  // localizando dentro do array o registro com o conteudo do campo ID igual ao enviado no parametro
  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3000);
