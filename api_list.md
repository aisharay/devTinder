authRouter
- POST /signup
- POST /login
- POST /logout


profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter
- POST /request/send/interested/:userID
- POST /request/send/ignored/:userID
- POST /request/review/accepted/:requestID
- POST /request/review/declined/:requestID

- GET /user/connections
- GET /requests/received
- GET /requests/sent
- GET /feed