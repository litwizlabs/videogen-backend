import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const url = 'https://api.stack-auth.com/api/v1/users/me';
  const headers = {
    'x-stack-access-type': 'server',
    'x-stack-project-id': '1d9351fc-3894-4e3d-9dea-145bd685f59e',
    'x-stack-secret-server-key': 'ssk_xnsbdjsfteg8ykm63v5q4ym3m14vjnk5j2fqr5bfx8540',
    'x-stack-access-token': (req.headers['x-stack-access-token'] as string) || '',
    'x-stack-refresh-token': (req.headers['x-stack-refresh-token'] as string) || ''
  };

  fetch(url, { headers })
    .then(response => response.json())
    .then(data => {
      if (data.id) {
        req.user = { id: data.id }; // Attach user id to the request object
        next(); // Proceed to the next middleware or route handler
      } else {
        res.status(401).json({ error: 'User is not authenticated' });
      }
    })
    .catch(error => {
      console.error('Error authenticating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};
