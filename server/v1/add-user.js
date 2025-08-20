const db = require("../db");


async function addUser(username, email, password){
    try{
        const [response] = await  db.query(
            "INSERT INTO users (username, email, password) VALUES(?,?,?)",
            [username, email,password]
        );
        console.log("User inserted with ID:", response.insertId);

    }
    catch(err){
        console.error("Error inserting user: ", err);
    }


}

addUser("Moisghggudffhfii", "Moisdhfgfghf8@gmfail.com", "1234");