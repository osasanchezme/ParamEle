// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref as databaseRef, set, get, child, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getBlob } from "firebase/storage";
import utils from "../utils";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChvL08gY4kQ3Egyf-MhYQCZJsGu87GQDA",
  authDomain: "paramele-db.firebaseapp.com",
  projectId: "paramele-db",
  storageBucket: "paramele-db.appspot.com",
  messagingSenderId: "30374524404",
  appId: "1:30374524404:web:f926af7fd309b4d7c3f5a1",
  measurementId: "G-EV52NKKTD1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Authentication
const auth = getAuth();

/**
 *
 * @param {{name:{value:string, valid: boolean, error_msg:string}, industry:{value:string, valid: boolean, error_msg:string}, company:{value:string, valid: boolean, error_msg:string}, email:{value:string, valid: boolean, error_msg:string}, password:{value:string, valid: boolean, error_msg:string}}} validated_user_data
 */
function createUserWithEmail(validated_user_data) {
  createUserWithEmailAndPassword(auth, validated_user_data.email.value, validated_user_data.password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("User created successfully");
      updateUserProfile(validated_user_data);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("There was a problem: ", errorMessage);
      // ..
    });
}

function signOutUser() {
  signOut(auth)
    .then(() => {
      utils.setUser(null);
    })
    .catch((error) => {
      console.log("There was a problem: ", error);
    });
}

function logInUserWithEmail(validated_user_data) {
  signInWithEmailAndPassword(auth, validated_user_data.email.value, validated_user_data.password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`There was a problem: ${errorMessage} (${errorCode})`);
      // TODO - Handle problems
    });
}

/**
 *
 * @param {{name:{value:string, valid: boolean, error_msg:string}, industry:{value:string, valid: boolean, error_msg:string}, company:{value:string, valid: boolean, error_msg:string}, email:{value:string, valid: boolean, error_msg:string}, password:{value:string, valid: boolean, error_msg:string}}} validated_user_data
 */
function updateUserProfile(validated_user_data) {
  let user = auth.currentUser;
  let username = validated_user_data.name.value.split(" ")[0];
  updateProfile(user, {
    displayName: username,
  })
    .then(() => {
      const db = getDatabase();
      set(databaseRef(db, "users/" + user.uid), {
        name: validated_user_data.name.value,
        username,
        email: validated_user_data.email.value,
        company: validated_user_data.company.value,
        industry: validated_user_data.industry.value,
      })
        .then(() => {
          console.log("User profile updated successfully");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`There was a problem: ${errorMessage} (${errorCode})`);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`There was a problem: ${errorMessage} (${errorCode})`);
    });
}

function getUserProjects(callback) {
  let user = auth.currentUser;
  const dbRef = databaseRef(getDatabase());
  get(child(dbRef, `users/${user.uid}/projects`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function getPathInDatabaseFromLocal(location) {
  let user = auth.currentUser;
  let db_path = `users/${user.uid}/projects`;
  // Get the path up to the grandparent of the new folder
  for (let i = 1; i < location.length - 1; i++) {
    db_path += `/${location[i]}/content`;
  }
  // Add the parent folder (if it is not home)
  if (location.length > 1) {
    db_path += `/${location[location.length - 1]}/content`;
  }
  return db_path;
}

function createNewFolderForUser(folder_name, location, is_first_child, callback) {
  let db_path = getPathInDatabaseFromLocal(location);
  // Append the new folder name to the path
  db_path += `/${folder_name}`;
  const current_time = Date.now();
  let new_folder = {
    id: utils.generateUniqueID("folder"),
    last_modified: current_time,
    created: current_time,
    role: "owner",
    shared: false,
  };
  let updates = {};
  updates[db_path] = new_folder;
  function returnDataToTheCallback(new_folder, callback) {
    let return_data = {};
    if (new_folder.hasOwnProperty("content")) new_folder = new_folder.content;
    return_data[folder_name] = new_folder;
    callback(return_data, true);
  }
  update(databaseRef(getDatabase()), updates)
    .then(() => {
      // Do not read again from the data base but only get the new data to the file manager
      returnDataToTheCallback(new_folder, callback);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorMessage.includes("Cannot set properties of undefined"))
        // Do not read again from the data base but only get the new data to the file manager
        returnDataToTheCallback(new_folder, callback);
      console.log(`There was a problem: ${errorMessage} (${errorCode})`);
    });
}

function saveFileToCloud(model_blob, file_name, file_id, version_id, location, callback) {
  uploadModelToStorage(model_blob, file_name, file_id, version_id, location, callback);
}

function createRefToFileForUser(location, file_name, file_id, version_id, callback) {
  let db_path = getPathInDatabaseFromLocal(location);
  // Append the new file name to the path
  db_path += `/${file_name}`;
  let new_file = {
    id: file_id,
    current_version: version_id,
    created: version_id,
    role: "owner",
    shared: false,
    history: {},
  };
  new_file.history[version_id] = {
    num_nodes: 12,
  };
  let updates = {};
  updates[db_path] = new_file;
  update(databaseRef(getDatabase()), updates)
    .then(() => {
      // Do not read again from the data base but only get the new data to the file manager
      let return_data = {};
      return_data[file_name] = new_file;
      callback(return_data);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`There was a problem: ${errorMessage} (${errorCode})`);
    });
}

function uploadModelToStorage(model_blob, file_name, file_id, version_id, location, callback) {
  const storage = getStorage();
  const model_ref = storageRef(storage, `projects/${file_id}/${version_id}/model.json`);
  uploadBytes(model_ref, model_blob).then((snapshot) => {
    console.log("File uploaded successfully!");
    createRefToFileForUser(location, file_name, file_id, version_id, callback);
  });
}

function openFileFromCloud(file_id, version_id, callback) {
  const storage = getStorage();
  const model_ref = storageRef(storage, `projects/${file_id}/${version_id}/model.json`);
  // To get this working had to set up the CORS in GCloud
  getBlob(model_ref)
    .then((blob) => {
      blob
        .text()
        .then((data) => {
          callback(JSON.parse(data));
        })
        .catch((error) => {
          console.log(`Error parsing the blob: ${error}`);
        });
    })
    .catch((error) => {
      console.error("Error getting the download URL:", error);
    });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    utils.setUser(user);
  } else {
    utils.setUser(null);
  }
});

const Firebase = {
  createUserWithEmail,
  signOutUser,
  logInUserWithEmail,
  getUserProjects,
  createNewFolderForUser,
  saveFileToCloud,
  openFileFromCloud,
};

export default Firebase;
