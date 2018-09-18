# Requirement to run e2e test

e2e test requires a real server running with the following requirements:
- Provides STOMP endpoint at `/handler` with SockJS support
- Sending a message to `/app/ping` returns a JSON object:
  ```
  { "msg": "pong" }
  ```

A springboot server full-filling the above requirement can be run via:

```
docker run -d -p 8089:8080 lahsivjar/stomp-test-docker-image
```
