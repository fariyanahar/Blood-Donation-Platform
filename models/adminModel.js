import db from "../config/dbConfig.js";


export const searchAdmin = async (queryObj) =>{
    const filterParams = queryObj.filters ? queryObj.filters : {} ;
    let baseQuery = `select id, name, email, password, phone, role from Admin where 1=1 `

    if(filterParams.email){
        baseQuery += " and email = ? ";
    }

    if(filterParams.id){
        baseQuery += " and id = ? " ;
    }

    baseQuery += ";"
    try{
        const [res] = await db.execute(baseQuery, Object.values(filterParams));
        return res;
    }catch(err){
        console.error(err);
        throw err;
    }
}


// delete any data from any table by any role 
export const deleteData = async (deleteParams)=>{
    let baseQuery = `delete from ${deleteParams.tableName} where 1=1 `
    let deleteValues = [];
    
    if (deleteParams.id){
        baseQuery += " and id = ? ";
        deleteValues.push(deleteParams.id);
    };

    if (deleteParams.r_id){
        baseQuery += " and r_id = ? ";
        deleteValues.push(deleteParams.r_id);
    };

    if (deleteParams.d_id){
        baseQuery += " and d_id = ? ";
        deleteValues.push(deleteParams.d_id);
    };
    
    if (deleteParams.p_id){
        baseQuery += " and p_id = ? ";
        deleteValues.push(deleteParams.p_id);
    };

    if (deleteParams.e_id){
        baseQuery += " and e_id = ? ";
        deleteValues.push(deleteParams.e_id);
    };
    
    baseQuery += ";"

    try {
        const [query] = await db.execute(baseQuery, deleteValues);
        return query.affectedRows;
    } catch (err) {
        console.error(err);
        throw err;
    }   
};


export const updateTable = async (updateObj) => {
    // tableName must me added to the up obj from post controller and PROPERLY 
    const { id, tableName } = updateObj;

    // filter out id and tableName from updateObj
    const filteredUpdateObj = Object.keys(updateObj)
        .filter(key => key !== 'id' && key !== 'tableName') // Exclude both 'id' and 'tableName'
        .reduce((obj, key) => {
            obj[key] = updateObj[key]; 
            return obj;
        }, {});

    // Construct the update query
    const updateQuery = `update ${tableName} set ` + 
        Object.keys(filteredUpdateObj).map(key => `${key} = ?`).join(", ") +
        ` where id = ? ;`;

    try {
        const [query] = await db.execute(updateQuery, [...Object.values(filteredUpdateObj), id]);
        return query.affectedRows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};