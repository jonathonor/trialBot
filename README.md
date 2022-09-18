<a name="readme-top"></a>
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/jonathonor/trialbot">
    <img src="trialBotLogo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">TrialBot</h3>
  <p>
    A bot that allows you to give roles to users on your Discord server for a certain amount of time.</p>
  <p>
    <a href="https://www.jonsbots.com/trialbot"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://discord.gg/f8SUVvQZD3">My Discord</a>
    ·
    <a href="https://github.com/jonathonor/trialbot/issues">Report Bug</a>
    ·
    <a href="https://github.com/jonathonor/trialbot/issues">Request Feature</a>
    ·
    <a href="https://jonsbots.com">My Website</a>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

This is a bot that allows you to grant users temporary access to different roles in your Discord servers. The bot is very helpful for server owners who have roles that allow different channels based on certain subscriptions or packages the users pay for. I would highly recommend checking out my website where I dive in deep to how the bot works, what all it does, and even share some walkthrough videos of it in action. Thanks for stopping by and reach out to me on Discord if you'd like to connect!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Use Cases - Running TrialBot
Manual Operations
 - Adding a role for a set amount of time /add @user @role (amount of time) (minutes/hours/days)
   - You can use the /add slash command to easily add a a role temporarily to a user in your server. This command must be run from a guild, and takes 
   * Note - if the user already has an expiration date for that role in the future, this will extend that date

Automatic Operations 
 - The bot will check for users roles that have expired every hour and remove them.

More functionality (coming soon)
 - You can designate the bot to automatically assign a role to users upon them joining your server for a set amount of time. 
   - example: You have used the bots /set-role-on-join command for "My cool Role" to be added when new users join the guild and the time for the role to be one hour. Jim then joins your server and the bot grants him the role named "My cool Role". After one hour, the role "My cool Role" is automatically removed from Jim.
 - You can designate the bot to automatically assign a role to a user for a certain time period.
   - example: You have used the bots /set-role-for-period command to assign the role "My cool Role" to Jim for an event weekend. The dates of the weekend are September 3rd at noon until September 5th at midnight. The bot will automatically assign the role on September 3rd at noon and remove the role on September 5th at midnight.

## Installing
- requirements :
    - node v16.11.1 
- example install :
    - cd /Documents
    - git clone https://github.com/jonathonor/trialbot.git
    - cd trialbot
    - npm install
    - follow the config steps at [TrialBot Documentation](https://jonsbots.com/trialbot/#aioseo-explain-config-file) to populate the config.json file before executing the next two commands

- To start regular sync bot
  - node register.js (this registers the /add command for your bot)
  - node trialbot-lowdb.js

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/jonathonor/trialbot.svg?style=for-the-badge
[contributors-url]: https://github.com/jonathonor/trialbot/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jonathonor/trialbot.svg?style=for-the-badge
[forks-url]: https://github.com/jonathonor/trialbot/network/members
[stars-shield]: https://img.shields.io/github/stars/jonathonor/trialbot.svg?style=for-the-badge
[stars-url]: https://github.com/jonathonor/trialbot/stargazers
[issues-shield]: https://img.shields.io/github/issues/jonathonor/trialbot.svg?style=for-the-badge
[issues-url]: https://github.com/jonathonor/trialbot/issues
[license-shield]: https://img.shields.io/github/license/jonathonor/trialbot.svg?style=for-the-badge
[license-url]: https://github.com/jonathonor/trialbot/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
