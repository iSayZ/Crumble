CREATE TABLE user (
  id_user INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  sex VARCHAR(10) NOT NULL,
  firstname VARCHAR(25) NOT NULL,
  lastname VARCHAR(25) NOT NULL,
  birthdate DATE NOT NULL,
  biography VARCHAR(300) NULL,
  country VARCHAR(75) NOT NULL,
  avatar VARCHAR(500) NULL,
  coverage VARCHAR(500) DEFAULT '/assets/images/coverage.avif'
);

CREATE TABLE admin (
  id_admin INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  pseudo VARCHAR(45) NOT NULL
);

CREATE TABLE account (
  id_account INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  assignment VARCHAR(20) NOT NULL DEFAULT 'user',
  email VARCHAR(75) UNIQUE NOT NULL,
  password VARCHAR(500) NOT NULL,
  date_creation DATETIME NOT NULL,
  banned TINYINT(1) NOT NULL DEFAULT 0,
  id_user_fk INT NULL,
  id_admin_fk INT NULL,
  FOREIGN KEY (id_user_fk) REFERENCES user(id_user),
  FOREIGN KEY (id_admin_fk) REFERENCES admin(id_admin)
);

CREATE TABLE publication (
  id_publication INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  content VARCHAR(2000) NOT NULL,
  picture VARCHAR(200) NULL,
  date_publication DATETIME NOT NULL,
  id_account_fk INT NOT NULL,
  FOREIGN KEY (id_account_fk) REFERENCES account(id_account)
);

CREATE TABLE likes (  
  id_like INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  date_like DATETIME NOT NULL,
  id_publication_fk INT NOT NULL,
  id_account_fk INT NOT NULL,
  FOREIGN KEY (id_publication_fk) REFERENCES publication(id_publication),
  FOREIGN KEY (id_account_fk) REFERENCES account(id_account)
);

CREATE TABLE comment (
  id_comment INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  date_comment DATETIME NOT NULL,
  content VARCHAR(2000) NOT NULL,
  id_publication_fk INT NOT NULL,
  id_account_fk INT NOT NULL,
  FOREIGN KEY (id_publication_fk) REFERENCES publication(id_publication),
  FOREIGN KEY (id_account_fk) REFERENCES account(id_account)
);

CREATE TABLE friend_request (
  id_friend_request INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  date_friend_request DATETIME NOT NULL,
  id_sender INT NOT NULL,
  id_recipient INT NOT NULL,
  FOREIGN KEY (id_sender) REFERENCES account(id_account),
  FOREIGN KEY (id_recipient) REFERENCES account(id_account)
);

CREATE TABLE friendship (
  id_friendship INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  date_friendship DATETIME NOT NULL,
  id_account_1 INT NOT NULL,
  id_account_2 INT NOT NULL,
  FOREIGN KEY (id_account_1) REFERENCES account(id_account),
  FOREIGN KEY (id_account_2) REFERENCES account(id_account)
);

CREATE TABLE conversation (
    id_conversation INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_account_1 INT NOT NULL,
    id_account_2 INT NOT NULL,
    FOREIGN KEY (id_account_1) REFERENCES account(id_account),
    FOREIGN KEY (id_account_2) REFERENCES account(id_account)
);

CREATE TABLE message (
  id_message INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  date_message DATETIME NOT NULL,
  content VARCHAR(200),
  id_sender INT NOT NULL,
  id_conversation INT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (id_sender) REFERENCES account(id_account),
  FOREIGN KEY (id_conversation) REFERENCES conversation(id_conversation)
);

CREATE TABLE notification (
  id_notification INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  date_notification DATETIME NOT NULL,
  source VARCHAR(50) NOT NULL,
  content VARCHAR(200) NOT NULL,
  id_sender INT NOT NULL,
  id_publication_fk INT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (id_sender) REFERENCES account(id_account),
  FOREIGN KEY (id_publication_fk) REFERENCES publication(id_publication)
);

INSERT INTO admin (pseudo) VALUES 
("admin");

INSERT INTO user(sex, firstname, lastname, country, birthdate, avatar, coverage) VALUES
("male", "John", "Doe", "FR", NOW(), "https://www.benouaiche.com/wp-content/uploads/2018/12/homme-medecine-chirurgie-esthetique-dr-benouaiche-paris.jpg", "/assets/images/uploads/coverages/john-couv.avif"),
("female", "Jane", "Doe", "FR", NOW(), "https://img.freepik.com/photos-gratuite/portrait-jeune-femme_23-2148574874.jpg", "https://e0.pxfuel.com/wallpapers/915/461/desktop-wallpaper-mountain-lake-pier-facebook-cover-landscape.jpg"),
("male", "Alex", "Martin", "US", '1990-05-12', "/assets/images/uploads/avatars/alex.avif", NULL),
("female", "Emily", "Smith", "CA", '1992-11-24', "/assets/images/uploads/avatars/emily.avif", NULL),
("male", "David", "Brown", "UK", '1987-03-09', "/assets/images/uploads/avatars/david.jpeg", NULL),
("female", "Sophia", "Wilson", "AU", '1995-08-14', "/assets/images/uploads/avatars/sophia.avif", NULL),
("female", "Olivia", "Johnson", "FR", '1993-02-28', "/assets/images/uploads/avatars/olivia.avif", "/assets/images/uploads/coverages/olivia-couv.avif"),
("female", "Isabella", "Thomas", "BE", '1994-06-05', "/assets/images/uploads/avatars/th.jpeg", "/assets/images/uploads/coverages/isabella.avif"),
("male", "James", "Garcia", "ES", '1991-09-02', "/assets/images/uploads/avatars/james.avif", NULL),
("female", "Mia", "Martinez", "PT", '1996-04-22', "/assets/images/uploads/avatars/mia.avif", NULL),
("male", "Liam", "Anderson", "IT", '1989-12-17', "/assets/images/uploads/avatars/liam.avif", NULL),
("male", "Michael", "Taylor", "DE", '1985-07-18', "/assets/images/uploads/avatars/michael.jpeg", NULL);

INSERT INTO account (assignment, email, password, date_creation, id_admin_fk, id_user_fk) VALUES
("admin", "admin@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), 1, NULL),
("user", "john@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 1),
("user", "jane@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 2),
("user", "alex@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 3),
("user", "emily@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 4),
("user", "david@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 5),
("user", "sophia@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 6),
("user", "olivia@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 8),
("user", "michael@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 7),
("user", "james@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 9),
("user", "mia@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 10),
("user", "liam@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 11),
("user", "isabella@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 12);

INSERT INTO friend_request (date_friend_request, id_sender, id_recipient) VALUES
(NOW(), 3, 4),
(NOW(), 4, 5),
(NOW(), 5, 6),
(NOW(), 6, 7),
(NOW(), 7, 3),
(NOW(), 8, 5),
(NOW(), 9, 6),
(NOW(), 10, 8),
(NOW(), 11, 9),
(NOW(), 3, 9),
(NOW(), 4, 11),
(NOW(), 5, 10);

INSERT INTO friendship (date_friendship, id_account_1, id_account_2) VALUES
(NOW(), 2, 3),
(NOW(), 2, 5),
(NOW(), 3, 5),
(NOW(), 4, 6),
(NOW(), 5, 7),
(NOW(), 6, 9),
(NOW(), 7, 8),
(NOW(), 8, 10),
(NOW(), 9, 11),
(NOW(), 2, 10),
(NOW(), 5, 9),
(NOW(), 7, 11),
(NOW(), 4, 9),
(NOW(), 6, 8);

INSERT INTO conversation (id_conversation, id_account_1, id_account_2) VALUES
(1, 3, 2),
(2, 3, 5);

INSERT INTO message (date_message, content, id_sender, id_conversation) VALUES
(NOW(), "Bonne journée !", 3, 1),
(NOW(), "😀", 3, 2);

INSERT INTO publication (content, date_publication, id_account_fk, picture) VALUES
("<p>Aujourd'hui, je commence un nouveau projet de développement web. Hâte de partager le résultat avec vous ! 💻 <strong>#NouveauDépart</strong></p>", '2024-09-17 08:30:00', 2, 'https://placeholder.com/image1.jpg'),
("<p>Je viens de finir un livre captivant sur la psychologie. Cela m'a ouvert les yeux sur beaucoup de choses. 📚 <strong>#Lecture</strong></p>", '2024-09-17 14:15:00', 3, 'https://placeholder.com/image2.jpg'),
("<p>Visite au musée d'art contemporain hier. Les œuvres étaient vraiment inspirantes ! 🎨 <strong>#Culture</strong></p>", '2024-09-18 11:00:00', 4, 'https://placeholder.com/image3.jpg'),
("<p>Je suis tombé sur une vieille photo de vacances et ça m'a rappelé de merveilleux souvenirs. 🌅 <strong>#Nostalgie</strong></p>", '2024-09-18 16:45:00', 5, 'https://placeholder.com/image4.jpg'),
("<p>Tellement heureux d'avoir terminé ma formation en développement. C'était un vrai défi ! 🎓 <strong>#Fierté</strong></p>", '2024-09-19 10:00:00', 6, 'https://placeholder.com/image5.jpg'),
("<p>Le weekend dernier était fantastique !<br>Des rires,<br>des amis<br>et une bonne bouffe. 🍕 <strong>#Souvenirs</strong></p>", '2024-09-19 19:30:00', 7, 'https://placeholder.com/image6.jpg'),
("<p>Aujourd'hui, j'ai commencé à apprendre la guitare.<br>Ça ne va pas être facile, mais je suis motivé ! 🎸 <strong>#NouveauHobby</strong></p>", '2024-09-20 09:00:00', 8, 'https://lopinion.com/storage/articles/oplwcMRx8xRxJBGGymRn6HS63hH692AoK0KY4RES.webp'),
("<p>Il pleut aujourd'hui, le temps idéal pour une séance de lecture avec une tasse de thé.<br>☔📖 <strong>#Cozy</strong></p>", '2024-09-20 13:30:00', 9, 'https://placeholder.com/image8.jpg'),
("<p>Je prévois une randonnée ce weekend.<br>Qui veut se joindre à moi ? 🌲🥾 <strong>#Aventure</strong></p>", '2024-09-21 12:00:00', 10, 'https://placeholder.com/image9.jpg'),
("<p>Après un long travail, je mérite bien une soirée cinéma avec des amis.<br>Quoi de mieux ? 🎬 <strong>#Détente</strong></p>", '2024-09-21 20:00:00', 11, 'https://www.culture.gouv.fr/var/culture/storage/images/_aliases/illustration-16-9/1/6/0/0/4790061-1-fre-FR/804e4d7f73f9-080_HL_JLEBLOIS_1171665.jpg'),
("<p>J'ai récemment découvert un super café dans le coin.<br>L'ambiance est juste parfaite ! ☕️ <strong>#Café</strong></p>", '2024-09-22 08:45:00', 12, 'https://media.istockphoto.com/id/1211547141/fr/photo/design-dint%C3%A9rieur-restaurant-moderne.jpg'),
("<p>Je vais participer à un marathon le mois prochain.<br>L'entraînement est intense mais motivant ! 🏃‍♂️ <strong>#Défi</strong></p>", '2024-09-22 15:30:00', 13, NULL),
("<p>Le cours de yoga d'hier était incroyable.<br>J'ai vraiment besoin de ces moments de calme. 🧘‍♂️ <strong>#Zen</strong></p>", '2024-09-22 18:00:00', 6, 'https://bklosangeles.org/wp-content/uploads/2022/03/meditation-e.jpg'),
("<p>Je suis tombé sur une ancienne série que j'adorais.<br>C'est fou comme ça fait remonter des souvenirs ! 📺 <strong>#Nostalgie</strong></p>", '2024-09-23 09:15:00', 7, NULL),
("<p>Le soleil brille et je suis motivé pour une séance d'entraînement en extérieur.<br>💪 <strong>#Fitness</strong></p>", '2024-09-23 16:30:00', 8, 'https://www.outside.fr/wp-content/uploads/2020/03/runner.jpg'),
("<p>Hier, j'ai tenté une nouvelle recette de pâtisserie.<br>Le résultat était savoureux ! 🍰 <strong>#Pâtisserie</strong></p>", '2024-09-21 23:00:00', 9, NULL),
("<p>Ce soir, je me fais une soirée jeux de société.<br>Qui est partant ? 🎲 <strong>#Fun</strong></p>", '2024-09-23 11:00:00', 10, 'https://c0.lestechnophiles.com/www.numerama.com/wp-content/uploads/2023/08/skyjo-2.jpg'),
("<p>La musique adoucit les mœurs.<br>Je viens de découvrir une nouvelle playlist géniale.<br>🎶 <strong>#Musique</strong></p>", '2024-09-23 18:00:00', 2, NULL),
("<p>Un petit moment de détente au bord de la rivière ce weekend.<br>La nature, ça fait du bien. 🌊 <strong>#Nature</strong></p>", '2024-09-23 20:30:00', 12, 'https://depuismonhamac.jardiland.com/wp-content/uploads/2022/02/riviereFrancephotodouverture-1024x668-1.jpg'),
(
    "
    <p>Voici une délicieuse recette de tarte aux pommes, facile à réaliser et parfaite pour le dessert !</p>
    <br>
    <h3>Ingrédients :</h3>
    <br>
    <ul>
        <li>5 pommes</li>
        <li>1 pâte brisée</li>
        <li>100 g de sucre</li>
        <li>50 g de beurre</li>
        <li>2 œufs</li>
        <li>1 sachet de sucre vanillé</li>
        <li>1 c. à soupe de farine</li>
        <li>1 c. à café de cannelle (optionnel)</li>
    </ul>
    <br>
    <br>
    <h3>Instructions :</h3>
    <br>
    <ol>
        <li>Préchauffez le four à 180°C.</li>
        <li>Épluchez et coupez les pommes en fines tranches.</li>
        <li>Étalez la pâte brisée dans un moule à tarte et piquez le fond avec une fourchette.</li>
        <li>Dans un saladier, battez les œufs avec le sucre et le sucre vanillé jusqu'à obtenir un mélange homogène.</li>
        <li>Ajoutez la farine et la cannelle, puis mélangez bien.</li>
        <li>Disposez les tranches de pommes sur la pâte, puis versez le mélange d'œufs par-dessus.</li>
        <li>Ajoutez des petits morceaux de beurre sur le dessus.</li>
        <li>Enfournez pendant environ 30-35 minutes, jusqu'à ce que la tarte soit dorée.</li>
        <li>Laissez refroidir avant de servir.</li>
    </ol>
    <br>
    <p>Bonne dégustation !</p>",
    '2024-09-24 12:30:00', 
    9, 
    "https://assets.biggreenegg.eu/app/uploads/2021/10/04092646/topimage-appeltaart-2021m09-800x533-1.jpg"
);

INSERT INTO likes (date_like, id_publication_fk, id_account_fk) VALUES
('2024-09-17 10:00:00', 1, 3),
('2024-09-17 11:00:00', 1, 4),
('2024-09-17 12:00:00', 1, 5),
('2024-09-18 09:00:00', 2, 4),
('2024-09-18 15:00:00', 2, 5),
('2024-09-18 17:00:00', 2, 6),
('2024-09-18 10:00:00', 3, 2),
('2024-09-18 12:00:00', 3, 5),
('2024-09-18 18:00:00', 3, 7),
('2024-09-19 09:00:00', 4, 8),
('2024-09-19 11:00:00', 4, 9),
('2024-09-19 13:00:00', 4, 10),
('2024-09-19 14:30:00', 4, 11),
('2024-09-19 15:00:00', 4, 12),
('2024-09-20 10:00:00', 5, 9),
('2024-09-20 12:00:00', 6, 10),
('2024-09-21 13:00:00', 7, 11),
('2024-09-21 14:30:00', 8, 12),
('2024-09-22 09:30:00', 9, 11),
('2024-09-22 16:00:00', 10, 12),
('2024-09-22 18:30:00', 11, 13),
('2024-09-23 08:00:00', 12, 13),
('2024-09-23 10:00:00', 13, 12),
('2024-09-23 15:00:00', 14, 11),
('2024-09-23 17:00:00', 15, 10),
('2024-09-23 19:00:00', 16, 9),
('2024-09-23 20:00:00', 17, 8);

INSERT INTO comment (date_comment, content, id_publication_fk, id_account_fk) VALUES
('2024-09-17 09:00:00', "J'ai hâte de voir ce projet !", 1, 4),
('2024-09-17 15:00:00', "Ça a l'air intéressant !", 1, 5),
('2024-09-18 10:30:00', "Vraiment inspirant !", 1, 6),
('2024-09-18 12:00:00', "Quel livre as-tu lu ?", 2, 6),
('2024-09-18 17:00:00', "C'est toujours un bon moment au musée !", 3, 11),
('2024-09-18 19:00:00', "Hâte de voir les photos !", 3, 5),
('2024-09-19 11:00:00', "Félicitations !", 4, 6),
('2024-09-19 20:00:00', "C'est tellement vrai, il faut profiter des moments !", 4, 6),
('2024-09-19 21:30:00', "Je suis d'accord avec ça !", 4, 7),
('2024-09-20 10:00:00', "Tu vas y arriver, courage !", 5, 8),
('2024-09-20 14:00:00', "Une soirée cinéma entre amis, c'est le meilleur plan !", 10, 9),
('2024-09-21 12:30:00', "J'adore les randonnées, bonne chance !", 9, 10),
('2024-09-21 19:00:00', "Je suis sûr que tu vas bien t'amuser !", 8, 11),
('2024-09-22 09:00:00', "Profite bien de ce moment de calme !", 9, 12),
('2024-09-22 16:00:00', "C'est génial d'avoir des défis comme ça !", 10, 13),
('2024-09-22 18:30:00', "Rien de mieux qu'un moment zen.", 11, 4),
('2024-09-23 08:00:00', "C'est vrai, la nostalgie a du bon !", 12, 6),
('2024-09-23 10:00:00', "C'est motivant de s'entraîner avec ce temps !", 13, 7),
('2024-09-23 15:30:00', "Hâte de goûter ta pâtisserie !", 14, 8),
('2024-09-23 17:00:00', "Je suis partant pour une soirée jeux !", 15, 9),
('2024-09-23 19:00:00', "La musique adoucit toujours les mœurs !", 16, 10),
('2024-09-23 20:00:00', "Une balade en nature, que du bonheur !", 19, 11),
('2024-09-23 20:30:00', "C'est beau de voir ça !", 19, 2);

INSERT INTO notification(date_notification, source, content, id_sender, id_publication_fk) VALUES
('2024-09-17 10:00:00', 'like', 'aime votre', 3, 1),
('2024-09-17 11:00:00', 'like', 'aime votre', 4, 1),
('2024-09-17 12:00:00', 'like', 'aime votre', 5, 1),
('2024-09-18 09:00:00', 'like', 'aime votre', 4, 2),
('2024-09-18 15:00:00', 'like', 'aime votre', 5, 2),
('2024-09-18 17:00:00', 'like', 'aime votre', 6, 2),
('2024-09-18 10:00:00', 'like', 'aime votre', 2, 3),
('2024-09-18 12:00:00', 'like', 'aime votre', 5, 3),
('2024-09-18 18:00:00', 'like', 'aime votre', 7, 3),
('2024-09-19 09:00:00', 'like', 'aime votre', 8, 4),
('2024-09-19 11:00:00', 'like', 'aime votre', 9, 4),
('2024-09-19 13:00:00', 'like', 'aime votre', 10, 4),
('2024-09-19 14:30:00', 'like', 'aime votre', 11, 4),
('2024-09-19 15:00:00', 'like', 'aime votre', 12, 4),
('2024-09-20 10:00:00', 'like', 'aime votre', 9, 5),
('2024-09-20 12:00:00', 'like', 'aime votre', 10, 6),
('2024-09-21 13:00:00', 'like', 'aime votre', 11, 7),
('2024-09-21 14:30:00', 'like', 'aime votre', 12, 8),
('2024-09-22 09:30:00', 'like', 'aime votre', 11, 9),
('2024-09-22 16:00:00', 'like', 'aime votre', 12, 10),
('2024-09-22 18:30:00', 'like', 'aime votre', 13, 11),
('2024-09-23 08:00:00', 'like', 'aime votre', 13, 12),
('2024-09-23 10:00:00', 'like', 'aime votre', 12, 13),
('2024-09-23 15:00:00', 'like', 'aime votre', 11, 14),
('2024-09-23 17:00:00', 'like', 'aime votre', 10, 15),
('2024-09-23 19:00:00', 'like', 'aime votre', 9, 16),
('2024-09-23 20:00:00', 'like', 'aime votre', 8, 17),
('2024-09-23 20:00:00', 'like', 'aime votre', 13, 12);