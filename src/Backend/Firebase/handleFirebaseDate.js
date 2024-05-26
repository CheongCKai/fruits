export const handleFirebaseDate = (inputDate) => {
    const date = new Date(
      inputDate.seconds * 1000 + inputDate.nanoseconds / 1000000
    );
    date.setHours(date.getHours() + 8);
  
    const extractedDateString = date.toUTCString().slice(0, -7);
    // const extractedDateString = date.toLocaleString("en-US", {
    //   timeZone: "Asia/Singapore",
    // });
    // const extractedDateString = date.toLocaleString("en-US", {
    //   day: "2-digit",
    //   month: "short",
    //   year: "numeric",
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   timeZone: "Asia/Singapore",
    //   hour12: false, // Use 24-hour format
    // });
  
    return extractedDateString;
  };
  
  export const handleFirebaseDateWithSeconds = (inputDate) => {
    const date = new Date(
      inputDate.seconds * 1000 + inputDate.nanoseconds / 1000000
    );
    date.setHours(date.getHours() + 8);
    const extractedDateString = date.toUTCString().slice(0, -4);
  
    return extractedDateString;
  };
  
  //difference between timestamps
  export const calculateDifferenceInHours = (startTime, endTime) => {
    // Convert both times to seconds
    let startInSeconds = startTime.seconds + startTime.nanoseconds / 1e9;
    let endInSeconds = endTime.seconds + endTime.nanoseconds / 1e9;
  
    // Calculate the difference in seconds
    let differenceInSeconds = endInSeconds - startInSeconds;
  
    // Calculate hours and minutes from the difference in seconds
    let hours = Math.floor(differenceInSeconds / 3600); // Get whole hours
    let remainderSeconds = differenceInSeconds % 3600;
    let minutes = Math.floor(remainderSeconds / 60); // Get remainder minutes
    let seconds = Math.floor(remainderSeconds % 60); // Get remaining seconds
  
    // Format output
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  
  // Example usa
  