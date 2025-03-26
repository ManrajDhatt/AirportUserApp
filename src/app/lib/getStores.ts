import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

// Define the Store type
type Store = {
  storeId: string;
  category: string;
  addressOne: string;
  addressTwo: string;
  status: string;
  email: string;
  storeNumber: string;
  storeName: string;
};

export async function getStores(): Promise<Store[]> {
  const storesCollection = collection(db, "stores");
  const storeSnapshot = await getDocs(storesCollection);

  return storeSnapshot.docs.map((doc) => ({
    storeId: doc.id,
    category: doc.data().category || "",
    addressOne: doc.data().addressOne || "",
    addressTwo: doc.data().addressTwo || "",
    status: doc.data().status || "",
    email: doc.data().email || "",
    storeNumber: doc.data().storeNumber || "",
    storeName: doc.data().storeName || "",
  }));
}
