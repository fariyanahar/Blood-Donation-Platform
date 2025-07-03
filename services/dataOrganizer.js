
export const organizeEvents = (rawData) => {
    // Group events by Event_ID and format the structure
    const events = {};

    rawData.forEach(row => {    //every row is an obj
      if (!events[row.EventID]) {
        events[row.EventID] = {
          EventID: row.EventID,
          EventName: row.EventName,
          EventDate: row.EventDate,
          EventAddress: row.EventAddress,
          Organizer: row.Organizer,
          Participants: {} // Initialize empty participants array
        };
      }
  
      // Add participants to the event
      if (row.DonorId) {
        events[row.EventID].Participants[row.DonorId] = row.DonorBloodType;
      }
    });
  
    // Convert object back to an array
    return Object.values(events);
  };
  