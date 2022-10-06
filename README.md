## URL Shortener

<div align="center">
<img src="/docs/gif.gif">
</div>

### About:

I created this repo a long time ago (more than 3 years), made this public for Hacktoberfest! This is a very good opportunity for beginners to start their journey with open source. All PR's are welcome!

Live demo: https://url-shortener-live.herokuapp.com/

## Ideas for contributing (Updating)

- UI improvements:
  - Animations
  - Dark/Light mode toggle
  - Fonts?
- Add some tests?
- Typescript?
- Migrate into backend framework (eg. nestjs)
- Better readme?
- Add more ideas..
- Just create a PR already :)

## Setting up development environment
### Locally
- You just need to install `node` and run the following:
```bash
npm install
node app.js
```
### Docker
- You can easily build your application in a docker container and run it.
```bash
docker build . -t url-shortener
docker run -p 3000:3000 url-shortener 
```
- Simply go to your favorite browser and visit `http://localhost:3000/` to see your application.
### Docker compose
- In case you have docker installed, you can *single-click* deploy and test your changes by running the following and going to `http://localhost:3000/` on your browser.
```bash
docker-compose up
```

## License

[MIT](https://choosealicense.com/licenses/)
