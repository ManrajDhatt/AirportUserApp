// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics"
// import { getFirestore } from "firebase/firestore"
// // import firebase from "firebase/compat/app"
// import { getAuth ,setPersistence,browserLocalPersistence} from "firebase/auth"
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
// 	apiKey: "AIzaSyCFRU1ogUpo04YnQvlu3xfvatWtZQLayQw",
// 	authDomain: "airportproject-93b9e.firebaseapp.com",
// 	projectId: "airportproject-93b9e",
// 	storageBucket: "airportproject-93b9e.firebasestorage.app",
// 	messagingSenderId: "665815564201",
// 	appId: "1:665815564201:web:628c891e7e26ffde4e4eb8",
// 	measurementId: "G-VPJBMFKR2C",
// }

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig)

// export const db = getFirestore(app)
// const auth = getAuth(app)
// export const firestore = getFirestore(app)
// export default firebase

// setPersistence(auth,browserLocalPersistence)

// export { auth };






// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCFRU1ogUpo04YnQvlu3xfvatWtZQLayQw",
	authDomain: "airportproject-93b9e.firebaseapp.com",
	projectId: "airportproject-93b9e",
	storageBucket: "airportproject-93b9e.appspot.com", // ✅ Fixed incorrect domain
	messagingSenderId: "665815564201",
	appId: "1:665815564201:web:628c891e7e26ffde4e4eb8",
	measurementId: "G-VPJBMFKR2C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth and set session persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
	console.error("Firebase persistence error:", error);
});

// Export Firebase services
export { app, db, auth };
