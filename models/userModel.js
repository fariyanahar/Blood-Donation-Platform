import db from "../config/dbConfig.js";

export const searchUser = async ( queryParamsObj )=>{

    const filterParams = queryParamsObj.filters ? queryParamsObj.filters : {} ;
    const sortParams = queryParamsObj.sort ? queryParamsObj.sort : [] ;
    const orderParams = queryParamsObj.order ? queryParamsObj.order : [] ;
    console.log(filterParams)

    let baseQuery = `select id, name, email, password, phone, gender, role, address, last_donation_date,
    blood_type, date_of_birth from User where 1=1 `
    

    if(filterParams.name){
        baseQuery += "and name like ? "
    }

    if(filterParams.id){
        baseQuery += "and id = ? "
    }
    
    if(filterParams.email){
        baseQuery += "and email = ? "
    }

    if(filterParams.blood_type){
        baseQuery += "and blood_type = ? "
    }

    if(filterParams.gender){
        baseQuery += "and gender = ? "
    }

    if(filterParams.role){
        baseQuery += "and role = ? "
    }
    
    if(filterParams.address){
        baseQuery += "and address = ? "
    }

    if(filterParams.date_of_birth){
        baseQuery += "and date_of_birth = ? "
    }

    if(filterParams.last_donation_date){
        baseQuery += "and last_donation_date = ? "
    }
    

// last_don_date and/or d_o_b are all pssible sorting 
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
        console.log(baseQuery)
        console.log(filterParams)
        const [rows] = await db.execute(baseQuery, Object.values(filterParams));
        return rows;
    }catch(err){
        console.error(err);
        throw err;
    }
};


export const updateUser = async (userId,updateObj)=>{
   // updateObj => req.body
  // Filter out the 'id' field from the updateObj
    const filteredUpdateObj = Object.keys(updateObj)
        .filter(key => key !== 'id') // Exclude 'id'
        .reduce((obj, key) => {
        obj[key] = updateObj[key];
        return obj;
        }, {});

    const updateQuery = `update User set `+ 
    Object.keys(filteredUpdateObj).map( key => `${key} = ?`).join(", ") +
    `where id = ? ;` ;
    try{
        const [query] = await db.execute(updateQuery, [...Object.values(filteredUpdateObj), userId ]);
        return query.affectedRows;
    }catch(err){
        console.error(err);
        throw err;
    }
};
