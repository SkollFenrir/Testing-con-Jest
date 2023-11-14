const request = require('supertest');
const server = require('../index');

describe('Operaciones CRUD de cafes', () => {
	it('Obteniendo status 200, tipo de dato y con al menos 1 objeto ', async () => {
		const response = await request(server).get('/cafes').send();
		expect(response.statusCode).toBe(200);
		expect(response.body).toBeInstanceOf(Array);
		expect(response.body.length).toBeGreaterThan(0);
	});

	it('Obteniendo status 404 al intentar eliminar con un id inexistente', async () => {
		const jwt = 'pseudoToken';
		const idToDelete = 5; // numero id inexistente
		const { statusCode } = await request(server)
			.delete(`/cafes/${idToDelete}`)
			.set('Authorization', jwt)
			.send();
		expect(statusCode).toBe(404);
	});

	it('Obteniendo status 201', async () => {
		const id = Math.floor(Math.random() * 999);
		const cafe = { id, nombre: 'Nuevo café' };
		const { statusCode, body } = await request(server)
			.post('/cafes')
			.send(cafe);
		expect(body).toContainEqual(cafe); // Adicional al desafio, pero queria ver si se creaba
		expect(statusCode).toBe(201);
	});

	it('Obteniendo un status 400, se intenta actualizar con un id enviado en parametros que no corresponde con id del payload', async () => {
		const firstId = Math.floor(Math.random()*999);
		const secondId = Math.floor(Math.random()*555)
		const cafe = { id: firstId, nombre: 'Café random' };
		const { statusCode} = await request(server)
			.put(`/cafes/${secondId}`)
			.send(cafe);
		console.log(firstId, secondId);
		expect(statusCode).toBe(400);
	});
});
