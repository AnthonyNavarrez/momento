"""
[GenAI Use] Prompt:
Write a pytest E2E test file for the GET /api/photos/search endpoint following the same pattern as tests/test_sprint4_photos.py. the tests should cover search by caption text, search by tag text, filter by single tag, filter by multiple comma-separated tags, search with no results, date range filter, pagination, and auth required
"""
# [GenAI Use] LLM Response Start
import io
import json
import time
import requests
import pytest


def make_test_image(filename="test.jpg", content_type="image/jpeg"):
    """Create a minimal valid JPEG file-like object for upload."""
    jpeg_bytes = (
        b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00"
        b"\xff\xd9"
    )
    return (filename, io.BytesIO(jpeg_bytes), content_type)


class TestSearchPhotos:
    """Tests for GET /api/photos/search"""

    def _upload(self, base_url, auth_header, caption, tags):
        """Upload a test photo and return its ID."""
        files = {"photo": make_test_image()}
        data = {
            "lat": "34.0522",
            "lng": "-118.2437",
            "caption": caption,
            "tags": json.dumps(tags),
        }
        resp = requests.post(
            f"{base_url}/api/photos", headers=auth_header, files=files, data=data
        )
        assert resp.status_code == 201
        return resp.json()["_id"]

    def test_search_by_caption(self, base_url, auth_header):
        """Search by caption text returns matching photos."""
        self._upload(base_url, auth_header, "Sunset at the pier", ["sunset", "beach"])

        resp = requests.get(
            f"{base_url}/api/photos/search",
            headers=auth_header,
            params={"q": "Sunset at the pier"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["totalPhotos"] >= 1
        captions = [p["caption"] for p in body["photos"]]
        assert any("Sunset" in c for c in captions)

    def test_search_by_tag_text(self, base_url, auth_header):
        """Search by q matching a tag returns photos with that tag."""
        self._upload(base_url, auth_header, "Beach volleyball", ["beach", "sports"])

        resp = requests.get(
            f"{base_url}/api/photos/search",
            headers=auth_header,
            params={"q": "beach"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["totalPhotos"] >= 1

    def test_filter_by_single_tag(self, base_url, auth_header):
        """Filter by tags= returns only photos containing that tag."""
        self._upload(base_url, auth_header, "Coffee shop on Main", ["coffee", "food"])

        resp = requests.get(
            f"{base_url}/api/photos/search",
            headers=auth_header,
            params={"tags": "coffee"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["totalPhotos"] >= 1
        for photo in body["photos"]:
            assert "coffee" in photo["tags"]

    def test_filter_by_multiple_tags(self, base_url, auth_header):
        """Filter by multiple comma-separated tags returns photos matching any."""
        self._upload(base_url, auth_header, "Sunset at the pier", ["sunset", "beach"])
        self._upload(base_url, auth_header, "Coffee shop on Main", ["coffee", "food"])

        resp = requests.get(
            f"{base_url}/api/photos/search",
            headers=auth_header,
            params={"tags": "sunset,coffee"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["totalPhotos"] >= 2

    def test_search_no_results(self, base_url, auth_header):
        """Search with no matching text returns empty results."""
        resp = requests.get(
            f"{base_url}/api/photos/search",
            headers=auth_header,
            params={"q": "zzznoresultszzzxxx"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["totalPhotos"] == 0
        assert body["photos"] == []

    def test_filter_by_date_range(self, base_url, auth_header):
        """Date range filter returns photos uploaded today."""
        self._upload(base_url, auth_header, "Today's photo", ["today"])
        today_start = time.strftime("%Y-%m-%d") + "T00:00:00"
        today_end = time.strftime("%Y-%m-%d") + "T23:59:59"

        resp = requests.get(
            f"{base_url}/api/photos/search",
            headers=auth_header,
            params={"startDate": today_start, "endDate": today_end},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["totalPhotos"] >= 1

    def test_pagination(self, base_url, auth_header):
        """Pagination returns correct page size and totalPages."""
        self._upload(base_url, auth_header, "Pagination photo one", ["pagtest"])
        self._upload(base_url, auth_header, "Pagination photo two", ["pagtest"])

        resp = requests.get(
            f"{base_url}/api/photos/search",
            headers=auth_header,
            params={"tags": "pagtest", "page": 1, "limit": 1},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert len(body["photos"]) == 1
        assert body["totalPages"] >= 2

    def test_search_requires_auth(self, base_url):
        """Search without auth token returns 401."""
        resp = requests.get(
            f"{base_url}/api/photos/search", params={"q": "test"}
        )
        assert resp.status_code == 401
# [GenAI Use] LLM Response End
"""
[GenAI Use] Reflection:
I reviewed the generated test file and found verified each test case covered the right 
boundary condition and asserts that every returned photo actually contains the tag
"""
