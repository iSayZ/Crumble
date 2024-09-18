CREATE TABLE user (
  id_user INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  sex VARCHAR(10) NOT NULL,
  firstname VARCHAR(25) NOT NULL,
  lastname VARCHAR(25) NOT NULL,
  birthdate DATE NOT NULL,
  biography VARCHAR(300) NULL,
  country VARCHAR(75) NOT NULL,
  avatar VARCHAR(500) NULL,
  coverage VARCHAR(500) NULL
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
  content VARCHAR(500) NOT NULL,
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
("male", "John", "Doe", "FR", NOW(), "https://www.benouaiche.com/wp-content/uploads/2018/12/homme-medecine-chirurgie-esthetique-dr-benouaiche-paris.jpg", "https://e0.pxfuel.com/wallpapers/915/461/desktop-wallpaper-mountain-lake-pier-facebook-cover-landscape.jpg"),
("female", "Jane", "Doe", "FR", NOW(), "https://img.freepik.com/photos-gratuite/portrait-jeune-femme_23-2148574874.jpg", "https://e0.pxfuel.com/wallpapers/915/461/desktop-wallpaper-mountain-lake-pier-facebook-cover-landscape.jpg"),
("male", "Alexis", "Estrine", "FR", NOW(), "https://avatars.githubusercontent.com/u/121875319?v=4", "https://e0.pxfuel.com/wallpapers/915/461/desktop-wallpaper-mountain-lake-pier-facebook-cover-landscape.jpg"),
("male", "Elon", "Musk", "US", NOW(), "https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/d/9/a/d9a1058910_50163142_elon-musk1.jpg", "https://e0.pxfuel.com/wallpapers/915/461/desktop-wallpaper-mountain-lake-pier-facebook-cover-landscape.jpg"),
("male", "Emmanuel", "Macron", "FR", NOW(), "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Emmanuel_Macron_%28cropped%29.jpg/170px-Emmanuel_Macron_%28cropped%29.jpg", "https://e0.pxfuel.com/wallpapers/915/461/desktop-wallpaper-mountain-lake-pier-facebook-cover-landscape.jpg"),
("male", "Donald", "Trump", "US", NOW(), "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/640px-Donald_Trump_official_portrait.jpg", "https://e0.pxfuel.com/wallpapers/915/461/desktop-wallpaper-mountain-lake-pier-facebook-cover-landscape.jpg"),
("male", "Kylian", "Mbappé", "FR", NOW(), "https://cdn-www.konbini.com/files/2024/06/masque_kylian.jpg?width=1920&quality=75&format=webp", "https://e0.pxfuel.com/wallpapers/915/461/desktop-wallpaper-mountain-lake-pier-facebook-cover-landscape.jpg"),
("male", "Kim", "Jong-un", "FR", NOW(), "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Kim_Jong-un_April_2019_%28cropped%29.jpg/640px-Kim_Jong-un_April_2019_%28cropped%29.jpg", "https://e0.pxfuel.com/wallpapers/915/461/desktop-wallpaper-mountain-lake-pier-facebook-cover-landscape.jpg");

INSERT INTO account (assignment, email, password, date_creation, id_admin_fk, id_user_fk) VALUES
("admin", "admin@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), 1, NULL),
("user", "john@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 1),
("user", "jane@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 2),
("user", "estrine.alexis@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 3),
("user", "elon@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 4),
("user", "macron@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 5),
("user", "trump@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 6),
("user", "mbappe@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 7),
("user", "kim@gmail.com", "$argon2id$v=19$m=19456,t=2,p=1$yuo/P84kPENN7Qysfs+yWA$yn59veoRPNSlJ3u2O/5sCG10dwO/3yaSj00oYUfSPtA", NOW(), NULL, 8);

INSERT INTO friend_request (date_friend_request, id_sender, id_recipient) VALUES
(NOW(), 6, 4),
(NOW(), 7, 4),
(NOW(), 8, 4),
(NOW(), 9, 4);

INSERT INTO friendship (date_friendship, id_account_1, id_account_2) VALUES
(NOW(), 1, 2),
(NOW(), 1, 4),
(NOW(), 1, 5),
(NOW(), 1, 6),
(NOW(), 2, 5),
(NOW(), 1, 8),
(NOW(), 4, 5),
(NOW(), 5, 6),
(NOW(), 6, 4),
(NOW(), 3, 4);

INSERT INTO conversation (id_conversation, id_account_1, id_account_2) VALUES
(1, 3, 4);

INSERT INTO message (date_message, content, id_sender, id_conversation) VALUES
(NOW(), "Hey !", 4, 1),
(NOW(), "Salut !", 3, 1);

INSERT INTO publication (content, date_publication, id_account_fk, picture) VALUES
("Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores velit officiis nam eum facilis tempore, suscipit aspernatur consequuntur ea nobis debitis dolor magni adipisci eius dolorum doloremque, natus possimus sed! Est voluptates, repudiandae voluptatem natus vitae magni illo adipisci doloribus nesciunt tempore explicabo dolore nam, non neque doloremque quasi, vero ducimus! Non eaque possimus quaerat, cupiditate ex eos velit nemo.", NOW(), 2, "https://images.unsplash.com/photo-1706430263184-c1f9ac844a54?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
("Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores velit officiis nam eum facilis tempore, suscipit aspernatur consequuntur ea nobis debitis dolor magni adipisci eius dolorum doloremque, natus possimus sed! Est voluptates, repudiandae voluptatem natus vitae magni illo adipisci doloribus nesciunt tempore explicabo dolore nam, non neque doloremque quasi, vero ducimus! Non eaque possimus quaerat, cupiditate ex eos velit nemo.", NOW(), 3, "https://plus.unsplash.com/premium_photo-1716476978325-585094057a4f?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
("Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores velit officiis nam eum facilis tempore, suscipit aspernatur consequuntur ea nobis debitis dolor magni adipisci eius dolorum doloremque, natus possimus sed! Est voluptates, repudiandae voluptatem natus vitae magni illo adipisci doloribus nesciunt tempore explicabo dolore nam, non neque doloremque quasi, vero ducimus! Non eaque possimus quaerat, cupiditate ex eos velit nemo.", NOW(), 4, "https://images.unsplash.com/photo-1721026586200-157849a043d1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
("Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores velit officiis nam eum facilis tempore, suscipit aspernatur consequuntur ea nobis debitis dolor magni adipisci eius dolorum doloremque, natus possimus sed! Est voluptates, repudiandae voluptatem natus vitae magni illo adipisci doloribus nesciunt tempore explicabo dolore nam, non neque doloremque quasi, vero ducimus! Non eaque possimus quaerat, cupiditate ex eos velit nemo.", NOW(), 7, "https://images.radio-canada.ca/q_auto,w_1200/v1/ici-info/perso/trump-blessure-oreille-evacuation-evan-vucci.jpg");


INSERT INTO likes (date_like, id_publication_fk, id_account_fk) VALUES
(NOW(), 1, 3),
(NOW(), 2, 2),
(NOW(), 4, 3),
(NOW(), 4, 2),
(NOW(), 4, 5),
(NOW(), 4, 6);


INSERT INTO comment (date_comment, content, id_publication_fk, id_account_fk) VALUES
(NOW(), "Super !", 1, 3),
(NOW(), "Top !", 2, 2);

INSERT INTO notification(date_notification, source, content, id_sender, id_publication_fk) VALUES
(NOW(), "like", "aime votre", 2, 3),
(NOW(), "like", "aime votre", 3, 3),
(NOW(), "comment", "a ajouté un commentaire à votre", 5, 3),
(NOW(), "comment", "a ajouté un commentaire à votre", 6, 3);
