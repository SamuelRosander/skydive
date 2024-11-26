def test_videos(client):
    response = client.get("/videos/")

    assert response.status_code == 200, "Status code not 200"
    assert b"<title>Video Archive</title>" in response.data, "Incorrect page title"
