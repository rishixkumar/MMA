# backend/app/core/firebase.py

import firebase_admin
from firebase_admin import credentials, messaging
import os

cred = credentials.Certificate(
    os.path.join(os.path.dirname(__file__), '../../fcm_test.json')
)
firebase_admin.initialize_app(cred)

