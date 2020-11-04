import { rest } from 'msw'

export const handlers = [
  // Handles a POST /login request
  rest.post('/parties', null),

  // Handles a GET /user request
  rest.get('/parties', null),
]