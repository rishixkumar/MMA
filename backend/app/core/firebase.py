# backend/app/core/firebase.py

class DummyMessaging:
    def send(self, payload):
        print("FAKE FCM send:", payload)

messaging = DummyMessaging()
