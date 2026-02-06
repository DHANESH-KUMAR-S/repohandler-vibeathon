"""
Quick test script to verify the API is working
Run after starting the server: python test_local.py
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    print("🧪 Testing RepoHandler API\n")
    
    # Test 1: Health check
    print("1️⃣  Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}\n")
    
    # Test 2: Team login
    print("2️⃣  Testing team login...")
    login_data = {
        "teamId": "TEAM-001",
        "email": "test@example.com"
    }
    response = requests.post(f"{BASE_URL}/api/auth/team-login", json=login_data)
    print(f"   Status: {response.status_code}")
    result = response.json()
    print(f"   Token: {result.get('token')}\n")
    
    team_token = result.get('token')
    headers = {"Authorization": f"Bearer {team_token}"}
    
    # Test 3: Create project
    print("3️⃣  Testing create project...")
    project_data = {
        "name": "Test Project",
        "description": "A test project for the hackathon",
        "githubUrl": "https://github.com/test/repo",
        "features": [
            {"id": "1", "text": "Feature 1"},
            {"id": "2", "text": "Feature 2"}
        ]
    }
    response = requests.post(f"{BASE_URL}/api/projects/", json=project_data, headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 201:
        project = response.json()
        print(f"   Project ID: {project.get('id')}")
        print(f"   Project Name: {project.get('name')}\n")
        project_id = project.get('id')
    else:
        print(f"   Error: {response.text}\n")
        return
    
    # Test 4: Get team projects
    print("4️⃣  Testing get team projects...")
    response = requests.get(f"{BASE_URL}/api/projects/", headers=headers)
    print(f"   Status: {response.status_code}")
    projects = response.json()
    print(f"   Projects count: {len(projects)}\n")
    
    # Test 5: Admin login
    print("5️⃣  Testing admin login...")
    admin_data = {"password": "admin123"}
    response = requests.post(f"{BASE_URL}/api/auth/admin-login", json=admin_data)
    print(f"   Status: {response.status_code}")
    admin_result = response.json()
    print(f"   Token: {admin_result.get('token')}\n")
    
    admin_token = admin_result.get('token')
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Test 6: Get all projects (admin)
    print("6️⃣  Testing admin get all projects...")
    response = requests.get(f"{BASE_URL}/api/admin/projects", headers=admin_headers)
    print(f"   Status: {response.status_code}")
    all_projects = response.json()
    print(f"   Total projects: {len(all_projects)}\n")
    
    # Test 7: Get stats (admin)
    print("7️⃣  Testing admin stats...")
    response = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers)
    print(f"   Status: {response.status_code}")
    stats = response.json()
    print(f"   Stats: {json.dumps(stats, indent=2)}\n")
    
    print("✅ All tests completed!")

if __name__ == "__main__":
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API. Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")
