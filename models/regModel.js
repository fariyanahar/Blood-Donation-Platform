import db from "../config/dbConfig.js";
import dotenv from "dotenv";
dotenv.config();


// model to insert the user into the db 
export const insertUser = async (dataObj)=>{
    const {name,email,password,
        phone,gender,role,address,
        last_donation_date,blood_type,
        date_of_birth } = dataObj ;
    //insert into user table 
    const donorQuery = `insert into User (name,email,password,
    phone,gender,role,address,last_donation_date,blood_type,date_of_birth)
    values(?,?,?,?,?,?,?,?,?,?)`

    const recipientQuery = `insert into User (name,email,password,
    phone,gender,role,address,blood_type,date_of_birth)
    values(?,?,?,?,?,?,?,?,?)`
    // insert into donor table 
    try {
    
        if(role === 'recipient'){
            const [query] = await db.execute(recipientQuery, [name,email,password,
                phone,gender,role,address,blood_type,date_of_birth]);
            return query.insertId;
        }
        const [query] = await db.execute(donorQuery, [name,email,password,
            phone,gender,role,address,last_donation_date,blood_type,date_of_birth]);
        return query.insertId;

    } catch (err){
        console.error(err);
        throw err;
    }
    
};


export const insertAdmin = async(dataObj)=>{
    const {
        name,email,password,
    phone,role
    } = dataObj;
    const adminQuery = `insert into Admin(phone,name,email,password,role)
    values(?,?,?,?,?)`
    try {
        const [query] = await db.execute(adminQuery, [phone,name,email,password,role]);
        return query.insertId;
    } catch (err){
        console.error(err);
        throw err;
    }         
};


// export const insertRecipient = async (first_name,last_name,email,password,
//     phone,gender,role,nid,blood_type,date_of_birth,address)=>{
//     //insert into user table 
//     const userQuery = `insert into User (first_name,last_name,email,password,
//     phone,gender,role,nid,blood_type,date_of_birth,address)
//     values(?,?,?,?,?,?,?,?,?,?,?)`
//     // insert into recipient table 
//     const recipientQuery = `insert into Recipient(r_id) values(?)`
    
//     let connection;
//     try{
//         connection = await db.getConnection();
//         await connection.beginTransaction();

//         const [userResult] = await connection.execute(userQuery, [first_name,last_name,email,password,
//             phone,gender,role,nid,blood_type,date_of_birth,address]);

//         const [recipientResult] = await connection.execute(recipientQuery, [userResult.insertId]);
//         console.log(recipientResult.insertId);

//         await connection.commit();
//         console.log("Recipient inserted with r_id:", recipientQuery.insertId);
//         return recipientResult.insertId;
//     }catch(err){
//         if(connection){
//             await connection.rollback();
//         }
//         console.error("Error", err);
//         throw err;
//     }finally{
//         if(connection){
//             connection.release();
//         }
//     }
// };
