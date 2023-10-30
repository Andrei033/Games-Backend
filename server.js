const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
const users = []; 
const secretKey = 'abc';



class Game {
  constructor(id, name, genre, price, imageUrl) {
    this.id = id;
    this.name = name;
    this.genre = genre;
    this.price = price;
    this.imageUrl=imageUrl;
  }
}

const games = [
  new Game(1, 'Terraria','RPG', '70.99','https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg?t=1666290860' ),
  new Game(2,  'Call of duty', 'Action',  29.99, 'https://static.tweaktown.com/news/16x9/90313_report-call-of-duty-2023-will-be-full-game-with-campaign.png'),
  new Game(3,   'Elden Ring',  'RPG',  39.99, 'https://assets.nuuvem.com/image/upload/v1/products/618418052f91a002e3f9cf6b/sharing_images/dl3d5ccidn9wlkemhfjr.jpg'),
  new Game(4,   'Counter-Strike',  'Action', 19.99,'https://zonait.ro/wp-content/uploads/2021/01/CS-GO.jpg' ),
  new Game(5,  'Raft', 'RPG', '50.99','https://raft-game.com/____impro/1/onewebmedia/MainCapsule_Renovation.png?etag=%224b62e-60d47d07%22&sourceContentType=image%2Fpng&ignoreAspectRatio&resize=386%2B221&extract=0%2B0%2B358%2B221' ),
  new Game(6,  'Resident evil', 'Action', '65.99','https://cdn.cloudflare.steamstatic.com/steam/apps/883710/capsule_616x353.jpg?t=1692001351' ) 
];

app.get('/games', (req, res) => {
  res.json(games);

  fs.writeFile('games.json', JSON.stringify(games), (err) => {
    if (err) {
      console.error('Error writing games to file:', err);
    } else {
      console.log('Games data has been written to users.json');
    }
  });
});

app.get('/games/:id', (req, res) => {
  const gameId = parseInt(req.params.id);
  const game = games.find((game) => game.id === gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  res.json(game);
});

app.post('/games', (req, res) => {
  const newGame = req.body;
  if (!newGame.name || !newGame.genre || !newGame.price) {
  }
  const newId = games.length + 1;
  const game = new Game(newId, newGame.name, newGame.genre, newGame.price);
  games.push(game);
  res.status(201).json(game);
});

app.put('/games/:id', (req, res) => {
  const gameId = parseInt(req.params.id);
  const updatedGame = req.body;
  const existingGame = games.find((game) => game.id === gameId);
  if (!existingGame) {
    return res.status(404).json({ error: 'Jocul nu există' });
  }
  if(!updatedGame.name){
    existingGame.name = existingGame.name
  }
  else{
    existingGame.name = updatedGame.name;
  }

  if(!updatedGame.genre){
    existingGame.genre = existingGame.genre
  }
  else{
    existingGame.genre = updatedGame.genre;
  }
  if(!updatedGame.price){
    existingGame.price = existingGame.price;
  }
  else{
    existingGame.price = updatedGame.price;
  }
  if(!updatedGame.imageUrl){
    existingGame.imageUrl = existingGame.imageUrl;
  }
  else{
    existingGame.imageUrl = updatedGame.imageUrl;
  }
  
  res.json(existingGame);
});

app.delete('/games/:id', (req, res) => {
  const gameId = parseInt(req.params.id);
  const index = games.findIndex((game) => game.id === gameId);
  games.splice(index, 1);
  res.status(204).send();
});

app.post('/user/login', async (req, res) => {
  const userId = users.length + 1; 
  const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = {
      id: userId,
      email: req.body.email,
      password: hashedPassword,
    };
  users.push(user);
  console.log(users);
  fs.writeFile('users.json', JSON.stringify(users), (err) => {
    if (err) {
      console.error('Error writing users to file:', err);
    } else {
      console.log('User data has been written to users.json');
    }
  });
  const token = jwt.sign({ id: userId }, secretKey, {
    expiresIn: '24h' 
  });
  res.status(200).json({ token }); 
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
