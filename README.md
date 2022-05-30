# restreamchat2ntfy
Send restream.io chat to ntfy to display chat on the Meta Quest.  

Demo video:  
[![demo](https://img.youtube.com/vi/A9jHb0oVpBE/0.jpg)](https://www.youtube.com/watch?v=A9jHb0oVpBE)

## You need to set up the Quest phone notification before use
https://store.facebook.com/help/quest/articles/in-vr-experiences/social-features-and-sharing/phone-notifications/

## Install
Download or clone this repository then run npm install.
```
$ cd restreamchat2ntfy/
$ npm install
```

## Create your restream.io application
This app needs app client id and client secret to use the Restream API. Create an application via developer portal to get id/secret.  
https://developers.restream.io/apps

## Set the client id/secret to .env file
Copy `.env.example` to `.env`. Set the client id and secret to `.env`.
```
CLIENT_ID=[your_restream_api_client_id]
CLIENT_SECRET=[your_restream_api_client_secret]
```

## Install ntfy phone app
Android  
https://play.google.com/store/apps/details?id=io.heckel.ntfy

iOS (Beta)  
https://testflight.apple.com/join/P1fFnAm9  
*This url may be changed. See: https://github.com/binwiederhier/ntfy/issues/4

## Set your ntfy topic name
You can take any topic name as an notification channel name.  
Set a topic url to the `.env` file
```
NTFY_SERVER=https://ntfy.sh/[your_ntfy_subject]
```

Subscribe the topic from the ntfy phone app too.

## Run

1. Run the script with node.
```
$ node index.js
Open http://localhost:3000/ to redirect Restream login page.
```

2. Open http://localhost:3000/ on your web browser then it redirects to Restream.io login page.
3. Login with your restream account and click the "Allow" button to grant access to this program.
4. Back to the terminal. Now, your twitch/youtube chat are observed and they will be notified on your phone.
```
Waiting for new chat...
User_1: Hello!
User_2: Hi.
```
5. You can check chat texts in your Quest if your phone notification settings worked.

## Attention
This program is incomplete. Refresh/Revoke access tokens are not implemented. Tokens expire in an hour so this works only an hour at one session.
