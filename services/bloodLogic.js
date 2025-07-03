// type and array of types they are allowed to donate to
const bloodDonationMap = {
  "O-": ["O-", "A-", "B-", "AB-"], 
  "O+": ["O+", "A+", "B+", "AB+"], 
  "A-": ["A-", "A+", "AB-", "AB+"], 
  "A+": ["A+", "AB+"], 
  "B-": ["B-", "B+", "AB-", "AB+"], 
  "B+": ["B+", "AB+"], 
  "AB-": ["AB-", "AB+"], 
  "AB+": ["AB+"] 
};


// type and array of types they are allowed to recieve from
const bloodReceiveMap = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"]
};


  // type : [ allowed reciever ]
  // use it during post search 
export const isValidDonor = (bloodInfo)=> {
  const { donorType , postType } = bloodInfo;
  const allowedType = bloodDonationMap[donorType.toUpperCase()];
  const res = allowedType.includes(postType.toUpperCase());
  if(res){
    return {
      result : true,
      types: allowedType
    }
  }
  return {
    result : false,
    types : null
  }
} ;


export const isValidReceiver = (bloodInfo)=> {
  const { receiverType , postType } = bloodInfo;
  const allowedType = bloodReceiveMap[receiverType.toUpperCase()];
  const res = allowedType.includes(postType.toUpperCase());
  if(res){
    return {
      result : true,
      types: allowedType
    }
  }
  return {
    result : false,
    types : null
  }
} ;


export const isAvailableForDonation = (dateString, dateNeeded = new Date() )=>{
  const last_donation_date = new Date(dateString); 
  const targetDate = new Date(dateNeeded);

  const differenceInMilliseconds = targetDate - last_donation_date;
  // Convert the difference to days
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  return differenceInDays > 60;
}

