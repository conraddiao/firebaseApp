const db = firebaseApp.firestore();
let user;

const authButton = document.getElementById("authButton");
authButton.addEventListener("click", () => { googleLogin() }, false);

// const fetchWatchlistButton = document.getElementById("fetchWatchlistButton");
// authButton.addEventListener("click", () => {fetchWatchlistIdentities(user.watchlist)}, false);

//authenticate with Firebase; 
//if there is a document that matches the user.uid, update that doc's display name, email, photo, etc.
//else create a document for that user.
function googleLogin() {
  console.log("trying login...");
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      user = result.user;
      db.collection("users").doc(user.uid).set(
        {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          watchlist: []
        },
        { merge: true }
      );
      document.getElementById("authButton").innerHTML = `${user.email}`;
      console.log(db.collection('users').doc(user.uid).get().then((doc) => {
        console.log("Cached document data:", doc.data());
      }).catch((error) => {
        console.log("Error getting cached document:", error);
      }));
    });
}

function fetchWatchlistIdentities(watchlist) {
  console.log("fetching identities...");
  const IDTableBody = document.querySelector("#identitiyTable tbody");
  db.collection("identities")
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot);
      watchlist.forEach((doc) => {
        const data = doc.data();
        const row = IDTableBody.insertRow();
        row.insertCell(0).textContent = data.firstName + " " + data.lastName;
        row.insertCell(1).textContent = data.firstName;
        row.insertCell(2).textContent = data.leetcodeUsername;
      });
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}

function fetchLeetcodeData(leetcodeUsername) {
  const endpoint = "https://leetcode-stats-api.herokuapp.com/";
  console.log(`fetching leetcode data of: ${leetcodeUsername}`);
  fetch(`${endpoint}` + `${leetcodeUsername}`).then((res) => {
    console.log(res.json());
  });
}

const fetchLeetcodeDataButton = document.getElementById(
  "fetchLeetcodeUsernameButton"
);
fetchLeetcodeDataButton.addEventListener(
  "click",
  () => {
    fetchLeetcodeData("bob");
  },
  false
);

const addUserForm = document.getElementById("addUserForm");
addUserForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(addUserForm);
  const formData = new FormData(addUserForm);
  handleFormSubmission(formData);
});

function handleFormSubmission(formData) {
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  db.collection("identities")
    .add(data)
    .then((identityDocument) => {
      db.collection("users")
        .doc(user.uid)
        .set(
          {
            watchlist: firebase.firestore.FieldValue.arrayUnion(
              identityDocument.id
            ),
          },
          { merge: true }
        );
      console.log(
        "Identity written to current user's watchlist: ",
        identityDocument.id
      );
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}
