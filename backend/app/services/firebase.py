try:
    import firebase_admin
    from firebase_admin import credentials, firestore, auth
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False
    print("⚠️  Firebase Admin SDK not installed. Using mock database.")

from app.config import settings
import os

db = None
mock_db = {}  # In-memory storage for testing

class MockFirestore:
    """Mock Firestore for local testing without Firebase credentials"""
    
    def __init__(self):
        self.data = mock_db
    
    def collection(self, name):
        if name not in self.data:
            self.data[name] = {}
        return MockCollection(self.data[name])

class MockCollection:
    def __init__(self, data):
        self.data = data
    
    def document(self, doc_id=None):
        if doc_id is None:
            import uuid
            doc_id = str(uuid.uuid4())
        return MockDocument(self.data, doc_id)
    
    def where(self, field, op, value):
        return MockQuery(self.data, field, op, value)
    
    def stream(self):
        for doc_id, doc_data in self.data.items():
            yield MockDocumentSnapshot(doc_id, doc_data)

class MockQuery:
    def __init__(self, data, field, op, value):
        self.data = data
        self.field = field
        self.op = op
        self.value = value
    
    def limit(self, count):
        return self
    
    def get(self):
        results = []
        for doc_id, doc_data in self.data.items():
            if self.op == '==' and doc_data.get(self.field) == self.value:
                results.append(MockDocumentSnapshot(doc_id, doc_data))
        return results
    
    def stream(self):
        for doc_id, doc_data in self.data.items():
            if self.op == '==' and doc_data.get(self.field) == self.value:
                yield MockDocumentSnapshot(doc_id, doc_data)

class MockDocument:
    def __init__(self, collection_data, doc_id):
        self.collection_data = collection_data
        self.id = doc_id
    
    def set(self, data):
        self.collection_data[self.id] = data
    
    def get(self):
        return MockDocumentSnapshot(self.id, self.collection_data.get(self.id))
    
    def update(self, data):
        if self.id in self.collection_data:
            self.collection_data[self.id].update(data)
    
    def delete(self):
        if self.id in self.collection_data:
            del self.collection_data[self.id]

class MockDocumentSnapshot:
    def __init__(self, doc_id, data):
        self.id = doc_id
        self._data = data
    
    @property
    def exists(self):
        return self._data is not None
    
    def to_dict(self):
        return self._data if self._data else {}

def initialize_firebase():
    global db
    
    # Use mock database if configured, credentials don't exist, or Firebase not available
    if not FIREBASE_AVAILABLE or settings.USE_MOCK_DB or not os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
        print("⚠️  Using MOCK database (in-memory). Set USE_MOCK_DB=False and add firebase-credentials.json for production.")
        db = MockFirestore()
        return db
    
    # Initialize real Firebase
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred, {
            'projectId': settings.GCP_PROJECT_ID,
        })
    db = firestore.client()
    return db

def get_db():
    global db
    if db is None:
        db = initialize_firebase()
    return db

def verify_firebase_token(token: str):
    """Verify Firebase ID token"""
    if not FIREBASE_AVAILABLE:
        return None
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        return None
