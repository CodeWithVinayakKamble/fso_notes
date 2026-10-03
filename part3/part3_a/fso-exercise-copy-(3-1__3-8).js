const express = require('express');
const morgan = require('morgan');


const app = express();

morgan.token('body', (request, response) => {
    return JSON.stringify(request.body);
});

app.use(express.json());

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);


let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];


app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend</h1>')
});

app.get('/api/persons', (request, response) => {
    response.json(persons)
});

const getDate = () => {
    let currentDate = new Date();
    return `${currentDate}`
};

app.get('/info', (request, response) => {
    response.send(`<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${getDate()}</p>
        </div>`)
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    if (!person) {
        return response.status(404).end()
    }
    response.json(person)
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);
    response.status(204).end()
});


const generateNewId = () => {
    const newId = String(Math.floor(Math.random() * 1000000));
    return newId;
};

app.post('/api/persons', (request, response) => {

    const body = request.body;

    if (!body.name) {
        return response.status(400).json({ error: "Name missing" })
    }

    if (!body.number) {
        return response.status(400).json({ error: "Number missing" })
    }

    const nameExist = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase());
    if (nameExist) {
        return response.status(400).json({ error: "Name must be unique" })
    }

    let newPersonObject = {
        id: generateNewId(),
        name: body.name,
        number: body.number
    };

    persons = [...persons, newPersonObject];
    response.json(newPersonObject);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server is live on : http://localhost:${PORT}`);
});