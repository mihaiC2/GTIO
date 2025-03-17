import request from 'supertest';
import {app,server} from '../server';

describe('Auth Service', () => {
  it('should return 200 on successful login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'rgm745@gmail.com', password: '123456' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token'); 
      expect(res.body).toHaveProperty('user');  
      expect(res.body.user).toHaveProperty('email', 'rgm745@gmail.com'); 
  });

    it('should return 400 on failed login', async () => {
        const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testError@gmail.com', password: '123456' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Invalid login credentials');
    });
});

afterAll((done) => {
  server.close(() => {
    done();
  });
});

