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
  - Dark/Light mode toggle button
  - Github repo button
  - Fonts?
- Migrate our front to React?
- Add some tests?
- Better readme?
- Add logs?
- Add more ideas..
- Just create a PR already :)

## How to run?

### Locally
Step 1. Fork the Repository

Step 2. Clone the repository on your local machine
```sh
git clone https://github.com/GITHUBPROFILENAME/url-shortener.git
```
Step 3. Enter the command, to move to project directory
```sh
cd url-shortener
```
Step 4. Install the node dependencies.
```sh
npm install
```
Step 5. Start NPM , to make your project live
```sh
npm start
```
Step 6. Go on your browser and open 
```sh
http://localhost:3000/
```

### Docker
- You can easily build your application in a docker container and run it.
```sh
docker build . -t url-shortener
docker run -p 3000:3000 url-shortener
```
- Simply go to your favorite browser and visit `http://localhost:3000/` to see your application.
### Docker compose
- In case you have docker installed, you can *single-click* deploy and test your changes by running the following and going to `http://localhost:3000/` on your browser.
```sh
docker-compose up
```

Happy Hacking !
   
## Contributors

<a href = "https://github.com/origranot/url-shortener/graphs/contributors">
  <img src = "https://contrib.rocks/image?repo=origranot/url-shortener"/>
</a>

## License

[MIT](https://choosealicense.com/licenses/)
