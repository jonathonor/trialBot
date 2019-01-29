# expireBot
A bot to expire a discord users role after a set amount of time.

Clone this repo to wherever you want the bot to run.
- example :
    - cd /Documents
    - git clone https://github.com/jonathonor/expireBot.git
    - cd expireBot
    - npm install
    - node run.js

Prerequisites -
1. Open “MySQL Client”
2. Copy and paste the code below into the command line after you have logged into MySQL
3. You can change the username/password here to whatever you want, just make sure it matches what is in config.json

CREATE DATABASE expireBotData;<br>
CREATE USER 'expireDataUser'@'localhost' IDENTIFIED BY 'expireDataPassword';<br>
GRANT ALL PRIVILEGES ON expireBotData . * TO 'expireDataUser'@'localhost';<br>
USE expireBotData;<br>
CREATE TABLE users (id varchar(18), role varchar(18), expires datetime);<br>
exit

After the database has been created, you are ready to create and configure your bot.

To Create a discord dev application if you don't have one (you need the token)
1. Create a Discord Bot at https://discordapp.com/developers/applications
2. Click New Application
3. On the left hand side click Bot
4. Click Ok
5. Copy Bot Token into config.json
6. Click OAuth2 in the left sidebar
7. Click in the scopes section "bot" and in the bot permissions section "manage roles"
8. Copy the URL in the bottom of the "scopes" section and paste it into your web browser
9. Click the server you would like to invite the bot to and click authorize.
10. Enable discord developer mode. https://discordia.me/developer-mode
11. Copy the Id of the server you want to expire roles in by right clicking the server name in discord
and then clicking "Copy Id"
12. Paste the server id into the config.json 
13. IMPORTANT: Make sure the bot's role in your discord server is located above the roles you want synced in the role heirarchy. (The bots role should be the same name as what you named the bot)
14. The roles you are assigning should be set to "Allow anyone to mention this role" in server
15. Add commanderRole name of role that you allow to add/remove roles e.g. (Admin)

Now you are ready to use the commands to add and remove roles in both servers.
- !role @username @role-name 10
    - will add the role with role name to the user and remove the role after 10 days.
    * Note - if the user already has an expiration date in the future, this will extend that date by 10 days


