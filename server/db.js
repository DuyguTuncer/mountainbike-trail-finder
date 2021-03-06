const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.addInfo = (first, last, emailAddress, password) => {
    return db.query(
        `INSERT INTO socialnetwork (first, last, email_address, hashed_password)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, emailAddress, password]
    );
};

module.exports.findEmail = (emailAddress) => {
    return db.query(
        `SELECT * FROM socialnetwork
        WHERE email_address = ($1);`,
        [emailAddress]
    );
};

module.exports.uploadImage = (url, id) => {
    return db.query(
        `UPDATE socialnetwork SET imageurl = $1 WHERE id = $2 RETURNING imageurl`,
        [url, id]
    );
};

module.exports.getUser = (id) => {
    console.log("I am in db getUser");
    return db.query(
        `SELECT id, first, last, imageurl, bio FROM socialnetwork WHERE id=($1)`,
        [id]
    );
};

module.exports.getMessages = () => {
    return db.query(
        `SELECT socialnetwork.first,socialnetwork.last, socialnetwork.imageurl, messages.text, messages.id, messages.user_id
        FROM messages
        JOIN socialnetwork
        ON (socialnetwork.id = user_id)
        ORDER BY messages.id DESC
        LIMIT 10`
    );
};

module.exports.newMessage = (text, userId) => {
    return db.query(
        `INSERT INTO messages (text, user_id) VALUES ($1,$2) RETURNING text`,
        [text, userId]
    );
};

module.exports.getNewMessage = (text, userId) => {
    return db.query(
        `WITH "user" 
        AS ( SELECT * FROM socialnetwork WHERE id = $2),
        new_message AS (INSERT INTO messages (text, user_id) VALUES ($1, $2) RETURNING text, user_id)
        SELECT first, last, imageurl, text, user_id FROM "user", new_message`,
        [text, userId]
    );
};

module.exports.insertLike = (trailId, userId, address, title) => {
    console.log("I am in db.js insertlike");
    return db.query(
        `INSERT INTO location_likes (trail_id, user_id, address, title) VALUES ($1,$2,$3,$4) RETURNING trail_id`,
        [trailId, userId, address, title]
    );
};

module.exports.getLikes = (trailId) => {
    console.log("I am in getLikes db");
    return db.query(
        `SELECT trail_id, COUNT(trail_id) 
                FROM location_likes 
                WHERE trail_id = $1
                GROUP BY trail_id;`,
        [trailId]
    );
};

module.exports.getTopThree = () => {
    console.log("I am in topthree db");
    return db.query(
        `SELECT trail_id, COUNT(trail_id) 
                FROM location_likes 
                GROUP BY trail_id
                ORDER BY COUNT DESC
                LIMIT 3;`
    );
};

module.exports.insertComment = (trailId, userId, comment) => {
    console.log("I am in db.js insertComment");
    return db.query(
        `INSERT INTO comments (trail_id, user_id, comment) VALUES ($1,$2,$3) RETURNING trail_id, comment`,
        [trailId, userId, comment]
    );
};

module.exports.getComments = (trailId) => {
    console.log("I am in db getComments");
    return db.query(
        `
    SELECT socialnetwork.first, socialnetwork.last, comments.comment
    FROM socialnetwork
    FULL JOIN comments ON socialnetwork.id = comments.user_id
    WHERE trail_id = $1
    `,
        [trailId]
    );
};



