import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  storageBucket: ''

};
export function fetch(callFunctionAfterFetch) {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const starCountRef = ref(db, '/some_node/some_node');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    callFunctionAfterFetch(data.URL.split(","));
  });
}
