import firebase from 'firebase'

var configProduction = {
  apiKey: 'AIzaSyAiWh5IrV1gIWDUfSF7ONYHix5KheTfglI',
  authDomain: 'littodoproduction.firebaseapp.com',
  databaseURL: 'https://littodoproduction.firebaseio.com',
  projectId: 'littodoproduction',
  storageBucket: '',
  messagingSenderId: '824063244764',
}

const configDevelopment = {
  apiKey: 'AIzaSyA-Jj2KUhoDrfIm_tNg8uq6PLeeBC2w5GM',
  authDomain: 'littodo.firebaseapp.com',
  databaseURL: 'https://littodo.firebaseio.com',
  projectId: 'littodo',
  storageBucket: 'littodo.appspot.com',
  messagingSenderId: '1089969452630',
}

if (process.env.NODE_ENV === 'development') {
  firebase.initializeApp(configDevelopment)
} else {
  firebase.initializeApp(configProduction)
}

export default firebase

const fb = firebase.firestore()
export const firebaseDocument = (collection, document) => {
  let unsubscribeFunction

  function subscribe(callback) {
    unsubscribeFunction = fb
      .collection(collection)
      .doc(document)
      .onSnapshot(doc => {
        callback(doc.data())
      })
  }

  function unsubscribe() {
    if (typeof unsubscribeFunction === 'function') {
      unsubscribeFunction()
    }
  }

  function set(data) {
    fb.collection(collection)
      .doc(document)
      .set(data)
  }

  return {
    set: set,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
  }
}
