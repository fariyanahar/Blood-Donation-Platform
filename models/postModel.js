import db from "../config/dbConfig.js";

// Post Table //

//Recipient Specific  
export const createPost = async (dataObj)=>{
    const {
    urgency,date_needed,status,blood_type,address,
    r_id
    } = dataObj; //key-val object
    //console.log("Received data object:", dataObj);
    
    const postQuery = `insert into Post (urgency,date_needed,status,blood_type,address,
    r_id) values (?,?,?,?,?,?)`
    try{
        const [query] = await db.execute(postQuery, [urgency,date_needed,status,blood_type,address,
            r_id]);
        return query.insertId;
    }catch(err){
        console.error(err);
        throw err;
    }
};

// update any param in a post | updates is an object of diff updates
export const updatePost = async (postId,updates)=>{
    const updateQuery = `update Post set `+ 
    Object.keys(updates).map( key => `${key} = ?`).join(", ") +
    `where id = ? ;` ;
    try{
        const [query] = await db.execute(updateQuery, [...Object.values(updates),postId ]);
        return query.affectedRows;
    }catch(err){
        console.error(err);
        throw err;
    }
};

// search and sort based on query params 
export const searchPost = async ( queryParamsObj )=>{

    const filterParams = queryParamsObj.filters ? queryParamsObj.filters : {} ;
    const sortParams = queryParamsObj.sort ? queryParamsObj.sort : [] ;
    const orderParams = queryParamsObj.order ? queryParamsObj.order : [] ;
    let queryParams = [];
    let baseQuery = `select id, urgency, date_needed, status, blood_type, address, r_id
    from Post where 1=1 `
   // sort --> urg, sort --> date_needed, filter postStatus,blood_type,address,recipient_id
    // if (Object.keys(filterParams).length > 0){
    //     baseQuery += Object.keys(filterParams).map(
    //         key => `and ${key} = ?`
    //     ).join(" ") ;
    // }

    if(filterParams.status){
        baseQuery += " and status = ? "
        queryParams.push(filterParams.status);
    }
    if(filterParams.date_needed){
        baseQuery += " and date_needed = ? "
        queryParams.push(filterParams.date_needed);
    }
    if(filterParams.urgency){
        baseQuery += " and urgency = ? "
        queryParams.push(filterParams.urgency);
    }
    if(filterParams.address){
        baseQuery += " and address = ? "
        queryParams.push(filterParams.address);
    }
    if(filterParams.r_id){
        baseQuery += " and r_id = ? "
        queryParams.push(filterParams.r_id);
    }
    if(filterParams.id){
        baseQuery += " and id = ? "
        queryParams.push(filterParams.id);
    }
    if(filterParams.blood_type){
        if(Array.isArray(filterParams.blood_type)){
            // means multiple blood type
            const placeHolder = filterParams.blood_type.map( ()=> "?").join(", ");
            baseQuery += ` blood_type in (${placeHolder}) `;
            queryParams.push(...filterParams.blood_type);
        }else{
            baseQuery += " and blood_type = ? ";
            queryParams.push(filterParams.blood_type);
        }
    }

    if (sortParams.length > 0 && sortParams.length === orderParams.length){
        baseQuery += " order by ";
        let tempParams = [];
        for (let i = 0 ; i < sortParams.length; i++ ){ 
            tempParams.push(`${sortParams[i]} ${orderParams[i]}`)
        }
        baseQuery += tempParams.join(", ");
    };
    

    baseQuery += ";";
    try{
        const [rows] = await db.execute(baseQuery, queryParams);
        return rows;/// results 
    }catch(err){
        console.error(err);
        throw err;
    }
};


// Confirmed_Post Table // 

export const createConfirmedPost = async (dataObj) => {
    const {
        d_id, p_id, preferred_date
    } = dataObj;
    const insertQuery = `insert into Confirmed_Posts (d_id, p_id, preferred_date) values (?, ?, ?)`;
    const noDateQuery = `insert into Confirmed_Posts (d_id, p_id) values (?, ?)`;
    try {
        let query;
        if(!preferred_date){
            [query] = await db.execute(noDateQuery, [d_id, p_id]);
        }else{
            [query] = await db.execute(insertQuery, [d_id, p_id, preferred_date]);
        }
       return query.insertId;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// export const deleteConfirmedPost = async (d_id, p_id) => {
//     const deleteQuery = `delete from Confirmed_Posts where d_id = ? AND p_id = ?`;
//     try {
//         const [query] = await db.execute(deleteQuery, [d_id, p_id]);
//         return query.affectedRows;
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// };


export const searchConfirmedPost = async (queryParamsObj)=>{
    const filterParams = queryParamsObj.filters ? queryParamsObj.filters : {} ;
    const sortParams = queryParamsObj.sort ? queryParamsObj.sort : [] ;
    const orderParams = queryParamsObj.order ? queryParamsObj.order : [] ;
    let queryParams = [];
    let baseQuery = `   
            select User.id as d_id,
            User.name as name,
            User.email as email,
            User.phone as phone,
            User.gender as gender,
            Post.id as p_id,
            Post.urgency as urgency,
            Post.status as status,
            Post.blood_type as blood_type,
            Post.address as address,
            Confirmed_Posts.preferred_date as preferred_date
            from User , Post, Confirmed_Posts
            where User.id = Confirmed_Posts.d_id
            and Confirmed_Posts.p_id = Post.id
            `
    
    if( filterParams.d_id){
        baseQuery += " and User.id = ? "
        queryParams.push(filterParams.d_id);
    }

    if(filterParams.p_id){
        baseQuery += " and Post.id = ? "
        queryParams.push(filterParams.p_id)
    }

    if (sortParams.length > 0 && sortParams.length === orderParams.length){
        baseQuery += " order by ";
        let tempParams = [];
        for (let i = 0 ; i < sortParams.length; i++ ){ 
            tempParams.push(`${sortParams[i]} ${orderParams[i]}`)
        }
        baseQuery += tempParams.join(", ");
    };
    
    baseQuery += ";";
    try{
        const [rows] = await db.execute(baseQuery, queryParams);
        return rows;
    }catch(err){
        console.error(err);
        throw err;
    }
}; 



