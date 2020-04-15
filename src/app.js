const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkIdExist(id) {
	const repositoryIndex = repositories.findIndex(repository => repository.id == id)
	return repositoryIndex === -1 ? -1 : repositoryIndex
}

app.get("/repositories", (request, response) => {
	return response.json(repositories)
});

app.post("/repositories", (request, response) => {
	const { title, url, techs } = request.body
	const repository = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0,
	}
	repositories.push(repository)
	return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
	const { id } = request.params
	repositoryIndex = checkIdExist(id)

	if (repositoryIndex === -1)
		return response.status(400).json('Repository does not exist')

	const { title, url, techs } = request.body
	const repository = {
		id,
		title,
		url,
		techs,
		likes: repositories[repositoryIndex].likes,
	}

	repositories[repositoryIndex] = repository
	return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
	const { id } = request.params
	repositoryIndex = checkIdExist(id)

	if (repositoryIndex === -1)
		return response.status(400).json('Repository does not exist')

	repositories.splice(repositoryIndex, 1)

	return response.status(204).json()
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params
	repositoryIndex = checkIdExist(id)
	if (repositoryIndex === -1)
		return response.status(400).json('Repository does not exist')

	like = repositories[repositoryIndex].likes += 1

	const repository = {
		id,
		title: repositories[repositoryIndex].title,
		url: repositories[repositoryIndex].url,
		techs: repositories[repositoryIndex].techs,
		likes: like
	}

	repositories[repositoryIndex] = repository

	return response.json(repository)
});

module.exports = app;
