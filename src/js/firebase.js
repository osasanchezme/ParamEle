// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDatabase, ref as databaseRef, set, get, child, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getBlob, deleteObject } from "firebase/storage";
import utils from "../utils";
import { notify } from "../components/notification";
import file from "./file";
import { getProcessResponseObject } from "./processResponse";

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
  utils.showLoadingDimmer("logging_out");
  signOut(auth)
    .then(() => {
      utils.setUser(null);
      utils.hideLoadingDimmer();
      file.reloadToBlank();
    })
    .catch((error) => {
      console.log("There was a problem: ", error);
    });
}

/**
 * Logs a user in user email and password
 * @param {*} validated_user_data
 * @param {import("./types").ParamEleProcessResponseHandlerCallback} callback
 */
function logInUserWithEmail(validated_user_data, callback) {
  signInWithEmailAndPassword(auth, validated_user_data.email.value, validated_user_data.password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      callback(getProcessResponseObject("success"));
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`There was a problem: ${errorMessage} (${errorCode})`);
      callback(getProcessResponseObject("error", error.code));
    });
}

/**
 * Sends an email to reset the password to a user
 * @param {import("./types").ParamEleFormStateObject} validated_user_data
 * @param {import("./types").ParamEleProcessResponseHandlerCallback} callback
 */
function sendEmailToResetPassword(validated_user_data, callback) {
  const local_auth = getAuth();
  const email = validated_user_data["email"].value;
  sendPasswordResetEmail(local_auth, email)
    .then(() => {
      callback(getProcessResponseObject("success"));
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`There was a problem: ${errorMessage} (${errorCode})`);
      callback(getProcessResponseObject("error", error.code));
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
  let user_id = user ? user.uid : "_public";
  get(child(dbRef, `users/${user_id}/projects`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        console.log("No data available for this user under projects");
        // Return an empty object
        callback({});
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function getProjectData(file_path, file_name, callback) {
  const dbRef = databaseRef(getDatabase());
  let db_path = getPathInDatabaseFromLocal(file_path);
  db_path += `/${file_name}`;
  get(child(dbRef, db_path))
    .then((snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        console.log("That project does not exist for this user");
        // Return an empty object
        callback({});
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function getPathInDatabaseFromLocal(location) {
  let user = auth.currentUser;
  let user_id = user ? user.uid : "_public";
  let db_path = `users/${user_id}/projects`;
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

/**
 * Saves a file to the cloud in the right location and creates a reference to the file in the database if needed
 * @param {*} model_blob
 * @param {*} file_name
 * @param {*} file_id
 * @param {*} version_id
 * @param {*} location
 * @param {*} callback
 * @param {*} is_new_version
 * @param {*} commit_msg
 * @param {"model"|"results"} file_type
 */
function saveFileToCloud(model_blob, file_name, file_id, version_id, location, callback, is_new_version, commit_msg, file_type = "model") {
  const storage = getStorage();
  const model_ref = storageRef(storage, `projects/${file_id}/${version_id}/${file_type}.json`);
  uploadBytes(model_ref, model_blob).then((snapshot) => {
    console.log("File uploaded successfully!");
    if (file_type === "model") {
      createRefToModelFileForUser(location, file_name, file_id, version_id, callback, is_new_version, commit_msg);
    } else {
      updateRefToResultsFileForUser(location, file_name, file_id, version_id, callback);
    }
  });
}

function updateRefToResultsFileForUser(location, file_name, file_id, version_id, callback) {
  let db_path = getPathInDatabaseFromLocal(location);
  // Append the new file name to the path
  db_path += `/${file_name}`;
  // Create the updates object
  let updates = {};
  updates[`${db_path}/history/${version_id}/results_available`] = true;
  update(databaseRef(getDatabase()), updates)
    .then(() => {
      callback(true);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`There was a problem: ${errorMessage} (${errorCode})`);
    });
}

function updateCommitMsgForUser(location, file_name, version_id, commit_msg, callback) {
  let db_path = getPathInDatabaseFromLocal(location);
  // Append the new file name to the path
  db_path += `/${file_name}`;
  // Create the updates object
  let updates = {};
  updates[`${db_path}/history/${version_id}/commit_msg`] = commit_msg;
  update(databaseRef(getDatabase()), updates)
    .then(() => {
      callback(true);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`There was a problem: ${errorMessage} (${errorCode})`);
    });
}

function createRefToModelFileForUser(location, file_name, file_id, version_id, callback, is_new_version, commit_msg) {
  let db_path = getPathInDatabaseFromLocal(location);
  // Append the new file name to the path
  db_path += `/${file_name}`;
  // Create the updates object
  let updates = {};
  // Create the new_file object
  let new_file = {
    id: file_id,
    current_version: version_id,
    created: version_id,
    role: "owner",
    shared: false,
    history: {},
  };
  if (!is_new_version) {
    new_file.history[version_id] = {
      num_nodes: 12,
      results_available: false,
    };
    updates[db_path] = new_file;
  } else {
    // Set the new file equal to null not to return useless data
    new_file = null;
    // Update the current_version
    updates[`${db_path}/current_version`] = version_id;
    // Update the history
    updates[`${db_path}/history/${version_id}`] = { num_nodes: 13, commit_msg, results_available: false };
  }
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

function openFileFromCloud(file_id, version_id, file_type = "model", callback) {
  const storage = getStorage();
  const file_ref = storageRef(storage, `projects/${file_id}/${version_id}/${file_type}.json`);
  // To get this working had to set up the CORS in GCloud
  getBlob(file_ref)
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

function deleteFileVersionFromCloud(file_name, file_path, model_id, version_id, results_available, current_version, callback) {
  // Delete the file (both model and results)
  const storage = getStorage();
  if (String(current_version) === String(version_id)) {
    notify("warning", "cannot_delete_version", "", true);
    callback();
    return;
  }
  // Something is not working when deleting the reference in the realtime database
  deleteFile("model", function () {
    if (results_available) {
      deleteFile("results", () => {
        deleteVersionReference(callback);
      });
    } else {
      deleteVersionReference(callback);
    }
  });

  function deleteVersionReference(callback) {
    let db_path = getPathInDatabaseFromLocal(file_path);
    // Append the file name and version_id to the path
    db_path += `/${file_name}/history/${version_id}`;
    let updates_remove = {};
    updates_remove[db_path] = null;
    update(databaseRef(getDatabase()), updates_remove)
      .then(() => {
        console.log("Deleted the reference");
        callback();
      })
      .catch((error) => {
        console.error("Error deleting the version reference: ", error);
      });
  }
  /**
   * Deletes a file from the storage
   * @param {"model"|"results"} type
   * @param {Function} success_callback
   */
  function deleteFile(type, success_callback) {
    const file_ref = storageRef(storage, `projects/${model_id}/${version_id}/${type}.json`);
    deleteObject(file_ref)
      .then(() => {
        console.log(`Deleted the ${type}!`);
        success_callback();
      })
      .catch((error) => {
        console.error("Error deleting the version folder: ", error);
      });
  }
}

function attachToAuthChangeFirebaseEvent(function_to_attach) {
  onAuthStateChanged(auth, function_to_attach);
}

const Firebase = {
  createUserWithEmail,
  signOutUser,
  logInUserWithEmail,
  getUserProjects,
  createNewFolderForUser,
  saveFileToCloud,
  openFileFromCloud,
  getProjectData,
  updateCommitMsgForUser,
  deleteFileVersionFromCloud,
  attachToAuthChangeFirebaseEvent,
  sendEmailToResetPassword
};

export default Firebase;
