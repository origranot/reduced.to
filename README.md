<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">URL Shortener</h1>

  <p align="center">
    URL shortener is a web application that reduces the length of link URL. So it's easier to remember, share and track.
    <br />
    <br />
    <a href="https://url-shortener-live.herokuapp.com">View Demo</a>
    ·
    <a href="https://github.com/origranot/url-shortener/issues">Report Bug</a>
    ·
    <a href="https://github.com/origranot/url-shortener/issues">Request Feature</a>
  </p>
</div>
<br />

<!-- TABLE OF CONTENTS -->
<details>
  <summary>📚 Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">🌐 About The Project</a>
      <ul>
        <li><a href="#built-with">🔥 Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">🚀 Getting Started</a>
      <ul>
        <li><a href="#prerequisites">📃 Prerequisites</a></li>
        <li><a href="#installation">💻 Installation</a></li>
        <li><a href="#development">👩‍💻 Development</a></li>
        <li><a href="#docker">🐳 Docker</a></li>
        <li><a href="#docker-compose">🐙 Docker Compose</a></li>
      </ul>
    </li>
    <li><a href="#usage">🐱‍💻 Usage</a></li>
    <li><a href="#roadmap">🧱 Roadmap</a></li>
    <li><a href="#contributing">🥇 Contributing</a></li>
    <li><a href="#contribors">🏆 Contributors</a></li>
    <li><a href="#license">📝 License</a></li>
    <li><a href="#contact">💌 Contact</a></li>
  </ol>
</details>
<br/>

<!-- ABOUT THE PROJECT -->
## 🌐 About The Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/origranot/url-shortener)

I created this repo a long time ago (more than 3 years), made this public for Hacktoberfest! This is a very good opportunity for beginners to start their journey with open source. All PRs are welcome!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 🔥 Built With

List of frameworks/libraries used to bootstrap the project.

* [![Nest][NestJS]][Nest-url]
* [![Qwik][Qwik.js]][Qwik-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## 🚀 Getting Started

### 📃 Prerequisites

List of things you need to run the project locally and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### 💻 Installation

1. [Fork](https://github.com/origranot/url-shortener/fork) the repo
2. Clone the repo
    ```sh
    git clone https://github.com/your_username_/url-shortener.git
    ```
3. Open the cloned repository using the `url-shortener.code-workspace` file (VSCode)
4. Install NPM packages
    ```sh
    npm install && npm run install:all
    ```
5. Build the project
    ```sh
    npm run build:all
    ```
6. Run the project
    ```sh
    npm run start:prod
    ```
7. Go on your browser and open 
    ```sh
    http://localhost:3000/
    ```
### 👩‍💻 Development
You will find 3 folders
* 🎯 `root`
* ✨ `url-shortener/frontend`
* 🚀 `url-shortener/backend`

### _Running the frontend in dev mode_
1. Move to the frontend folder
    ```sh
    cd ./frontend
    ```
2. Run the project (it will open a new window)
    ```sh
    npm run start
    ```
3. Vite will be now listening for changes in the code and reloading the solution

### _Running the backend in dev mode_
1. Move to the backend folder
    ```sh
    cd ./backend
    ```
2. Run the project (be sure that you built the frontend before)
    ```sh
    npm run start:dev
    ```
3. Nest will be now listening for changes in the code and reloading the solution

### 🐳 Docker
- You can easily build your application in a docker container and run it.
  ```sh
  docker build . -t url-shortener
  docker run -p 3000:3000 url-shortener
  ```
- Simply go to your favorite browser and visit `http://localhost:3000/` to see your application.

### 🐙 Docker compose
- In case you have docker installed, you can *single-click* deploy and test your changes by running the following and going to `http://localhost:3000/` on your browser.
  ```sh
  docker-compose up
  ```

Happy Hacking !

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## 🐱‍💻 Usage

Simply copy and paste a URL into the provided area. Then click shorten URL! Your URL has now been shortened!

[![Product Name Screen Shot][product-screenshot]](https://github.com/origranot/url-shortener)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## 🧱 Roadmap

- [x] Migrate backend to NestJS
- [x] Migrate frontend to Qwik
- [x] Better README
- [ ] Yarn instead of NPM
- [ ] Better UI
    - [ ] Animations
    - [ ] Dark/Light mode
    - [ ] Fonts?
- [ ] Add some testing
- [ ] Add logs
- [ ] Add a statistics page
- [ ] Add more ideas

Just create a [Pull request](https://github.com/origranot/url-shortener/pulls) already 😃

_See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues)._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## 🥇 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star ⭐! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🏆 Contributors
<a href = "https://github.com/origranot/url-shortener/graphs/contributors">
  <img src = "https://contrib.rocks/image?repo=origranot/url-shortener"/>
</a>
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## 📝 License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## 💌 Contact

Project Link: [https://github.com/origranot/url-shortener](https://github.com/origranot/url-shortener)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/origranot/url-shortener.svg?style=for-the-badge
[contributors-url]: https://github.com/origranot/url-shortener/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/origranot/url-shortener.svg?style=for-the-badge
[forks-url]: https://github.com/origranot/url-shortener/network/members
[stars-shield]: https://img.shields.io/github/stars/origranot/url-shortener.svg?style=for-the-badge
[stars-url]: https://github.com/origranot/url-shortener/stargazers
[issues-shield]: https://img.shields.io/github/issues/origranot/url-shortener.svg?style=for-the-badge
[issues-url]: https://github.com/origranot/url-shortener/issues

[product-screenshot]: docs/gif.gif
[NestJS]: https://img.shields.io/badge/nestJS-000000?style=for-the-badge&logo=nestjs&logoColor=E0234E
[Nest-url]: https://nestjs.com/
[Qwik.js]: https://img.shields.io/badge/Qwik-ffffff?style=for-the-badge&&logo=data:image/png;base64,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
[Qwik-url]: https://qwik.builder.io/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
