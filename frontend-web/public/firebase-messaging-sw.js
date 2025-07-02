importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDCazEwnQ6uaBB32qYl4CuQsoQCJcFXSjI",
  authDomain: "mma-medication-management.firebaseapp.com",
  projectId: "mma-medication-management",
  storageBucket: "mma-medication-management.appspot.com",
  messagingSenderId: "703695162672",
  appId: "1:703695162672:web:a739741dd13ce7c87f0cf5",
  measurementId: "G-3C09R29SVN"
};





firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/mma-logo.png'
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
