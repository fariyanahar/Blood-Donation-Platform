// CREATE TABLE Donation_Event (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     date DATE NOT NULL,
//     address VARCHAR(255) NOT NULL,
//     organizer INT,
//     FOREIGN KEY (organizer) REFERENCES Admin(id) ON DELETE CASCADE
// );
import db from "../config/dbConfig.js";

// Create donation event
export const createDonationEvent = async (dataObj) => {
    const {name, date, address, organizer} = dataObj;
    const query = `
        insert into Donation_Event (name, date, address, organizer)
        values (?, ?, ?, ?);
    `;
    try {
        const [result] = await db.execute(query, [name, date, address, organizer]);
        return result.insertId; // Return the ID of the newly created event
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// show all events
export const searchDonationEvent = async ( queryParamsObj )=>{

    const filterParams = queryParamsObj.filters || {};
    const sortParams = queryParamsObj.sort || [];
    const orderParams = queryParamsObj.order || []; 
    const queryValues = [];

    // Base Query
    let baseQuery = `
        select 
            Donation_Event.id as EventID,
            Donation_Event.name as EventName,
            Donation_Event.date as EventDate,
            Donation_Event.address as EventAddress,
            Admin.name as Organizer,
            Event_Participants.donated_blood_type as DonorBloodType,
            Event_Participants.d_id as DonorId
        from 
            Donation_Event
        inner join 
            Admin 
        on 
            Donation_Event.organizer = Admin.id
        left join 
            Event_Participants 
        on 
            Donation_Event.id = Event_Participants.e_id
        where 1=1
    `;

    // Dynamic Filters
    if (filterParams.name) {
        baseQuery += " and Donation_Event.name like ? ";
        queryValues.push(`%${filterParams.name}%`);
    }
    if(filterParams.d_id){
        baseQuery += " and Event_Participants.d_id = ? ";
        queryValues.push(filterParams.d_id);
    }
    if(filterParams.e_id){
        baseQuery += " and Donation_Event.id = ? ";
        queryValues.push(filterParams.e_id);
    }
    if(filterParams.needed_blood_type){
        baseQuery += " and Event_Participants.donated_blood_type = ? ";
        queryValues.push(filterParams.needed_blood_type);
    }
    if(filterParams.address){
        baseQuery += " and Donation_Event.address = ? ";
        queryValues.push(filterParams.address);
    }

    if (filterParams.start_date && filterParams.end_date) {
        baseQuery += " and Donation_Event.date between ? and ? ";
        queryValues.push(filterParams.start_date, filterParams.end_date);
    }else if (filterParams.date) {
                    baseQuery +=  " and Donation_Event.date = ? ";
                    queryValues.push(filterParams.date);
        }


    // Sorting
    if (sortParams.length > 0 && sortParams.length === orderParams.length){
        baseQuery += " order by ";
        let tempParams = [];
        for (let i = 0 ; i < sortParams.length; i++ ){ 
            tempParams.push(`${sortParams[i]} ${orderParams[i]}`)
        }
        baseQuery += tempParams.join(", ");
    };

    baseQuery += ";";

    try {
        const [rows] = await db.execute(baseQuery, queryValues);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};


// // update Event
// export const updateEvent = async (eventId,updateObj)=>{
//     const updateQuery = `update Donation_Event set `+ 
//     Object.keys(updateObj).map( key => `${key} = ?`).join(", ") +
//     `where id = ? ;` ;
//     try{
//         const [query] = await db.execute(updateQuery, [...Object.values(updateObj), eventId ]);
//         return query.affectedRows;
//     }catch(err){
//         console.error(err);
//         throw err;
//     }
// };


// //delete event
// export const deleteEvent= async (event_id) => {
//     const deleteQuery = `delete from Donation_Event where id = ? ;`;
//     try {
//         const [query] = await db.execute(deleteQuery, [event_id]);
//         return query.affectedRows;
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// };


// join event 
export const joinEvent = async (dataObj) => {
    const { d_id, e_id, donated_blood_type } = dataObj;
    const insertQuery = `insert into Event_Participants (d_id, e_id, donated_blood_type)
     values (?, ?, ?)`;
    try {
        const [query] = await db.execute(insertQuery, [d_id, e_id, donated_blood_type]);
        return query.insertId;
    } catch (err) {
        console.error(err);
        throw err;
    }
};


// Recipient collect blood
export const collectBlood = async (dataObj) => {
    const {p_id, e_id, needed_blood_type } = dataObj;
    const insertQuery = `insert into Blood_Collector (p_id, e_id, needed_blood_type)
     values (?, ?, ?)`;
    try {
        const [query] = await db.execute(insertQuery, [p_id, e_id, needed_blood_type]);
        return query.insertId;
    } catch (err) {
        console.error(err);
        throw err;
    }
};


export const getBloodCollector = async ( queryParamsObj )=>{

    const filterParams = queryParamsObj.filters || {};
    const sortParams = queryParamsObj.sort || [];
    const orderParams = queryParamsObj.order || [];
    const queryValues = [];

    // Base Query
    let baseQuery = `
        select p_id, e_id, needed_blood_type
        from Blood_Collector
        where 1=1
    `;

    // Dynamic Filters
    if (filterParams.p_id) {
        baseQuery += " and p_id = ? ";
        queryValues.push(filterParams.p_id);
    }
    if (filterParams.e_id) {
        baseQuery += " and e_id = ? ";
        queryValues.push(filterParams.e_id);
    }
    if (filterParams.needed_blood_type){
        baseQuery += " and needed_blood_type = ? ";
        queryValues.push(filterParams.needed_blood_type);
    }


    // Sorting

    if (sortParams.length > 0 && sortParams.length === orderParams.length){
        baseQuery += " order by ";
        let tempParams = [];
        for (let i = 0 ; i < sortParams.length; i++ ){ 
            tempParams.push(`${sortParams[i]} ${orderParams[i]}`)
        }
        baseQuery += tempParams.join(", ");
    };

    baseQuery += ";";

    try {
        const [rows] = await db.execute(baseQuery, queryValues);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};



export const getEventParticipant = async ( queryParamsObj )=>{

    const filterParams = queryParamsObj.filters || {};
    const sortParams = queryParamsObj.sort || [];
    const orderParams = queryParamsObj.order || [];
    const queryValues = [];

    // Base Query
    let baseQuery = `
        select d_id, e_id, donated_blood_type
        from Event_Participants
        where 1=1
    `;

    // Dynamic Filters
    if (filterParams.d_id) {
        baseQuery += " and d_id = ? ";
        queryValues.push(filterParams.d_id);
    }
    if (filterParams.e_id) {
        baseQuery += " and e_id = ? ";
        queryValues.push(filterParams.e_id);
    }
    if (filterParams.donated_blood_type){
        baseQuery += " and donated_blood_type = ? ";
        queryValues.push(filterParams.donated_blood_type);
    }


    // Sorting

    if (sortParams.length > 0 && sortParams.length === orderParams.length){
        baseQuery += " order by ";
        let tempParams = [];
        for (let i = 0 ; i < sortParams.length; i++ ){ 
            tempParams.push(`${sortParams[i]} ${orderParams[i]}`)
        }
        baseQuery += tempParams.join(", ");
    };

    baseQuery += ";";

    try {
        const [rows] = await db.execute(baseQuery, queryValues);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};