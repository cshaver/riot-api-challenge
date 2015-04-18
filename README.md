# Riot API Challenge - Quiet Room Match Simulator 2015
Entry to the [Riot API Challenge](https://developer.riotgames.com/discussion/riot-games-api/show/bX8Z86bm)!

[View the Demo Here](https://riot-api-challenge.herokuapp.com/)

This thing is *clearly* unfinished, but I've instructions and my thoughts below since it was still a lot of fun to make! I really enjoyed trying something new with the Riot API, especially since I got to use a lot of tools I don't normally play with on a regular basis.

# Current Functionality
Entry into the first page allows the host to create a room with a shareable link, and fetch a cached URF game. All users in the room should get the same game when the host fetches. The host can hit play to have the summoner icons animate around the map and keep track of the kills, deaths, and assists per champion.
As-is, this project is clearly really buggy and slow. For full disclosure, the more glaring bugs include:
- Some of the room ids don't map quite correctly
- The database queries are WAY SLOW.
- Dang it's ugly. :(

# What I was going for
Going into the project I didn't really have an idea, but I didn't get enough sleep and ate nothing but candy one night and dreamed up a League of Legends betting game. If I had a ton more time, it would be a Hecarim themed horse race, silly autotune music included ([SERIOUSLY](http://upload.wikimedia.org/wikipedia/commons/6/60/FirstCall.ogg), it was going to be [SO SILLY](http://upload.wikimedia.org/wikipedia/commons/4/43/Gioachino_Rossini%2C_William_Tell_Overture_%28military_band_version%2C_2000%29.ogg)).

# On the bright side
Even though I didn't get anywhere near where I wanted to be due to work obligations, it was still so much fun to code! I'd never worked much with Node.js or Socket.io before, and I feel like I learned a ton. I even finally got around to trying Heroku. Personally, my favorite parts are:
- Username generation! Inspired by Google Docs, I made up a list of League related nouns and adjectives and shoved them together. (How great is Definitely Not Support?!)
- Champion sprite animation - it's really fun to watch them dance around. :)

For all the stuff I didn't get done, or did wrong, there were still a lot of lessons learned:
- Don't randomly choose a database and then insert sixty thousand rows worth of data.
- Don't insert that data wrong and have to clean the JSON like twenty times.
- Actually read through the source of modules before committing to workflows, just for them to turn out to only do like four of the fifty things you thought it would do.
- I really need to brush up on all of these tools! They're all really interesting to use, but I swear I spent 80% of my time just trying to figure things out versus actually coding things that wouldn't take very long (which is why there are virtually no styles, making me eternally sad).

# Dependencies
I used a lot of libraries to make life easier - full dependencies are in package.json. Major useful things included:
- [lolapi](https://www.npmjs.com/package/lolapi) for grabbing champion data
- Node.js for all things server related
- Backbone.js for fancy structure
- Socket.io
- Express