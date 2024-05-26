import { collection, getDocs } from "firebase/firestore";
import { handleFirebaseDate } from "./handleFirebaseDate";
import { db } from "./firebase";

export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    if (querySnapshot.docs) {
      const allDocumentData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const dateCreatedAtTimestamp = data.dateCreated;
        const dateEditedAtTimestamp = data.dateEdited;
        if (dateCreatedAtTimestamp) {
          const dateCreatedAtString = handleFirebaseDate(data.dateCreated);
          if (dateEditedAtTimestamp) {
            const dateEditedAtString = handleFirebaseDate(data.dateEdited);
            return {
              id: doc.id,
              ...data,
              dateCreated: dateCreatedAtString,
              dateEdited: dateEditedAtString,
            };
          }
          return { id: doc.id, ...data, dateCreated: dateCreatedAtString };
        } else {
          return { id: doc.id, ...data, dateCreated: "Date Not Avaliable" };
        }
      });
      return allDocumentData;
    }
  } catch (e) {
    console.log("error: ", e);
  }
};

export const getAllDocumentsWithoutDate = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    if (querySnapshot.docs) {
      const allDocumentData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log(data);
        return { id: doc.id, ...data };
      });

      return allDocumentData;
    }
  } catch (e) {
    console.log("error: ", e);
  }
};
