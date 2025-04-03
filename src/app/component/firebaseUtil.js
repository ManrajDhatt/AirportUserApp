import { db } from "../lib/firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { app } from "../lib/firebase";

const auth = getAuth(app);

// ✅ Fetch all stores from Firestore
export const fetchStores = async () => {
	try {
		const storesCollection = collection(db, "stores");
		const storesSnapshot = await getDocs(storesCollection);
		const storesList = storesSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return storesList;
	} catch (error) {
		console.error("❌ Error fetching stores:", error);
		return [];
	}
};

// ✅ Fetch categories for a store (Handles both subcollection & field storage)
export const getCategoriesForStore = async (storeID) => {
	try {
		if (!storeID) throw new Error("⚠️ storeID is undefined.");

		// 1️⃣ Try fetching categories as a subcollection
		const categoriesRef = collection(db, `stores/${storeID}/categories`);
		const querySnapshot = await getDocs(categoriesRef);

		let categories = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

		// 2️⃣ If no categories found, check if stored as a field
		if (categories.length === 0) {
			const storeRef = doc(db, "stores", storeID);
			const storeSnap = await getDoc(storeRef);

			if (storeSnap.exists()) {
				const storeData = storeSnap.data();
				if (storeData.category) {
					categories = Array.isArray(storeData.category)
						? storeData.category.map((cat, index) => ({ id: `category_${index}`, name: cat }))
						: [{ id: "category_0", name: storeData.category }];
				}
			}
		}

		return categories;
	} catch (error) {
		console.error("❌ Error fetching categories:", error);
		return [];
	}
};

// ✅ Fetch all products for a specific category in a store
export const getProductsForCategory = async (storeID, categoryID) => {
	try {
		const productsRef = collection(db, `stores/${storeID}/categories/${categoryID}/products`);
		const querySnapshot = await getDocs(productsRef);

		return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("❌ Error fetching products:", error);
		return [];
	}
};

// ✅ Fetch product details by ID
export const getProductDetails = async (storeID, categoryID, productId) => {
	try {
		const productRef = doc(db, "stores", storeID, "categories", categoryID, "products", productId);
		const docSnap = await getDoc(productRef);

		if (!docSnap.exists()) throw new Error("Product not found");
		return docSnap.data();
	} catch (error) {
		console.error("❌ Error fetching product details:", error);
		throw error;
	}
};

// ✅ Fetch a product by ID from Firestore
export const getProductById = async (storeID, categoryID, productId) => {
	try {
		const productRef = doc(db, `stores/${storeID}/categories/${categoryID}/products`, productId);
		const docSnap = await getDoc(productRef);

		if (!docSnap.exists()) throw new Error("Product not found");

		const productData = docSnap.data();
		return {
			id: docSnap.id,
			catalogueProductName: productData.catalogueProductName,
			catalogueCategoryName: productData.catalogueCategoryName,
			productImageUrl: productData.productImageUrl,
			productDescription: productData.productDescription,
			price: productData.price,
			stock: productData.stock,
		};
	} catch (error) {
		console.error("❌ Error fetching product:", error);
		throw error;
	}
};

// ✅ User Authentication
export const loginUser = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		return userCredential.user;
	} catch (error) {
		console.error("❌ Login Error:", error.message);
		throw error;
	}
};

export const registerUser = async (email, password) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		return userCredential.user;
	} catch (error) {
		console.error("❌ Registration Error:", error.message);
		throw error;
	}
};

export const logoutUser = async () => {
	try {
		await signOut(auth);
		toast.success("Logged out successfully!");
	} catch (error) {
		console.error("❌ Logout Error:", error.message);
		throw error;
	}
};