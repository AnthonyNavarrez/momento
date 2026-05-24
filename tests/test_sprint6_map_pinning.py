"""
E2E tests for Sprint 6 — Map pinning / photo ordering.

Requires the Express backend to be running on port 5001.
"""

import io
import time
import requests


def make_test_image(filename="test.jpg", content_type="image/jpeg"):
    """Create a minimal valid JPEG file-like object for upload."""
    jpeg_bytes = (
        b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00"
        b"\xff\xd9"
    )
    return (filename, io.BytesIO(jpeg_bytes), content_type)


class TestMapPinning:
    """Tests upload → fetch → verify cycle used by the map."""

    def test_upload_and_fetch_photo(self, base_url, auth_header):
        # Upload a single photo with lat/lng
        files = {"photo": make_test_image()}
        data = {"lat": "34.0522", "lng": "-118.2437", "caption": "Pin test"}
        resp = requests.post(f"{base_url}/api/photos", headers=auth_header, files=files, data=data)
        assert resp.status_code == 201, resp.text
        body = resp.json()
        assert "_id" in body
        photo_id = body["_id"]

        # Fetch list and ensure the uploaded photo is present with correct location and imageUrl
        list_resp = requests.get(f"{base_url}/api/photos", headers=auth_header)
        assert list_resp.status_code == 200
        photos = list_resp.json()
        # Find our photo in the returned list
        found = None
        for p in photos:
            if p.get("_id") == photo_id:
                found = p
                break

        assert found is not None, "Uploaded photo not found in GET /api/photos"
        assert found.get("location", {}).get("lat") == 34.0522
        assert found.get("location", {}).get("lng") == -118.2437
        assert isinstance(found.get("imageUrl"), str)
        assert found.get("imageUrl").startswith("/uploads/"), "imageUrl should start with /uploads/"

    def test_multiple_uploads_sorted_newest_first(self, base_url, auth_header):
        # Upload two photos sequentially and verify ordering returned by GET /api/photos is newest-first
        files1 = {"photo": make_test_image("one.jpg")}
        data1 = {"lat": "34.1", "lng": "-118.1", "caption": "Older"}
        r1 = requests.post(f"{base_url}/api/photos", headers=auth_header, files=files1, data=data1)
        assert r1.status_code == 201, r1.text
        id1 = r1.json()["_id"]

        # short sleep to ensure createdAt ordering
        time.sleep(0.5)

        files2 = {"photo": make_test_image("two.jpg")}
        data2 = {"lat": "34.2", "lng": "-118.2", "caption": "Newer"}
        r2 = requests.post(f"{base_url}/api/photos", headers=auth_header, files=files2, data=data2)
        assert r2.status_code == 201, r2.text
        id2 = r2.json()["_id"]

        list_resp = requests.get(f"{base_url}/api/photos", headers=auth_header)
        assert list_resp.status_code == 200
        photos = list_resp.json()
        # Build list of ids in returned order
        returned_ids = [p.get("_id") for p in photos]

        assert id2 in returned_ids and id1 in returned_ids
        assert returned_ids.index(id2) < returned_ids.index(id1), "Newest photo should come before older photo"

    def test_image_url_is_accessible(self, base_url, auth_header):
        """Verify that the imageUrl returned by upload is accessible (for map popups)."""
        # Upload a photo and get the imageUrl
        files = {"photo": make_test_image()}
        data = {"lat": "34.05", "lng": "-118.25", "caption": "Image accessibility test"}
        resp = requests.post(f"{base_url}/api/photos", headers=auth_header, files=files, data=data)
        assert resp.status_code == 201, resp.text
        image_url = resp.json().get("imageUrl")
        assert image_url is not None, "imageUrl should be in response"

        # Construct full URL if relative
        if image_url.startswith("/"):
            full_url = base_url + image_url
        else:
            full_url = image_url

        # GET the image and verify it's accessible
        img_resp = requests.get(full_url)
        assert img_resp.status_code == 200, f"Image URL {full_url} returned {img_resp.status_code}"
        assert len(img_resp.content) > 0, "Image content should not be empty"
