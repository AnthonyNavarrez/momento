"""
E2E tests for Sprint 9 — Heatmap endpoint.

Requires the Express backend to be running on port 5001.
"""

import io
import requests
import pytest


def make_test_image(filename="test.jpg", content_type="image/jpeg"):
    """Create a minimal valid JPEG file-like object for upload."""
    jpeg_bytes = (
        b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00"
        b"\xff\xd9"
    )
    return (filename, io.BytesIO(jpeg_bytes), content_type)


def upload_photo(base_url, auth_header, lat, lng, is_public=False, caption=""):
    """Helper to upload a photo and return the response JSON."""
    files = {"photo": make_test_image()}
    data = {
        "lat": str(lat),
        "lng": str(lng),
        "caption": caption,
        "isPublic": "true" if is_public else "false",
    }
    resp = requests.post(
        f"{base_url}/api/photos", headers=auth_header, files=files, data=data
    )
    assert resp.status_code == 201
    return resp.json()


@pytest.fixture(scope="module")
def public_photo(base_url, auth_header):
    """Upload a public photo for heatmap tests."""
    return upload_photo(
        base_url, auth_header, lat=34.0522, lng=-118.2437,
        is_public=True, caption="public heatmap test",
    )


@pytest.fixture(scope="module")
def private_photo(base_url, auth_header):
    """Upload a private photo for heatmap tests."""
    return upload_photo(
        base_url, auth_header, lat=34.0689, lng=-118.4452,
        is_public=False, caption="private heatmap test",
    )


class TestHeatmapEndpoint:
    """Tests for GET /api/photos/heatmap"""

    def test_heatmap_returns_200_with_correct_shape(self, base_url, public_photo):
        """GET /api/photos/heatmap returns 200 with points array and count."""
        resp = requests.get(f"{base_url}/api/photos/heatmap")
        assert resp.status_code == 200
        body = resp.json()
        assert "points" in body
        assert "count" in body
        assert isinstance(body["points"], list)
        assert isinstance(body["count"], int)

    def test_heatmap_points_are_coordinate_pairs(self, base_url, public_photo):
        """Each point is a [lat, lng] array, not a full photo object."""
        resp = requests.get(f"{base_url}/api/photos/heatmap")
        body = resp.json()
        assert body["count"] > 0
        for point in body["points"]:
            assert isinstance(point, list)
            assert len(point) == 2
            assert isinstance(point[0], (int, float))  # lat
            assert isinstance(point[1], (int, float))  # lng

    def test_heatmap_count_matches_points_length(self, base_url, public_photo):
        """count matches the length of the points array."""
        resp = requests.get(f"{base_url}/api/photos/heatmap")
        body = resp.json()
        assert body["count"] == len(body["points"])

    def test_heatmap_includes_public_photo(self, base_url, public_photo):
        """A public photo's coordinates appear in the heatmap."""
        resp = requests.get(f"{base_url}/api/photos/heatmap")
        body = resp.json()
        target = [public_photo["location"]["lat"], public_photo["location"]["lng"]]
        assert target in body["points"]

    def test_heatmap_excludes_private_photo(self, base_url, private_photo):
        """A private photo's coordinates do NOT appear in the heatmap."""
        resp = requests.get(f"{base_url}/api/photos/heatmap")
        body = resp.json()
        target = [private_photo["location"]["lat"], private_photo["location"]["lng"]]
        # The exact coordinate pair for the private photo should not be present.
        # Note: if another public photo happens to share the same coords, this
        # could be a false negative, but our test coords are unique.
        assert target not in body["points"]

    def test_heatmap_works_without_auth(self, base_url):
        """Heatmap is a public endpoint — no token needed."""
        resp = requests.get(f"{base_url}/api/photos/heatmap")
        assert resp.status_code == 200

    def test_heatmap_period_week(self, base_url, public_photo):
        """?period=week returns 200 and includes a just-uploaded public photo."""
        resp = requests.get(f"{base_url}/api/photos/heatmap?period=week")
        assert resp.status_code == 200
        body = resp.json()
        assert isinstance(body["points"], list)
        assert body["count"] == len(body["points"])
        # The photo was just uploaded, so it should appear in the past week
        target = [public_photo["location"]["lat"], public_photo["location"]["lng"]]
        assert target in body["points"]

    def test_heatmap_period_month(self, base_url, public_photo):
        """?period=month returns 200 and includes a just-uploaded public photo."""
        resp = requests.get(f"{base_url}/api/photos/heatmap?period=month")
        assert resp.status_code == 200
        body = resp.json()
        assert isinstance(body["points"], list)
        assert body["count"] == len(body["points"])
        target = [public_photo["location"]["lat"], public_photo["location"]["lng"]]
        assert target in body["points"]

    def test_heatmap_period_year(self, base_url, public_photo):
        """?period=year returns 200 and includes a just-uploaded public photo."""
        resp = requests.get(f"{base_url}/api/photos/heatmap?period=year")
        assert resp.status_code == 200
        body = resp.json()
        assert isinstance(body["points"], list)
        assert body["count"] == len(body["points"])
        target = [public_photo["location"]["lat"], public_photo["location"]["lng"]]
        assert target in body["points"]

    def test_heatmap_period_all(self, base_url, public_photo):
        """?period=all returns 200 and includes a just-uploaded public photo."""
        resp = requests.get(f"{base_url}/api/photos/heatmap?period=all")
        assert resp.status_code == 200
        body = resp.json()
        assert isinstance(body["points"], list)
        assert body["count"] == len(body["points"])
        target = [public_photo["location"]["lat"], public_photo["location"]["lng"]]
        assert target in body["points"]
