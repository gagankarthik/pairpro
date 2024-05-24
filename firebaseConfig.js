import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC_7EFWC0zUitCFML6vSLTKNo0bExA2rKE",
    authDomain: "streamline-69d1c.firebaseapp.com",
    projectId: "streamline-69d1c",
    storageBucket: "streamline-69d1c.appspot.com",
    messagingSenderId: "1047282897317",
    appId: "1:1047282897317:web:afb8460a824c158f2c184c",
    measurementId: "G-T3QH6S2QP6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { database,auth,signInAnonymously };
