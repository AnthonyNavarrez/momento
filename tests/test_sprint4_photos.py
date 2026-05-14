"""
E2E tests for Sprint 4 — Photo Upload API.

Requires the Express backend to be running on port 5001.
"""

import io
import requests
import pytest


def make_test_image(filename="test.jpg", content_type="image/jpeg"):
    """Create a minimal valid JPEG file-like object for upload."""
    # Minimal JPEG: SOI marker + bare minimum to be recognized
    jpeg_bytes = (
        b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00"
        b"\xff\xd9"
    )
    return (filename, io.BytesIO(jpeg_bytes), content_type)


class TestUploadPhoto:
    """Tests for POST /api/photos"""

    def test_upload_valid_photo(self, base_url, auth_header):
        """Upload a photo with valid data returns 201 with correct fields."""
        files = {"photo": make_test_image()}
        data = {
            "lat": "34.0522",
            "lng": "-118.2437",
            "caption": "Test photo at LA",
            "tags": '["test", "la"]',
        }
        resp = requests.post(
            f"{base_url}/api/photos", headers=auth_header, files=files, data=data
        )
        assert resp.status_code == 201
        body = resp.json()
        assert "_id" in body
        assert body["caption"] == "Test photo at LA"
        assert body["location"]["lat"] == 34.0522
        assert body["location"]["lng"] == -118.2437
        assert body["imageUrl"].startswith("/uploads/")
        assert "test" in body["tags"]
        assert "la" in body["tags"]

    def test_upload_without_file(self, base_url, auth_header):
        """Upload without a file returns 400."""
        data = {"lat": "34.0522", "lng": "-118.2437"}
        resp = requests.post(
            f"{base_url}/api/photos", headers=auth_header, data=data
        )
        assert resp.status_code == 400
        assert "message" in resp.json()

    def test_upload_without_location(self, base_url, auth_header):
        """Upload without lat/lng returns 400."""
        files = {"photo": make_test_image()}
        data = {"caption": "No location"}
        resp = requests.post(
            f"{base_url}/api/photos", headers=auth_header, files=files, data=data
        )
        assert resp.status_code == 400
        assert "message" in resp.json()

    def test_upload_invalid_file_type(self, base_url, auth_header):
        """Upload a non-image file type returns 400 (multer rejection)."""
        fake_file = ("test.txt", io.BytesIO(b"not an image"), "text/plain")
        files = {"photo": fake_file}
        data = {"lat": "34.0522", "lng": "-118.2437"}
        resp = requests.post(
            f"{base_url}/api/photos", headers=auth_header, files=files, data=data
        )
        # Multer file filter rejects non-image types
        assert resp.status_code in (400, 500)

    def test_upload_without_auth(self, base_url):
        """Upload without auth token returns 401."""
        files = {"photo": make_test_image()}
        data = {"lat": "34.0522", "lng": "-118.2437"}
        resp = requests.post(f"{base_url}/api/photos", files=files, data=data)
        assert resp.status_code == 401


class TestGetPhotos:
    """Tests for GET /api/photos"""

    def test_get_user_photos(self, base_url, auth_header):
        """Get user's photos returns 200 with an array."""
        resp = requests.get(f"{base_url}/api/photos", headers=auth_header)
        assert resp.status_code == 200
        body = resp.json()
        assert isinstance(body, list)
        assert len(body) >= 1  # At least the photo uploaded in earlier tests

    def test_get_photos_without_auth(self, base_url):
        """Get photos without auth returns 401."""
        resp = requests.get(f"{base_url}/api/photos")
        assert resp.status_code == 401


class TestGetPhotoById:
    """Tests for GET /api/photos/:id"""

    def test_get_photo_by_id(self, base_url, auth_header):
        """Get a specific photo by ID returns correct data."""
        # First, get user's photos to find an ID
        list_resp = requests.get(f"{base_url}/api/photos", headers=auth_header)
        assert list_resp.status_code == 200
        photos = list_resp.json()
        assert len(photos) > 0

        photo_id = photos[0]["_id"]
        resp = requests.get(
            f"{base_url}/api/photos/{photo_id}", headers=auth_header
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["_id"] == photo_id
        assert "imageUrl" in body
        assert "location" in body

    def test_get_nonexistent_photo(self, base_url, auth_header):
        """Get a photo with an invalid ID returns 404 or 500."""
        fake_id = "000000000000000000000000"
        resp = requests.get(
            f"{base_url}/api/photos/{fake_id}", headers=auth_header
        )
        assert resp.status_code in (404, 500)


class TestDeletePhoto:
    """Tests for DELETE /api/photos/:id"""

    def test_delete_other_users_photo(self, base_url, auth_header, second_user_auth_header):
        """Deleting another user's photo returns 403."""
        # Upload a photo as the primary user
        files = {"photo": make_test_image()}
        data = {"lat": "34.0", "lng": "-118.0"}
        upload_resp = requests.post(
            f"{base_url}/api/photos", headers=auth_header, files=files, data=data
        )
        assert upload_resp.status_code == 201
        photo_id = upload_resp.json()["_id"]

        # Try to delete it as the second user
        del_resp = requests.delete(
            f"{base_url}/api/photos/{photo_id}", headers=second_user_auth_header
        )
        assert del_resp.status_code == 403

    def test_delete_own_photo(self, base_url, auth_header):
        """Delete own photo returns 200, then GET returns 404."""
        # Upload a photo to delete
        files = {"photo": make_test_image()}
        data = {"lat": "34.1", "lng": "-118.1", "caption": "to be deleted"}
        upload_resp = requests.post(
            f"{base_url}/api/photos", headers=auth_header, files=files, data=data
        )
        assert upload_resp.status_code == 201
        photo_id = upload_resp.json()["_id"]

        # Delete it
        del_resp = requests.delete(
            f"{base_url}/api/photos/{photo_id}", headers=auth_header
        )
        assert del_resp.status_code == 200
        assert del_resp.json()["message"] == "Photo deleted"

        # Confirm it's gone
        get_resp = requests.get(
            f"{base_url}/api/photos/{photo_id}", headers=auth_header
        )
        assert get_resp.status_code == 404
