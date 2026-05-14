import time
import pytest
import requests

BASE_URL = "http://localhost:5001"


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture(scope="session")
def test_user_credentials():
    """Generate unique credentials for this test run."""
    ts = int(time.time() * 1000)
    return {
        "username": f"testuser_{ts}",
        "email": f"testuser_{ts}@test.com",
        "password": "TestPass123!",
    }


@pytest.fixture(scope="session")
def auth_token(base_url, test_user_credentials):
    """Register a test user and return the JWT token."""
    resp = requests.post(
        f"{base_url}/api/auth/register", json=test_user_credentials
    )
    assert resp.status_code == 201, f"Failed to register test user: {resp.text}"
    data = resp.json()
    assert "token" in data
    return data["token"]


@pytest.fixture(scope="session")
def auth_header(auth_token):
    """Return an Authorization header dict with the Bearer token."""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture(scope="session")
def second_user_auth_header(base_url):
    """Register a second test user and return their auth header."""
    ts = int(time.time() * 1000)
    creds = {
        "username": f"testuser2_{ts}",
        "email": f"testuser2_{ts}@test.com",
        "password": "TestPass456!",
    }
    resp = requests.post(f"{base_url}/api/auth/register", json=creds)
    assert resp.status_code == 201, f"Failed to register second user: {resp.text}"
    token = resp.json()["token"]
    return {"Authorization": f"Bearer {token}"}
